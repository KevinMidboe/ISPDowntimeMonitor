// custom-header-footer.js

// const common = require('./common')
const puppeteer = require('puppeteer')
const config = require('../config')
const Mail = require( './mail.js');
const mail = new Mail();

const {
  commitServiceEventToDatabase,
  getAllEvents,
  anyDowntimeThisCalendarMonth
} = require('./db.js');

let browser = undefined;
if (config.debug == false)
  console.log = () => {}

const dateString = new Date().getTime();
const pdfFilename = (config['pdfFilename'] || 'telenor-downtime') + `_${dateString}.pdf`;

const savePageToPDF = page => {
  const pdfOptions = {
    path: `pdfExports/${pdfFilename}`,
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `<div style="font-size:11px;white-space:nowrap;margin-left:38px;">
                        ${new Date().toLocaleString('nb-NO')}
                        <span style="margin-left: 10px;">
                          ${ config.url }
                        </span>
                    </div>`,
    footerTemplate: `<div style="font-size:7px;white-space:nowrap;margin-left:38px;width:100%;">
                        <span style="display:inline-block;float:right;margin-right:10px;">
                            <span class="pageNumber"></span> / <span class="totalPages"></span>
                        </span>
                    </div>`,
    margin: {
      top: '38px',
      right: '38px',
      bottom: '38px',
      left: '38px'
    }
  }

  console.log('Saving page content to pdf.')
  return page.setViewport({ width: 1920, height: 1080 })
    .then(() => page.pdf(pdfOptions))
    .then(() => Promise.resolve(page))
 }

const exitWithError = (err, message=undefined) => {
  if (message)
    console.error(message);
  else
    console.error('Unexpected error occured')

  if (config.debug === true)
    console.error(err)

  closeBrowserAndExit(1);
}

const dismissCookiePrompt = page => {
  console.log("Dismissing cookie consent prompt")

  return page.$('a#consent_prompt_submit')
    .catch(err => exitWithError(err, 'Could not find cookie consent prompt on page'))
    .then(consentLink => {
      if (consentLink == null)
        page.evaluate(() => document.body.innerHTML)
      else
        consentLink.evaluate(link => link.click())

      return page
    })
}

const getServiceMessages = page => {
  const statusTextOkTemplate = 'Vi fant ingen registrerte feil'
 
  return page.evaluate((statusTextTemplate) => {
    const messages = [];
    document.querySelectorAll(".service-message-wrapper").forEach(serviceMessage => {
      messages.push({
        iconStatus: serviceMessage.classList.contains('color-ok'),
        statusText: serviceMessage.getElementsByClassName('short-info')[0].innerText,
        isOk: serviceMessage.innerText.includes(statusTextTemplate)
      })
    })

    return messages
  }, statusTextOkTemplate)
};

const notifyIfDown = serviceMessages => {
  const servicesDown = serviceMessages.filter(message => message.isOk == false)

  if (servicesDown.length) {
    console.log("Following services are down:\n", servicesDown)

    mail.sendAttachment('./telenor-downtime.pdf')
      .then(resp => console.log(`Message id: ${resp.messageId} sent.\nResponse content: ${resp}`))
  } else {
    console.info("All service operational");
  }
}

const webscraper = async pageURL => {
  browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  console.log(`Opening page with url: ${pageURL}`)
  return page.goto(pageURL, { waitUntil: 'networkidle0' })
    .then(() => Promise.resolve(page))
    .catch(err => exitWithError(err, `Unable to reach url: ${pageURL}`))
}

function closeBrowserAndExit(status=0) {
  browser.close();
  process.exit(status);
}

const resolveIfNoDowntimeYetThisMonth = msg => anyDowntimeThisCalendarMonth()
  .then(anyDowntime => anyDowntime == false ? Promise.resolve(msg) : Promise.reject())

function run() {
  webscraper(config.url)
    .then(page => dismissCookiePrompt(page))
    .then(page => savePageToPDF(page))
    .then(page => getServiceMessages(page))
    .then(serviceMessages => commitServiceEventToDatabase(serviceMessages, pdfFilename))
    .then(serviceMessages => resolveIfNoDowntimeYetThisMonth(serviceMessages))
    .then(serviceMessages => notifyIfDown(serviceMessages))
    .finally(closeBrowserAndExit)
}

run();

