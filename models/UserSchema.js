const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter the name"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "Email already exits"],
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
