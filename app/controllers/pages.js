'use strict';
const Pages = {};

Pages.home = (req, res) => {
    res.render('pages/home.html', {title: 'Home'});
};

module.exports = Pages;