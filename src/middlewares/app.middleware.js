const User = require("../models/users.model");
let jwt = require("jsonwebtoken");

async function validateSignUpForm(req, res, next) {
  const message = {};
  const emailPattern =
    /^[a-zA-Z0-9_-]+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  const usernamePattern = /^[\w_-]{6,12}$/;
  const passwordPattern = /(^[_=+*!@#$%^~`\w-]{8,16})+$/;

  if (!req.body.email) {
    message.email = "Email is required field";
  } else if (!emailPattern.test(req.body.email)) {
    message.email = "Email is not a valid";
  } else {
    const emailInUse = await User.isThisEmailInUse(req.body.email);
    if (emailInUse) message.email = "this email is already in use";
  }
  if (!req.body.username) {
    message.username = "Username is required field";
  } else if (!usernamePattern.test(req.body.username)) {
    console.log("not a valid");
    message.username = "Username is not a valid";
  }
  if (!req.body.password) {
    message.password = "Password is required field";
  } else if (!passwordPattern.test(req.body.password)) {
    message.password = "Password is not a valid";
  }
  if (!isEmpty(message)) {
    res.status(400).json({
      status: "fail",
      code: 400,
      message,
    });
  } else next();
}
async function validateLoginForm(req, res, next) {
  const message = {};
  const emailPattern =
    /^[a-zA-Z0-9_-]+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  const passwordPattern = /(^[_=+*!@#$%^~`\w-]{8,16})+$/;

  if (!req.body.email) {
    message.email = "Email is required field";
  } else if (!emailPattern.test(req.body.email)) {
    message.email = "Email is not a valid";
  } else {
    const emailInUse = await User.isThisEmailInUse(req.body.email);
    if (!emailInUse) {
      message.email = "Email not found! Email is not registered";
    }
  }
  if (!req.body.password) {
    message.password = "Password is required field";
  } else if (!passwordPattern.test(req.body.password)) {
    message.password = "Password is not a valid";
  }
  if (!isEmpty(message)) {
    res.status(400).json({
      status: "fail",
      code: 400,
      message,
    });
  } else next();
}

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader != "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    const result = jwt.verify(bearerToken, process.env.JWT_SECRET_KEY);
    if (result) {
      next();
    } else res.sendStatus(403);
  } else {
    res.sendStatus(403);
  }
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0 && typeof obj === "object";
}

async function checkUserId(req, res, next) {
  const user_id = req.query.user_id;
  if (user_id.length !== 24) {
    res.sendStatus(404);
  } else {
    try {
      const result = await User.findOne({ _id: user_id }, { id: 1 });
      if (result) {
        next();
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
module.exports = {
  checkUserId,
  verifyToken,
  validateSignUpForm,
  validateLoginForm,
};
