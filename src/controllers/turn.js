const TurnModel = require('../models/turn');
const AvailableRangeTurnModel = require('../models/availablerangeturns');
const UserModel = require('../models/user');

exports.create = async (req, res) => {

    if (!req.body.date && !req.body.user) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    const turn = new TurnModel({
        date: req.body.date,
        user: req.body.user,
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

//TODO VER SI ES USER COMO PARAMETRO ES NAME O OBEJTO USER
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

exports.findAvailableRange = async (req, res) => {
    try {
        const range = await AvailableRangeTurnModel.find({ event: req.params.event });
        res.status(200).json(range);
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

    if (!req.body.event) {
        res.status(400).send({ message: "event can not be empty!" });
        return;
    }

    const turnRange = new AvailableRangeTurnModel({
        event: req.body.event,
        dayValues: req.body.dayValues,
        hourValues: req.body.hourValues,
        minuteValues: req.body.minuteValues,
        minDate: req.body.minDate,
        maxDate: req.body.maxDate
    });


    const exist = await turnRange.find({ event: req.body.event });

    if (!exist) {
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

        await turnRange.findByIdAndUpdate(exist._id, req.body, { useFindAndModify: false }).then(data => {
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