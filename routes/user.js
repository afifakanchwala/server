const router = require("express").Router();
const {
  addLikedMovies,
  getLikedMovies,
  removeLikedMovies,
} = require("../controller/UserController");

//to create
router.post("/add", addLikedMovies);
//To Update
router.get("/liked/:email/", getLikedMovies);
//to Delete
router.put("/remove", removeLikedMovies);
module.exports = router;
