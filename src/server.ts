///<reference path="types/tsd.d.ts"/>
import cluster = require('cluster');
import express = require('express');
import config = require('./config/config');

if (cluster.isMaster) {
    var cpuCount = require('os').cpus().length;

    if (process.env.NODE_ENV === 'production')
        console.log('Running in production mode!');
    else {
        console.log('Running in development mode!');
        cpuCount = 1;
    }

    for (var i = 0; i < cpuCount; i++)
        cluster.fork();

    cluster.on('exit', (worker) => {
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();
    });

} else {
    var app = config.setup(express());

    console.log('Worker ' + cluster.worker.id + ' running!');

    app.listen(app.get('port'), () => {
        console.log('Express server listening on port ' + app.get('port'));
    });
}