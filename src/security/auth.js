const express = require('express');
const UserModel = require('../models/user.js');
const jwt = require('jsonwebtoken');
const passport = require('./passport');
const secret = require('../config/constants.js').SECRET;
const compare = require('bcrypt').compare;

const authRouter = express.Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const user = await UserModel.create({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    return res.status(201).json({
      message: "user created",
      user: { email: user.email, id: user._id },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const userExists = await UserModel.findOne({ email: req.body.email });
    if (!userExists)
      return res.status(400).json({ message: "user does not exist" });

    const isValid = await compare(req.body.password, userExists.password);

    if (!isValid){
      return res.status(400).json({ message: "incorrect password" });
    }

    // generate acces token
    const accessToken = jwt.sign(
      {
        _id: userExists._id, firstName: userExists.firstName, lastName: userExists.lastName, email: userExists.email, role: userExists.role
      },
      secret,
      { expiresIn: "1d" }
    );

    return res
      .status(200)
      .json({ message: "user logged in", accessToken: accessToken });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authRouter.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const userExists = await UserModel.findOne({ email: req.body.email });
      
      if (!userExists)
        return res.status(400).json({ message: "user does not exist" });

      return res
        .status(200)
        .json({
          email: userExists.email,
          firstName: userExists.firstName, lastName: userExists.lastName
        });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);


authRouter.get(
  "/profileWithJustToken",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {

      const header = req.header('Authorization');

      const token = header.split(" ")[1];

      const payload = jwt.decode(token);

      let user;

      if (payload.email) {
        user = payload
      } else {
        user = payload.user;
      }

      return res
        .status(200)
        .json({
          _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role
        });

    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

module.exports = authRouter;
