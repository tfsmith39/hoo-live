var express = require('express');
var Cites = require('../models/cites');

var router = express.Router();

router.get('/', function (req, res) {
    Cites.retrieveAll(function (err, cites) {
        if (err)
            return res.json(err);
        return res.json(cites);
    });
});

router.post('/', function (req, res) {
    var cite = req.body.cite;

    Cites.insert(city, function (err, result) {
        if (err)
            return res.json(err);
        return res.json(result);
    });
});

module.exports = router;