const express = require('express');
const router = express.Router();
const toursController = require('../controllers/tours')

router.get('/',toursController.getAllTours);

// we don't need to chain middlewares any more as the database model will concern about request validation.  
//router.post('/',toursController.check_body,toursController.PostNewTour)
router.post('/',toursController.PostNewTour)

router.get('/:id',toursController.getSpecificTour);

router.patch('/:id',toursController.update_tour);

router.delete('/:id',toursController.delete_tour);

module.exports=router;