// ************ Require's ************
const express = require('express');
const router = express.Router();

// ************ Controller Require ************
const productsController = require('../controllers/productsController');

const update = require('../middlewares/multer');
const check = require('../middlewares/check');
const validations = require('../middlewares/validateCreateForm');

/*** GET ALL PRODUCTS ***/ 
router.get('/', productsController.list); 

/*** CREATE ONE PRODUCT ***/ 
router.get('/create', check, productsController.create); 
router.post('/create', update.single('image'), validations ,productsController.store); 


/*** GET ONE PRODUCT ***/ 
router.get('/detail/:id', productsController.detail); 

/*** EDIT ONE PRODUCT ***/ 
router.get('/edit/:id', productsController.edit); 
router.put('/edit/:id', update.single('image') ,productsController.update); 


/*** DELETE ONE PRODUCT***/ 
router.delete('/delete/:id', productsController.delete); 


module.exports = router;
