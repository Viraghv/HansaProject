const express = require('express');
const router = express.Router();
const vasarlasController = require('../controllers/vasarlasController');

// lists records from the "vasarlas" table according to the given parameters
// params: page, orderBy, orderType, searchColumn, searchTerm
router.post('/list',  vasarlasController.list);

// adds a new record to the "vasarlas" table
// params: esemenydatumido, vasarlasosszeg, penztargepazonosito, partnerid, boltid
router.post('/add', vasarlasController.add);

module.exports = router;
