const upload = require('./upload/upload.service.js');
const recording = require('./recording/recording.service.js');
const transcriptParser = require('./transcript-parser/transcript-parser.service.js');
const speaker = require('./speaker/speaker.service.js');
const transcript = require('./transcript/transcript.service.js');
const meetingRecord = require('./meeting-record/meeting-record.service.js');
const users = require('./users/users.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(upload);
  app.configure(recording);
  app.configure(transcriptParser);
  app.configure(speaker);
  app.configure(transcript);
  app.configure(meetingRecord);
  app.configure(users);
};
