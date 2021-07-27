const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users')

router.get('/',usersController.getAllUsers);

router.post('/',usersController.PostNewUser)

router.get('/:id',usersController.getSpecificUser);

router.patch('/:id',usersController.update_user);

router.delete('/:id',usersController.delete_user);

module.exports=router;