const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require("connect-flash");

// importing routes
const farmRoutes = require("./routes/routes");
const authRoutes = require("./routes/auth");
const errorRoutes = require("./controllers/error");

/******** importing models *******/
const User = require("./models/user");

// initialization
const app = express();

// defining middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

var store = new MongoDBStore(
    {
        uri: 'mongodb://127.0.0.1:27017/africasTalking',
        databaseName: 'africasTalking',
        collection: 'mySessions'
    },
    function (error) {
        // Should have gotten an error
        console.log(error);
    });

app.use(require('express-session')({
    secret: 'Thisisaverysecretsecret',
    cookie: {
        maxAge: 1000 * 60 * 60 * 1 // 1 hour
    },
    store: store,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user.id)
        .then((user) => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch((err) => {
            next(new Error(err));
        });
});

// Catch errors
store.on('error', function (error) {
    console.log(error);
});

app.use(farmRoutes);
app.use(authRoutes);
app.get("/500", errorRoutes.get500);
app.use(errorRoutes.get404);
app.use((error, req, res, next) => {
    res.status(500).render("500", { pageTitle: "Internal Server Error" });
});

mongoose
    .connect("mongodb://127.0.0.1:27017/africasTalking")
    .then((res) => {
        app.listen(9090, () => {
            console.log("Server started on port 9090");
        });
    })
    .catch((err) => {
        console.log(err);
    });