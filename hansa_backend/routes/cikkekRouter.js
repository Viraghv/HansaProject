const express = require('express');
const router = express.Router();
const cikkekController = require('../controllers/cikkekController');

// lists records from the "cikkek" table according to the given parameters
// params: page, orderBy, orderType, searchColumn, searchTerm
router.post('/list',  cikkekController.list);

// adds a new record to the "cikkek" table
// params: cikkszam, vonalkod, nev, mennyisegiegyseg, nettoegysegar, verzio, partnerid
router.post('/add', cikkekController.add);

module.exports = router;