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
        to: to,
        from: from,
        subject: subject,
        text: text,
    }

};


const trans = (mailOptions) => {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = emailSender;