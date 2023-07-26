const User = require("../models/ListSchema");

module.exports.addLikedMovies = async (req, res) => {
  try {
    const { email, data } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const { likedMovies } = user;
      const alreadyLikedMovie = likedMovies.find(({ id }) => id === data.id);
      if (!alreadyLikedMovie) {
        await User.findByIdAndUpdate(
          user._id,
          { likedMovies: [...user.likedMovies, data] },
          { new: true }
        );
      } else return res.json({ msg: "Movie has been added to liked list." });
    } else await User.create({ email, likedMovies: [data] });
    return res.json({ msg: "Movie added to liked list successfully." });
  } catch (err) {
    return res.json({ msg: "Erron in adding movie" });
  }
};

module.exports.getLikedMovies = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ msg: "success", movies: user.likedMovies });
    } else return res.json({ msg: "User not found" });
  } catch (error) {
    return res.json({ msg: "Error in fetching movies." });
  }
};
module.exports.removeLikedMovies = async (req, res) => {
  try {
    const { email, movieId } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const movies = user.likedMovies;
      const movieIndex = movies.findIndex(({ id }) => id === movieId);
      if (!movieIndex) {
        res.status(400).send({ msg: "Movie not found." });
      }
      movies.splice(movieIndex, 1);
      await User.findByIdAndUpdate(
        user._id,
        {
          likedMovies: movies,
        },
        { new: true }
      );
      return res.json({ msg: "Movie removed successfully.", movies });
    } else return res.json({ msg: "User not found." });
  } catch (error) {
    return res.json({ msg: "Error in removing movie " });
  }
};
