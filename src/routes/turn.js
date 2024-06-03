const express = require('express');
const passport = require ('passport');

const TurnController = require('../controllers/turn');

const router = express.Router();

router.get('/', TurnController.findAll);

router.get('/:pageNumber/:pageSize', TurnController.findAllPaginated);

router.get('/:id', passport.authenticate("jwt", { session: false }),
 TurnController.findOne);

router.post('/', TurnController.create);

router.patch('/:id', TurnController.update);

router.delete('/:id', TurnController.destroy);

module.exports = router;