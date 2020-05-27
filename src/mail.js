const nodemailer = require( 'nodemailer')
const config = require('../config.js')

class Mail {
  constructor(sender=undefined, password=undefined, recipient=undefined) {
    this.sender = sender || config.senderEmail;
    this.password = password || config.senderPassword;
    this.recipient = recipient || config.recipientEmail;
    this.transporter = this.setupTransporter();
  }

  setupTransporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.sender,
        pass: this.password
      }
    })
  }

  sendMail = message => this.transporter.sendMail(message);

  sendAttachment = fileRef => {
    const message = {
      from: `"Fred Foo 👻" <${this.sender}>`,
      to: this.recipient,
      subject: 'Telenor nedetid',
      text: "hello wordl",
      html: "<p>hello wordl</p>",
      attachments: [{
        path: fileRef 
      }]
    }

    return this.sendMail(message) 
  }
}

module.exports = Mail
