import nodemailer from 'nodemailer';
import path from 'path';
import hbs from 'nodemailer-express-handlebars';
import mailgunTransport from 'nodemailer-mailgun-transport';

export async function Decrypt(values) {
    try {

        return decodeURIComponent(escape(atob(values)));
    } catch (err) {
        console.log("error while decrypt userPassword for mail", err.message);
    }
}

const sendmail = async (mailOptions: any) => {
    try {
        const api_key = process.env.MAILGUN_ACTIVE_API_KEY;
        const domain = process.env.MAILGUN_DOMAIN;


        // Configure transport options
        const mailgunOptions = {
            auth: {
                api_key: api_key,
                domain: domain,
            }
        }
        const transport = nodemailer.createTransport(mailgunTransport(mailgunOptions))

        const handlebarOptions = {
            viewEngine: {
                partialsDir: path.resolve('./src/templates/'),
                defaultLayout: false,
            },
            viewPath: path.resolve('./src/templates/'),
        };

        transport.use('compile', hbs(handlebarOptions));

        mailOptions.from = process.env.MAILGUN_FROM_EMAIL;

        await transport.sendMail(mailOptions, function (error: any, info: any) {
            if (error) {
                console.log('Email error: ', error);
            }
            else {
                console.log('Email sent: ', info);
            }
        })
    } catch (error) {
        console.error('Error sending email:', error);
        // res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
}

export {
    sendmail
}