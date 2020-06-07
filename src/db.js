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
const getEventById = (id) => Event.findById(id).exec()

const getAlternatingEventStatuses = () => Event.find().exec()
  .then(events => {
    let lastEventStatus;
    return events.filter(event => {
      if (event.isOk != lastEventStatus) {
        lastEventStatus = event.isOk;
        return event
      }
    })
  })

const getEventStatus = () => Event.find().select('date isOk').exec()
  .then(events => events.reverse())

module.exports = {
  commitServiceEventToDatabase,
  getAllEvents,
  getEventById,
  getAlternatingEventStatuses,
  getEventStatus
}