const express = require('express');
const cors = require('cors');
const path = require('path');
const router = require('./routes');
const db = require('../database/index.js');

const app = express();
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.use(express.json());
app.use(cors());

app.use('/', router);
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.listen(port, () => {

  console.log(`Server listening on port: 3000`);
});