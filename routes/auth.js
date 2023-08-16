const express = require("express");
const authController = require("../controllers/auth");
const User = require("../models/user");
const router = express.Router();
const { check, body } = require("express-validator");

router.get("/login", authController.getLoginPage);

router.post("/login", authController.postLoginPage);

router.get("/sign-up", authController.getSignUpPage);

router.post(
    "/sign-up",
    [
        check("email")
            .isEmail()
            .withMessage("Please a valid e-mail address!")
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then((user) => {
                    if (user) {
                        return Promise.reject(
                            "A user with the provided e-mail already exists!"
                        );
                    }
                });
            })
            .trim(),
        body("password")
            .isLength({ min: 6 })
            .withMessage("The password must be 6+ characters long")
            .trim(),
        body("confirmPassword")
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("The passwords entered do not match!");
                }
                return true;
            }),
    ],
    authController.postSignUpPage
);

module.exports = router;
