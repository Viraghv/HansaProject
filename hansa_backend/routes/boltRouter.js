const express = require('express');
const router = express.Router();
const boltController = require('../controllers/boltController');

// lists records from the "bolt" table according to the given parameters
// params: page, orderBy, orderType, searchColumn, searchTerm
router.post('/list',  boltController.list);

// adds a new record to the "bolt" table
// params: nev, partnerid
router.post('/add', boltController.add);

module.exports = router;
