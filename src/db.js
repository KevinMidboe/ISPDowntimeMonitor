const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/ispmonitor", {
  useNewUrlParser: true
});

const Event = require('./schemas/Event');

const commitServiceEventToDatabase = async (serviceMessages, pdfFilename) => {
  try {
    // we only care about the second message
    const message = serviceMessages[1]
    const event = new Event({
      date: new Date(),
      isOk: message.isOk,
      message: message.statusText,
      pdfFilename
    })

    await event.save();
    return serviceMessages
  } catch (err) {
    console.error('error from mongoose:')
    console.error(err)
    return serviceMessages
  }
}

const getAllEvents = () => Event.find().exec()

module.exports = {
  commitServiceEventToDatabase,
  getAllEvents
}