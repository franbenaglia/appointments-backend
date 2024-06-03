const express = require('express');
const passport = require('../security/passport.js');
const gOauth2Controller = require('../controllers/googleoauth2.js');
const frontendserver = require('../config/constants.js').FRONT_END_SERVER;

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
        failureRedirect: 'http://localhost:8100/login',
    }),
    function (req, res) {
        if(req.user.token){
            console.log('token almacenado: '+req.user.token);
        }
        req.session.token = req.user.token;
        res.redirect(frontendserver + '/success_oauth2') ///googleoauth2/success

    }
);

module.exports = router;