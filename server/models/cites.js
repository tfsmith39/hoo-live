const db = require('../database');

class Cites {
  static retrieveAll (callback) {
    db.query('SELECT cite_name from cites', (err, res) => {
      if (err.error)
        return callback(err);
      callback(res);
    });
  }

  static insert (city, callback) {
    db.query('INSERT INTO cites (cite_name) VALUES ($1)', [city], (err, res) => {
      if (err.error)
        return callback(err);
      callback(res);
    });
  }
}

module.exports = Cites;