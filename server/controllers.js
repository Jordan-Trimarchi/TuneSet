const pool = require('../database/index.js');

const getSheets = (req, res) => {
  const username = req.params.username;
  pool
    .connect()
    .then((client) => {
      client
        .query('select * from sheets where user_name = $1', [username])
        .then((results) => {
          client.release();
          res.send(results.rows);
        })
        .catch((err) => {
          client.release();
          console.log(err.stack);
        })
    })
    .catch((err) => {
      client.release();
      console.log(err.stack);
    })
};

const postSheet = (req, res) => {
  pool
    .connect()
    .then((client) => {
      client
        .query('insert into sheets (title, artist, url, user_name) VALUES ($1, $2, $3, $4)', [req.body.title, req.body.artist, req.body.url, req.body.username])
        .then((results) => {
          res.send();
          client.release();
        })
    })
    .catch((err) => {
      client.release();
      console.log(err.stack);
    })
};

const getSetlists = (req, res) => {
  const username = req.params.username;
  pool
    .connect()
    .then((client) => {
      client
        .query('select * from lists where user_name = $1', [username])
        .then((results) => {
          client.release();
          res.send(results.rows);
        })
        .catch((err) => {
          client.release();
          console.log(err.stack);
        })
    })
    .catch((err) => {
      client.release();
      console.log(err.stack);
    })
};

const postSetlist = (req, res) => {
  pool
    .connect()
    .then((client) => {
      client
        .query('insert into lists (name, user_name) VALUES ($1, $2)', [req.body.name, req.body.username])
        .then((results) => {
          res.send();
          client.release();
        })
    })
    .catch((err) => {
      client.release();
      console.log(err.stack);
    })
};

const postAssociation = (req, res) => {
  pool
    .connect()
    .then((client) => {
      client
        .query('insert into sheets_lists (sheet_id, list_id) VALUES ($1, $2)', [req.body.sheet, req.body.list])
        .then((results) => {
          res.send();
          client.release();
        })
    })
    .catch((err) => {
      client.release();
      console.log(err.stack);
    })
};

const getSetSheets = (req, res) => {
  const listId = req.params.list_id;

  pool
    .connect()
    .then((client) => {
      client
        .query('select * from sheets inner join sheets_lists on sheets.id = sheets_lists.sheet_id where list_id = $1;', [listId])
        .then((results) => {
          client.release();
          res.send(results.rows);
        })
        .catch((err) => {
          client.release();
          console.log(err.stack);
        })
    })
    .catch((err) => {
      client.release();
      console.log(err.stack);
    })
};

const deleteSheet = (req, res) => {
  const sheetId = req.params.sheet_id;
  console.log(req.params);

  pool
    .connect()
    .then((client) => {
      client
        .query('delete from sheets where id = $1', [sheetId])
        .then((results) => {
          client.release();
          res.send(results.rows);
        })
        .catch((err) => {
          client.release();
          console.log(err.stack);
        })
    })
    .catch((err) => {
      client.release();
      console.log(err.stack);
    })
};

module.exports = {
  getSheets,
  postSheet,
  getSetlists,
  postSetlist,
  postAssociation,
  getSetSheets,
  deleteSheet,
};