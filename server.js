
const express = require('express')
const app = express()
const path = require('path')

const indexPage = path.join(__dirname + '/templates/index.html')

app.get('/', (req, res) => res.sendFile(indexPage));

app.listen(3000)

  


/*
GET
/address
Scrape the address that the url is linked to.
 - check if we have it in db first.

/history
Column data: Datetime | Reason | Duration

/history/:date
Get information for given date.
Then also get pdf file to frontend.

/uptime
Data graph for w/ red and green interval bars



PAGES
/index.html
What address is being monitored
Bar graph of time intervals w/ green and red indication of downtime.
(date below)
Activity log

/incident/:date

*/
