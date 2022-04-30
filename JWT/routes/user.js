const userController = require("../controllers/userController");

const router = require("express").Router();

//Get all user
router.get("/", userController.getAllUsers)

//Delete user
router.delete("/:id", userController.deleteUser)

module.exports = router;