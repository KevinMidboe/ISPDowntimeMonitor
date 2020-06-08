# ISPDowntimeMonitor
Monitor and notify if ISP reports any services for a given address non-operational. 

> Note! This is currently supported for addresses that have telenor as their ISP.

![](https://imgur.com/9lTiq5U.png)

# Setup
If this is your first node project jump to Node and Yarn setup [below](#node-and-yarn-setup).

After the repo is cloned, navigate to it:

```bash
cd ISPDowntimeMonitor/
```

Install required packages:

```bash
yarn
```

If you don't have mongo running, run it using docker:
```bash
mkdir -p $HOME/docker/mongodb/
sudo docker run -d --name mongodb -p 27017:27017 -v $HOME/docker/mongodb:/data/db mongo
```
Install docker from: https://docs.docker.com/get-docker/.  
> Note! The folderpath `$HOME/docker/mongodb/` can be change to any other folder.

# Config
Create a local configuration file from the included example config:   
```bash
cp config.js.example config.js
```

To be notified when any services are down you need to fill in a gmail email and password and a recipient email address. 
It is highly adviced (and required if 2FA is enabled) to create a unique App Password at: https://myaccount.google.com/apppasswords.

Go to the ISP's page for checking service status by address https://www.telenor.no/privat/kundeservice/dmf/. After entering your address copy the pages url.

If my information was:
 - sender: no-reply@midboe.com
 - password: pass123
 - recipient: kevin@midboe.com
 - search url: https://www.telenor.no/privat/kundeservice/dmf/sok/168443300

then my config would look like:

```javascript
module.exports = {
  senderEmail: 'no-reply@midboe.com',
  senderPassword: 'pass123',
  recipientEmail: 'kevin@midboe.com',
  url: 'https://www.telenor.no/privat/kundeservice/dmf/sok/168443300',
  debug: false
}
```

### Optional
Debug set to `true` for debug logs.  
Can also set `pdfFilename` to overwrite filename prefix (default: `telenor-downtime`).

# Usage
We have two commands `start` & `scrape`. Start boots express serving the website for visual representation of downtime data; and Scrape for checking and logging contents of ISP monitor page.

Start the webserver:
```bash
yarn start
```
Open http://localhost:3000/ in your browser.

Run the scraper:
```bash
yarn scrape
```
This saves a pdf of the page to `pdfExports/` within the project folder, and logs the uptime status to the database.

# Running as a service
If on any linux platform you should have `systemd` installed. We want to create a service that both runs & restarts our webserver if necessary and want a scheduled job to run for scraping.   

Remember to replace `YOUR_PROJECT_DIRECTORY` w/ the full path to where you have the `ISPDowntimeMonitor/` folder.   

Main server start service:
```
# /etc/systemd/system/ispmonitor.service

[Unit]
Description=ISP monitor daemon
Wants=isp-scraper.timer

[Service]
WorkingDirectory=YOUR_PROJECT_DIRECTORY
ExecStart=/usr/bin/yarn start
 ExecStartPre=/usr/bin/docker start mongodb
Restart=always

# Restart service after 10 seconds if node service crashes
RestartSec=10

# Output to syslog
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=ispmonitor

[Install]
WantedBy=multi-user.target
```

Timer service:  
```
# /etc/systemd/system/isp-scraper.timer

[Unit]
Description=Run scraper for isp monitor every 30 minutes.

...
TODO COMPLETE THIS SETUP
```

# Node and yarn setup
## Node
We need node to run our javascript and yarn as our package manager to install required javascript packages.
First check if you have node installed with by running `node -v` in your terminal.

If not check out nodejs.org's download page here: https://nodejs.org/en/download/package-manager/.

Ubuntu/raspberry pi users can add node to apt following these instructions: https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions

## Yarn
To get yarn check their site for always up-to-date info here https://classic.yarnpkg.com/en/docs/install/#mac-stable.

One of the easiest ways to install Yarn on macOS and generic Unix environments is via their shell script. You can install Yarn by running the following code in your terminal:

```bash
curl -o- -L https://yarnpkg.com/install.sh | bash
```

We are done! Jump [back up](#setup) to continue project setup!
