const express = require("express");
const farmController = require("../controllers/farm");
const authCheck = require("../middlewares/is-auth");
const router = express.Router();
const { body } = require("express-validator");

router.get("/", authCheck, farmController.getHomePage);

// router.get("/weather-data", farmController.getWeatherData);

router.get("/weather", authCheck, farmController.sendMessage)

router.get("/payement", authCheck, farmController.getPayementPage)

module.exports = router;