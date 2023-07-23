const { user } = require('../modals/user.js');
const bcrypt = require('bcryptjs');


exports.loginController = (req, res) => {
    const id = req.body.ID;
    const pass = req.body.password;
    user.findOne({ username: req.body.ID }).then(result => {
        if (!result) {
            res.redirect('/');
        }
        else {
            bcrypt.compare(pass, result.password).then(value => {
                if (value == true) {
                    req.session.isloggedin = true;
                    req.session.user = result;
                    req.session.save(err => {
                        res.redirect('/');
                    })

                } else {
                    res.redirect('/');
                }
            })
        }
    })
}

exports.logOutController = (req, res) => {
    req.session.isloggedin = false;
    req.session.user = null;
    req.session.save(err => {
        res.redirect('/');
    })
}