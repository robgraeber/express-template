///<reference path="../typings/tsd.d.ts"/>
import hbs = require('hbs');
import router = require('../app/router');

export function init(): void {
    hbs.registerHelper('link_to', function(name, params) {
        if (typeof params === 'string')
            params = JSON.parse(params);
        
        return router.build(name, params);
    });
}