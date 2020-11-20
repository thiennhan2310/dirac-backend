/* eslint-disable no-unused-vars */
const AWS = require('aws-sdk');
const fs = require('fs');
const https = require('https');
const SrtConvert = require('./srtConvert');
const get = require('lodash/get');
const path = require('path');
const transform =(s3File) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(process.cwd(),'./uploads/data.json');
    const file = fs.createWriteStream(filePath);
    https.get(s3File, response => {
      var stream = response.pipe(file);
    
      stream.on('finish', function() {
        const lines = SrtConvert(require(filePath));
        return resolve(lines);
      });
    });
  });
};

class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    return [];
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }
  

  async update (id, data, params) {
    const transcribeservice = new AWS.TranscribeService({
      accessKeyId: this.options.app.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.options.app.get('AWS_SECRET_ACCESS_KEY'),
      region:'ap-southeast-1'
    });
    const job  ={TranscriptionJobName:`dirac-dev-${id}`};
    const rep = await  transcribeservice.getTranscriptionJob(job).promise();
    const s3File =rep.TranscriptionJob.Transcript.RedactedTranscriptFileUri;
    const status = rep.TranscriptionJob.TranscriptionJobStatus;
    await this.options.app.service('recording').patch(id,{status});
    if(status !== 'COMPLETED'){
      return; 
    }

    const {lines,speakers} = await transform(s3File);
    const speakerIds = await this.options.app.service('speaker').create(speakers);
    
    const insertData = lines.map(l=>{
      const speakerIdx = speakers.findIndex(v=>v===l.speaker);
      return {
        speaker_id : get(speakerIds ,`${speakerIdx}.id`),
        recording_id : id,
        content : l.line,
        start_time : l.time,
      };
    });
    await this.options.app.service('transcript').create(insertData);
    return {message:'done'};

  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
