const express = require('express');

const TurnController = require('../controllers/turn');

const router = express.Router();

router.get('/', TurnController.findAll);

router.get('/:pageNumber/:pageSize', TurnController.findAllPaginated);

router.get('/:id', TurnController.findOne);

router.post('/', TurnController.create);

router.patch('/:id', TurnController.update);

router.delete('/:id', TurnController.destroy);

module.exports = router;