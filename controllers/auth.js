const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.getLoginPage = (req, res) => {
    let message = req.flash("loginError");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render("auth/login", {
        pageTitle: "Login",
        errorMessage: message,
    });
};

exports.getSignUpPage = (req, res) => {
    let message = req.flash("signUpError");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render("auth/sign-up", {
        pageTitle: "Sign-up",
        errorMessage: message,
        oldInput: {
            name: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            telephone: "",
            location: ""
        },
        validationErrors: [],
    });
};

exports.postSignUpPage = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const telephone = req.body.phone;
    const location = req.body.location;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render("auth/sign-up", {
            pageTitle: "Sign-up",
            errorMessage: errors.array()[0].msg,
            oldInput: {
                username: username,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
                telephone: telephone,
                location: location
            },
            validationErrors: errors.array(),
        });
    }

    bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
            const user = new User({
                username: username,
                email: email,
                password: hashedPassword,
                location: location,
                phone: telephone
            });
            return user.save();
        })
        .then((result) => {
            res.redirect("/login");
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postLoginPage = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username: username })
        .then((user) => {
            if (!user) {
                req.flash("loginError", "Invalid e-mail or password!");
                return res.redirect("/login");
            }
            bcrypt
                .compare(password, user.password)
                .then((doMatch) => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save((err) => {
                            console.log(err);
                            res.redirect("/");
                        });
                    }
                    req.flash("loginError", "Invalid e-mail or password!");
                    res.redirect("/login");
                })
                .catch((err) => {
                    console.log(err);
                    res.redirect("/login");
                });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};