const TurnModel = require('../models/turn');
const { availableTimes, splitUsedTimes, processDatesUsed, joinHourMinute } = require('../functions/date-time');
const AvailableRangeTurnModel = require('../models/availablerangeturns');
const UserModel = require('../models/user');
const EventModel = require('../models/theevent');
const mongoose = require('mongoose');

exports.create = async (req, res) => {

    if (!req.body.date && !req.body.user) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    const turn = new TurnModel({
        date: req.body.date,
        user: req.body.user,
        event: req.body.event
    });

    await turn.save().then(data => {
        res.send({
            message: "Turn created successfully!!",
            turn: data
        });
    }).catch(err => {
        console.log('errrrrrr ' + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating turn"
        });
    });
};

exports.findAll = async (req, res) => {
    try {
        const turn = await TurnModel.find();
        res.status(200).json(turn);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


exports.findAllPaginated = async (req, res) => {

    try {

        const { pageNumber, pageSize } = req.params;

        const turns = await TurnModel.find().populate('user')
            .limit(pageSize * 1)
            .skip((pageNumber - 1) * pageSize);

        const rowCount = await TurnModel.countDocuments();
        const totalPages = Math.trunc(rowCount / pageSize);
        const apiResponse = { page: pageNumber, per_page: pageSize, total: rowCount, total_pages: totalPages, results: turns };
        res.status(200).json(apiResponse);
    } catch (err) {
        console.error(err);
        res.status(500).send('failed');
    }
};

exports.findPaginatedFilterByEmail = async (req, res) => {

    try {

        const { pageNumber, pageSize, email } = req.params;

        let turns;

        if (email) {

            const users = await UserModel.find({ email: { $regex: '.*' + email + '.*' } }).select('_id');

            const result = users.map(u => u._id);

            turns = await TurnModel.find({ 'user': { $in: result } }).populate('user')
                .limit(pageSize * 1)
                .skip((pageNumber - 1) * pageSize);

        } else {
            turns = await TurnModel.find().populate('user')
                .limit(pageSize * 1)
                .skip((pageNumber - 1) * pageSize);
        }

        const rowCount = await TurnModel.countDocuments();
        const totalPages = Math.trunc(rowCount / pageSize);
        const apiResponse = { page: pageNumber, per_page: pageSize, total: rowCount, total_pages: totalPages, results: turns };

        res.status(200).json(apiResponse);

    } catch (err) {
        console.error(err);
        res.status(500).send('failed');
    }
};

exports.findAllPaginatedByUserEMail = async (req, res) => {

    try {

        const { pageNumber, pageSize, email } = req.params;

        const user = await UserModel.find({ email: email });

        const turns = await TurnModel.find({ user: user }).populate('user')
            .limit(pageSize * 1)
            .skip((pageNumber - 1) * pageSize);

        const rowCount = await TurnModel.countDocuments();
        const totalPages = Math.trunc(rowCount / pageSize);
        const apiResponse = { page: pageNumber, per_page: pageSize, total: rowCount, total_pages: totalPages, results: turns };
        res.status(200).json(apiResponse);
    } catch (err) {
        console.error(err);
        res.status(500).send('failed');
    }
};


exports.findAllPaginatedByFilter = async (req, res) => {

    try {

        const { pageNumber, pageSize, filter } = req.params;
        //TODO CHECK NULLS AND FIND BY OBJECT?
        const user = filter.user;
        const date = filter.date;
        const cancelUser = filter.cancelUser;
        const cancelAdmin = filter.cancelAdmin;

        const turns = await TurnModel.find({ user: user })
            .limit(pageSize * 1)
            .skip((pageNumber - 1) * pageSize);

        const rowCount = await TurnModel.countDocuments();
        const totalPages = Math.trunc(rowCount / pageSize);
        const apiResponse = { page: pageNumber, per_page: pageSize, total: rowCount, total_pages: totalPages, results: turns };
        res.status(200).json(apiResponse);
    } catch (err) {
        console.error(err);
        res.status(500).send('failed');
    }
};



exports.findOne = async (req, res) => {
    try {
        const turn = await TurnModel.findById(req.params.id).populate('user');
        res.status(200).json(turn);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.findAllEvents = async (req, res) => {
    try {
        const avrt = await AvailableRangeTurnModel.find({ deleted: null });
        res.status(200).json(avrt.map(e => e.event));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.findAllAvailableRange = async (req, res) => {
    try {
        const range = await AvailableRangeTurnModel.find({ deleted: null });
        res.status(200).json(range);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.findAvailableRangeById = async (req, res) => {
    try {
        const range = await AvailableRangeTurnModel.find({ _id: req.params.id });
        console.log(range);
        res.status(200).json(range);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.findAvailableRange = async (req, res) => {
    try {
        const range = await AvailableRangeTurnModel.find({ event: req.params.event });
        res.status(200).json(range);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.findAvailableTimesdDates = async (req, res) => {
    try {
        const range = await AvailableRangeTurnModel.find({ event: req.params.event }).select('hourValues minuteValues -_id');

        const dti = new Date(req.params.date.substring(0, 10) + 'T00:00:00.000Z');
        const dts = new Date(dti);
        const dtsup = new Date(dts.setDate(dts.getDate() + 1));
        const datesTimesUsed = await TurnModel.find({
            event: req.params.event,
            date: { $gte: dti, $lt: dtsup }
        }).select('date -_id');

        const allTimeValues = joinHourMinute(range[0].hourValues, range[0].minuteValues);

        const spTime = splitUsedTimes(datesTimesUsed);

        const aT = availableTimes(spTime, allTimeValues);

        res.status(200).json({ range: range, timeFree: aT });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.findAvailableDates = async (req, res) => {
    try {
        const range = await AvailableRangeTurnModel.find({ event: req.params.event });
        const datesUsed = await TurnModel.find({ event: req.params.event }).select('date -_id');;
        const dates = processDatesUsed(datesUsed, range);

        res.status(200).json({ range: range, datesUsed: dates });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.update = async (req, res) => {

    if (!req.body) {
        res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    await TurnModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then(data => {
        if (!data) {
            res.status(404).send({
                message: `Turn not found.`
            });
        } else {
            res.send({
                message: "Turn updated successfully.",
                turn: data
            })
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

exports.destroy = async (req, res) => {
    await TurnModel.findByIdAndRemove(req.params.id).then(data => {
        if (!data) {
            res.status(404).send({
                message: `Turn not found.`
            });
        } else {
            res.send({
                message: "Turn deleted successfully!"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};


exports.createAvailableRange = async (req, res) => {

    console.log('req ' + req);
    console.log('req event ' + req.body.event);

    if (!req.body.event) {
        res.status(400).send({ message: "event can not be empty!" });
        return;
    }

    if (req.body.event) {
        req.body.eventName = req.body.event;
    }

    const turnRange = new AvailableRangeTurnModel({
        event: req.body.eventName,
        dayValues: req.body.dayValues,
        hourValues: req.body.hourValues,
        minuteValues: req.body.minuteValues,
        minDate: req.body.minDate,
        maxDate: req.body.maxDate,
        weekends: req.body.weekends,
        specificdays: req.body.specificdays
    });


    const exist = await AvailableRangeTurnModel.find({ event: req.body.eventName });

    if (!exist.length) {
        await turnRange.save().then(data => {
            res.send({
                message: "Turn range created successfully!!",
                turnRange: data
            });
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating turn range"
            });
        });

    } else {
        console.log(req.body);
        await AvailableRangeTurnModel.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false }).then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Turn range not found.`
                });
            } else {
                res.send({
                    message: "Turn range updated successfully.",
                    turnRange: data
                })
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });

    }
};

exports.deleteAvailableRange = async (req, res) => {

    try {

        req.body.deleted = true;

        await AvailableRangeTurnModel.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false }).then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Turn range not found.`
                });
            } else {
                res.send({
                    message: "Turn range deleted successfully.",
                    turnRange: data
                })
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}