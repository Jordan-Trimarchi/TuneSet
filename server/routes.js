const router = require('express').Router();
const { getSheets, postSheet, getSetlists, postSetlist, postAssociation, getSetSheets, deleteSheet } = require('./controllers.js');

router.get('/sheets/:username', getSheets);
router.post('/sheets', postSheet);
router.get('/setlists/:username', getSetlists);
router.post('/setlists', postSetlist);
router.post('/association', postAssociation);
router.get('/setSheets/:list_id', getSetSheets);
router.delete('/sheets/:sheet_id', deleteSheet);



module.exports = router;