//https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/
//https://medium.com/techvblogs/build-crud-api-with-node-js-express-and-mongodb-e3aa58da3915

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
const turnRoute = require('./routes/turn');
const googleOauth2Route = require('./routes/googleoauth2.js');
const authRouter = require ('./security/auth.js');
const dotenv = require('dotenv');
const cookieSession = require('cookie-session');
const passport =  require('./security/passport.js');
const PORT =  require('./config/constants').PORT;
const session = require('express-session');


dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const whitelist = ['http://localhost:3100','http://localhost:4200', 'http://localhost:8500', 'http://localhost:8100',];
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
    secret: 'somethingsecretgoeshere',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
 }));

//app.use(cookieSession({
//    name: 'google-auth-session',
//    keys: ['key1', 'key2']
//  }))

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

app.use('/user', userRoute);

app.use('/turn', turnRoute);

app.use("/api/v1/auth", authRouter);

app.use('/googleoauth2', googleOauth2Route);

app.get('/', (req, res) => {
    res.json({ "message": "Hello appointment client" });
});

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});