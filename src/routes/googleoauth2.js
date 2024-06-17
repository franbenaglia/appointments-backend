const express = require('express');
const passport = require('../security/passport.js');
const gOauth2Controller = require('../controllers/googleoauth2.js');
const frontendserver = require('../config/constants.js').FRONT_END_SERVER;
const jwt = require('jsonwebtoken');
const SECRET = require('../config/constants').SECRET;

const router = express.Router();

router.get("/", gOauth2Controller.notLogged);

router.get("/failed", gOauth2Controller.failed);

router.get("/success", gOauth2Controller.success)

router.get('/google',
    passport.authenticate('google', {
        scope:
            ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
        accessType: 'offline',
        prompt: 'consent',
    }
    ),
    (req, res) => {
        // do something with req.user
        res.send(req.user ? 200 : 401);
    },

);

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: frontendserver + '/login',
    }),

    (req, res) => {

        const token = jwt.sign(
            { user: req.user },
            SECRET,
            { expiresIn: "1h" },
        );
        res.cookie('googleJwtToken', token);
        res.redirect(frontendserver + '/');

    }
);

router.get('/github',
    passport.authenticate('github', {
        scope:
            ['read:user', 'user:email'],
        accessType: 'offline',
        prompt: 'consent',
    }
    )
);

router.get('/github/callback',
    passport.authenticate('github', {
        failureRedirect: frontendserver + '/login',
    }),

    (req, res) => {

        const token = jwt.sign(
            { user: req.user },
            SECRET,
            { expiresIn: "1h" },
        );
        res.cookie('googleJwtToken', token);
        res.redirect(frontendserver + '/');

    }
);


module.exports = router;