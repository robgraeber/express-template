///<reference path="../types/tsd.d.ts"/>
export var home = (req, res) => {
    res.render('home', { title: 'Funky Town' });
};
