var nodemailer = require('nodemailer');
const log4js = require("log4js");
const logger = log4js.getLogger();
const md5 = require("md5");

const sendMail = (async (mailto, subject, data) => {
  
    var transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        // secure: true,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });
    
    var mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: mailto,
        subject: subject,
        html: data
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            logger.info("sendMail");
            logger.info(error);
        }
        else{
         
            logger.info("email send");

        }
    });
});
module.exports = {
    sendMail,
}