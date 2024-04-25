const appService = require("../services/app.service");
let jwt = require("jsonwebtoken");

async function SignUp(req, res, next) {
  const data = req.body;
  try {
    const response = await appService.signUp(data);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Thanks for signing up",
    });
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}
async function login(req, res, next) {
  const data = req.body;
  try {
    const user = await appService.login(data);
    if (!user) {
      res.status(400).json({
        message: {
          password: "password is incorrect",
        },
      });
    } else {
      const secretKey = process.env.JWT_SECRET_KEY;
      const payload = {
        id: user._id,
      };
      const token = jwt.sign(
        payload,
        secretKey,
        { expiresIn: 24 * 60 * 60 * 1000 },
        (err, token) => {
          res.status(200).json({
            _id: user._id,
            status: "success",
            code: 200,
            message: "Thanks for signing up",
            token: token,
          });
        }
      );
    }
  } catch (error) {
    throw new Error("error: " + error);
  }
}
async function addLibrary(req, res, next) {
  const data = req.body;
  try {
    const library = await appService.addLibrary(data);
    res.status(200).send({
      message: "Mark saved successfully",
    });
  } catch (error) {
    throw new Error("error: " + error.message);
  }
}
async function getAllLibrary(req, res, next) {
  const filter = req.query.filter;
  let user_id = req.params.user_id;
  if (req.query.user_id) user_id = req.query.user_id;
  if (user_id.length !== 24) {
    res.status(404).json({
      status: "fail",
      code: 404,
      message: "NOT FOUND",
    });
  } else {
    try {
      const library = await appService.getAllLibraryById(user_id, filter);
        res.status(200).json({
          library,
          username: library.username
        });
    } catch (error) {
      throw new Error("error: " + error);
    }
  }
}
async function getAnimeLibraryById(req, res, next) {
  const user_id = req.params.user_id;
  const anime_id = req.params.anime_id;
  try {
    const library = await appService.getAnimeInLibraryById(user_id, anime_id);
    res.status(200).send({
      library,
    });
  } catch (error) {
    throw new Error("error: " + error.message);
  }
}
async function deleteAnimeLibrary(req, res, next) {
  try {
    const library_id = req.params.library_id;
    const library = await appService.deleteMark(library_id);
    res.status(200).send({ message: "delete successfully" });
  } catch (error) {
    throw new Error("error: " + error.message);
  }
}
module.exports = {
  SignUp,
  login,
  addLibrary,
  getAllLibrary,
  getAnimeLibraryById,
  deleteAnimeLibrary,
};
