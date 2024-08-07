//const AvailableRangeTurnModel = require('../models/availablerangeturns');
const EventModel = require('../models/theevent');

const defaultEventData = async (err, req, res, next) => {

    const events = new EventModel({
        event: 'firstEvent',
    });
    await events.save().then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });

    const eventsb = new EventModel({
        event: 'testavailable',
    });
    await eventsb.save().then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
};

/*
const defaultTurnData = async (err, req, res, next) => {

    const turnRange = new AvailableRangeTurnModel({
        event: 'firstEvent',
        dayValues: [1, 5, 10, 15, 20, 25, 30],
        hourValues: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
        minuteValues: [0, 30],
        minDate: '2024-06-01T09:00:00',
        maxDate: '2024-07-15T17:59:59'
    });

    const exist = await turnRange.find({ event: 'firstEvent' });

    if (!exist) {
    await turnRange.save().then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
    }
};
*/

module.exports = defaultEventData;