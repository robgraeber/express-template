///<reference path="../types/tsd.d.ts"/>
import express = require('express');
import compress = require('compression');
import router = require('../app/router');
import hbsHelpers = require('./hbsHelpers');

hbsHelpers.init();

export var setup = (app: express.Express): express.Express => {
    app.use(compress());
    app.use(router);
    app.use(express.static(__dirname + '/../public'));

    app.set('view engine', 'hbs');
    app.set('views', __dirname + '/../app/views');
    app.set('port', process.env.PORT || 8000);

    return app;
}