const mongoose = require("mongoose");
const ListSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "Email already exits"],
  },
  likedMovies: Array,
});

module.exports = mongoose.model("List", ListSchema);
