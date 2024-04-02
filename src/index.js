//https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/
//https://medium.com/techvblogs/build-crud-api-with-node-js-express-and-mongodb-e3aa58da3915

const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
const userRoute = require('./routes/user');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

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

app.get('/', (req, res) => {
    res.json({ "message": "Hello Crud Node Express" });
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});