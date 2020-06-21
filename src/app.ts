import {changePassword, getQuizzes} from "./db";

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true, cookie: { maxAge: 60000 }}))
require('./auth').authInit();
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

function getUser(req) {
    if(req.session.passport === undefined) return undefined;
    if(req.session.passport.user === undefined) return undefined;
    return req.session.passport.user;
}

app.get('/login', function(req, res) {
    res.render('login', {message: req.flash('error')})
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

app.get('/profile', function(req, res) {
    const user = getUser(req);
    if(user) {
        res.render('profile', {user: user});
    }
    else {
        res.render('login', {message: "Nie jesteś zalogowany!"})
    }
});

app.get('/change', (req, res) => {
    const user = getUser(req);
    if(user) {
        res.render('change', {});
    }
    else {
        res.render('login', {message: "Nie jesteś zalogowany"})
    }
})

app.post('/change', async (req, res) => {
    const user = getUser(req);
    if(user) {
        await changePassword(user, req.body.password);
        res.render('login', {message: "Hasło zostało zmienione"})
    }
    else {
        res.render('login', {message: "Nie jesteś zalogowany"})
    }
})

app.get('/', async (req, res) => {
    const user = getUser(req);
    if(user) {
        const quizzes = await getQuizzes();
        console.log(quizzes);
        res.render('index', {message: "", quizzes: quizzes});
    }
    else {
        res.render('login', {message: "Nie jesteś zalogowany"})
    }
})

app.listen(port, function() {
    console.log(`App listening at http://localhost:${port}`);
});
