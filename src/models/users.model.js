const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const saltRounds = 10;
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is a required fields"],
      minLength: [6, "Username should be between 6 and 12 characters"],
      maxLength: [12, "Username should be between 6 and 12 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is a required field"],
    },
    email: {
      type: String,
      required: [true, "Email is a required field"],
    },
    libraries: {
      type: Schema.Types.ObjectId,
      ref: "library",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.isThisEmailInUse = async function (email) {
  try {
    const user = await this.findOne({ email: email });
    if (user) return true;

    return false;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

userSchema.statics.signup = async function (username, email, password) {
  const user = new userModel({
    username: username,
    email: email,
    password: await bcrypt.hash(password, saltRounds),
  });
  await user.save();
  return user;
};
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email: email });
  if (user) {
    const result = await bcrypt.compare(password, user.password);
    if (result) return user;
    return false;
  }
};
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
