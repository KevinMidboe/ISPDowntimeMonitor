const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Event = new Schema({
  date: Date,
  isOk: Boolean,
  message: String,
  pdfFilename: String
})

module.exports = mongoose.model('Event', Event);