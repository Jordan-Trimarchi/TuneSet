const router = require('express').Router();
const { 
  getSheets, 
  postSheet, 
  getSetlists, 
  postSetlist, 
  postAssociation, 
  getSetSheets, 
  deleteSheet, 
  updateHeight } = require('./controllers.js');

router.get('/sheets/:username', getSheets);
router.post('/sheets', postSheet);
router.get('/setlists/:username', getSetlists);
router.post('/setlists', postSetlist);
router.post('/association', postAssociation);
router.get('/setSheets/:list_id', getSetSheets);
router.delete('/sheets/:sheet_id', deleteSheet);
router.put('/sheets/:sheet_id/:height', updateHeight);



module.exports = router;