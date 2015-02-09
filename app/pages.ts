///<reference path="../typings/tsd.d.ts"/>
export function home(req, res) {
    res.render('home', { title: 'Funky Town' });
}
