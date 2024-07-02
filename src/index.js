
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
const turnRoute = require('./routes/turn');
const emailRoute = require('./routes/email');
const googleOauth2Route = require('./routes/googleoauth2.js');
const authRouter = require('./security/auth.js');
const dotenv = require('dotenv');
const cookieSession = require('cookie-session');
const passport = require('./security/passport.js');
const PORT = require('./config/constants').PORT;
const session = require('express-session');
//const defaultTurnData = require('./config/defaultdata.js');
//const defaultEventData = require('./config/defaultdata.js');
const AvailableRangeTurn = require('./models/availablerangeturns');

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const whitelist = ['http://localhost:3100', 'http://localhost:4200', 'http://localhost:8500', 'http://localhost:8100',];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions))

app.use(session({
    secret: 'thesessionsecret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Mongodb database Connected Successfully!!");
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});


//app.use(defaultTurnData);

const defaultTurnData = async () => {

    const turnRange = new AvailableRangeTurn({
        event: 'firstEvent',
        dayValues: [1, 5, 10, 15, 20, 25, 30],
        hourValues: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
        minuteValues: [0, 30],
        minDate: '2024-06-01T09:00:00',
        maxDate: '2024-07-15T17:59:59'
    });

    //const exist = await turnRange.findOne({ event: 'firstEvent' });

    //if (!exist) {
        await turnRange.save().then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err);
        });
    //}

}

//defaultTurnData();
//defaultEventData();

app.use('/user', userRoute);

app.use('/turn', turnRoute);

app.use('/email', emailRoute);

app.use("/api/v1/auth", authRouter);

app.use('/googleoauth2', googleOauth2Route);

app.get('/', (req, res) => {
    res.json({ "message": "Hello appointment client" });
});

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});