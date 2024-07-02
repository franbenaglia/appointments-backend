const TurnModel = require('../models/turn');
const AvailableRangeTurnModel = require('../models/availablerangeturns');
const UserModel = require('../models/user');
const EventModel = require('../models/theevent');
  
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
        const events = await EventModel.find();
        res.status(200).json(events.map(e => e.event));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.findAllAvailableRange = async (req, res) => {
    try {
        const range = await AvailableRangeTurnModel.find();
        res.status(200).json(range);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.findAvailableRangeById = async (req, res) => {
    try {
        const range = await AvailableRangeTurnModel.find({ _id: req.params.id });
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

const availableTimes = (spTime, allTimeValues) => {

    return allTimeValues.filter(atv => !spTime.includes(atv));

};

const splitUsedTimes = (datesTimesUsed) => {
    let d = [];
    datesTimesUsed.map((du) => {
        let date = du.date.toLocaleTimeString();
        let hourminutes = date.substring(0, 4);
        d.push(hourminutes);
    });
    return d;
}

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

const processDatesUsed = (datesUsed, range) => {
    const timeValues = joinHourMinute(range[0].hourValues, range[0].minuteValues);
    const spDates = splitUsedDates(datesUsed);
    const gd = groupDates(spDates);
    return datesWithNotPlace(gd, timeValues);
}


const datesWithNotPlace = (gd, timeValues) => {

    let ad = [];
 
    for (let i = 0; i < gd.length; i++) {

        if (gd[i].hours.length === timeValues.length) {
            ad.push(gd[i].date);
        }
    }

    return ad;
}

const groupDates = (spDates) => {
    let objs = [];
    spDates.forEach(pair => {
        let obj = objs.find(obj => obj.date === pair.date);
        if (obj) {
            obj.hours.push(pair.hour);
        } else {
            objs.push({ date: pair.date, hours: [pair.hour] });
        }
    });
    return objs;
};

const splitUsedDates = (datesUsed) => {
    let d = []; 
    datesUsed.map((du) => {
        let date = du.date.toISOString().substring(0, 10);
        let hour = du.date.toISOString().substring(11, 16);
        d.push({ date: date, hour: hour });
    });
    return d;
}

const joinHourMinute = (hourValues, minuteValues) => {
    let hm = [];
    for (i = 0; i < hourValues.length; i++) {
        for (x = 0; x < minuteValues.length; x++) {
            hm.push(hourValues[i] + ':' + minuteValues[x]);
        }
    }
    return hm;
}

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

    if (req.body.event) {
        res.status(400).send({ message: "event can not be empty!" });
        return;
    }

    const turnRange = new AvailableRangeTurnModel({
        event: req.body.eventName,
        dayValues: req.body.dayValues,
        hourValues: req.body.hourValues,
        minuteValues: req.body.minuteValues,
        minDate: req.body.minDate,
        maxDate: req.body.maxDate,
        weekends: req.body.weekends
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

        await AvailableRangeTurnModel.findByIdAndUpdate(exist._id, req.body, { useFindAndModify: false }).then(data => {
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