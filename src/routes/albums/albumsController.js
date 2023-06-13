/* eslint-disable no-console */
const connexion = require('../../../db-config');
const db = connexion.promise();

const getOne = (req, res) => {
  const id = parseInt(req.params.id);
  db.query('select * from albums where id = ?', [id])
    .then(([albums]) => {
      if (albums[0] != null) {
        res.status(200).json(albums[0]);
      } else {
        res.status(404).send('Not Found');
      }
    })
    .catch((err) => {
      console.error(err);

      res.status(500).send('Error retrieving data from database');
    });
};

const getAll = (req, res) => {
  db.query('select * from albums')
    .then(([albums]) => {
      res.status(200).json(albums);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const postAlbums = (req, res) => {
  const { title, genre, picture, artist } = req.body;
  db.query(
    'INSERT INTO track(title, genre, picture, artist) VALUES (?, ?, ?)',
    [title, genre, picture, artist]
  )
    .then(([result]) => {
      res.location(`/albums/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error saving the album');
    });
};

const updateAlbums = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, genre, picture, artist } = req.body;
  db.query(
    'UPDATE track set title = ?, genre = ?, picture = ?, artist = ? where id = ?',
    [title, genre, picture, artist, id]
  )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not Found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error editing the album');
    });
};

const deleteAlbums = (req, res) => {
  const id = parseInt(req.params.id);
  db.query('DELETE from albums where id = ?', [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not Found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error deleting the album');
    });
};

const getTracksByAlbumId = (req, res) => {
  const id = parseInt(req.params.id);
  db.query('SELECT * FROM track WHERE id_album = ?', [id])
    .then(([albums]) => {
      if (albums[0] != null) {
        res.status(200).json(albums);
      } else {
        res.status(404).send('Not Found');
      }
    })
    .catch((err) => {
      console.error(err);

      res.status(500).send('Error retrieving data from database');
    });
};

module.exports = {
  getAll,
  getOne,
  getTracksByAlbumId,
  postAlbums,
  updateAlbums,
  deleteAlbums,
};
