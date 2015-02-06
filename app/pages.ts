///<reference path="../typings/tsd.d.ts"/>
import express = require('express');

export var home: express.RequestHandler = function (req, res) {
    res.render('home', { title: 'Funky Town' });
};
