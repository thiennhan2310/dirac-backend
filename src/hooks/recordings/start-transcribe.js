const AWS = require('aws-sdk');


module.exports = function (context) {
  const transcribeservice = new AWS.TranscribeService({
    accessKeyId: context.app.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: context.app.get('AWS_SECRET_ACCESS_KEY'),
    region:'ap-southeast-1'
  });
  var params = {
    TranscriptionJobName: `dirac-dev-${context.result.id}`, //required
    Media: { /* required */
      MediaFileUri: `s3://transcripts-dirac/${context.data.url}`
    },
    ContentRedaction: {
      RedactionOutput: 'redacted' ,
      RedactionType: 'PII' 
    },
    LanguageCode: 'en-US',
    MediaFormat: 'webm',
    Settings: {
      MaxSpeakerLabels:2,
      ShowSpeakerLabels: true ,
    }
  };

  transcribeservice.startTranscriptionJob(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
    
};