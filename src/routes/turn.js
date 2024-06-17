const express = require('express');
const passport = require ('passport');

const TurnController = require('../controllers/turn');

const router = express.Router();

router.get('/', TurnController.findAll);

router.get('/availableRange/:event', TurnController.findAvailableRange);

router.put('/availableRange/:event', TurnController.createAvailableRange);

router.post('/availableRange', TurnController.createAvailableRange);

router.get('/:pageNumber/:pageSize/:email', TurnController.findAllPaginatedByUserEMail);

router.get('/:pageNumber/:pageSize', TurnController.findAllPaginated);

router.put('/:id', TurnController.update);

router.get('/:id', passport.authenticate("jwt", { session: false }),
 TurnController.findOne);

router.post('/', TurnController.create);

router.delete('/:id', TurnController.destroy);

module.exports = router;