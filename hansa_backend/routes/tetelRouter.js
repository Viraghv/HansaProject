const express = require('express');
const router = express.Router();
const tetelController = require('../controllers/tetelController');

// lists records from the "vasarlas_tetel" table according to the given parameters
// params: page, orderBy, orderType, searchColumn, searchTerm
router.post('/list',  tetelController.list);

// lists all related records to the given "vasarlasid"
router.get('/listByVasarlas/:vasarlasid', tetelController.listByVasarlas)

// adds a new record to the "vasarlas-tetel" table
// params: partnerctid, vasarlasid, mennyiseg, brutto, partnerid
router.post('/add', tetelController.add);

module.exports = router;
