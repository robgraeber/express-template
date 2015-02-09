///<reference path="../types/tsd.d.ts"/>
import NamedRouter = require('named-router');
import pages = require('./pages');

var router = NamedRouter();

router.get('/', 'home', pages.home);

export = router;