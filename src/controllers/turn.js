const TurnModel = require('../models/turn');

exports.create = async (req, res) => {

    if (!req.body.date && !req.body.email && !req.body.firstName && !req.body.lastName && !req.body.phone) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    const turn = new TurnModel({
        date: req.body.date,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone
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

        const turns = await TurnModel.find()
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
        const turn = await TurnModel.findById(req.params.id);
        res.status(200).json(turn);
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
            res.send({ message: "Turn updated successfully." })
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