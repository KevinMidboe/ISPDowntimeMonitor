
const express = require('express')
const fs = require('fs');
const app = express()
const config = require('../config')

const { getAllEvents,
  getEventById,
  getAlternatingEventStatuses,
  getEventStatus
} = require('./db.js');

const PORT = 3000;

// Website and assets
app.use(express.static(__dirname + '/site'))
app.get('/', (req, res) => res.sendFile('index.html'));


// Data api endpoints
app.get('/logs', (req, res) =>
  getAllEvents()
    .then(allEvents => res.send(allEvents))
)

app.get('/logs/alternating', (req, res) =>
  getAlternatingEventStatuses()
    .then(allEvents => res.send(allEvents))
)

app.get('/logs/:id', (req, res) =>
  getEventById(req.params.id)
    .then(event => res.send(event))
)

app.get('/uptime', (req, res) =>
  getEventStatus()
    .then(eventStatuses => res.send(eventStatuses))
)

app.get('/pdf/:id', (req, res) =>
  getEventById(req.params.id)
    .then(event => {
      const path = __dirname + '/../pdfExports/' + event.pdfFilename;

      try {
        const file = fs.readFileSync(path);
        res.setHeader('Content-Type', 'application/pdf');
        return res.status(200).send(file)
      } catch (err) {
        console.error('Error when reading file:', err);
        return res.status(500).send({ message: 'Something went wrong reading file.' })
      }
    })
)

app.listen(PORT)
