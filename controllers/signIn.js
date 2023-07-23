const { user } = require('../modals/user.js');
const bcrypt = require('bcryptjs');

exports.SignInController = (req, res) => {
    if (validator(req.body) == false)
        res.redirect('/signReq');
    bcrypt.hash(req.body.password, 12).then((hashed) => {
        const new_user = new user({
            username: req.body.username,
            password: hashed,
            name: req.body.name,
            email: req.body.email,
            rating: 0,
            rank: 0,
            institution: req.body.institution,
            solved_ques: [],
            contests: [],
        })
        new_user.save();
        req.session.isLoggedIn = true;
        req.session.user = req.body;
        req.session.save(err => {
            res.redirect('/');
        });
    });
}
const validator = (userOb) => {
    if (userOb == null || userOb == undefined || userOb.password == null || userOb.password == undefined) {
        return false;
    }
    return true;
}