const router = require('express').Router();
const { getSheets, postSheet, getSetlists, postSetlist, postAssociation, getSetSheets } = require('./controllers.js');

router.get('/sheets/:username', getSheets);
router.post('/sheets', postSheet);
router.get('/setlists/:username', getSetlists);
router.post('/setlists', postSetlist);
router.post('/association', postAssociation);
router.get('/setSheets/:list_id', getSetSheets)


module.exports = router;