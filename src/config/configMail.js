const nodemailer = require('nodemailer')

class Mailer {
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: account.user, // generated ethereal user
              pass: account.pass // generated ethereal password
            }
          })
    }
}