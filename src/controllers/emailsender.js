const transporter = require('../config/emailtransporter.config');
const from = require('../config/constants.js').EMAIL;

const emailSender = async (req, res) => {

    if (!req.body.to && !req.body.subject && !req.body.text) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    try {

        const mailOpts = mailOptions(from, req.body.to, req.body.subject, req.body.text);

        trans(mailOpts);

        res.send({
            message: "Email sended successfully!!"
        });

    } catch (error) {

        res.status(500).send({
            message: err.message || "Some error occurred while creating turn"
        });

    }
}

const mailOptions = (from, to, subject, text) => {

    return {
        from: from,
        to: to,
        subject: subject,
        text: text,
        //html: `
        //  <h1>Sample Heading Here</h1>
        //  <p>message here</p>
        //`,
        //attachments: [
        //    {
        //        filename: 'image.png',
        //        path: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png>'
        //    }
        //]

    }

};


const trans = transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});



module.exports = emailSender;