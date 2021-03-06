import {changePassword, getAverageCorrect, getQuestions, getQuiz, getQuizzes, getSolved, saveAnswers} from "./db";
import {countResult, getBestResults, getReport, isSolved} from "./results";

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

export const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({ secret: 'quiiiiizy', resave: false, saveUninitialized: false, cookie: { maxAge: 600000 }}))
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
    req.logOut();
    req.session.destroy(function (err) {
        res.redirect('/');
    });
})

app.get('/profile', function(req, res) {
    const user = getUser(req);
    if(user) {
        res.render('profile', {user: user});
    }
    else {
        req.flash('error', 'Nie jesteś zalogowany!');
        res.redirect('/login');
    }
});

app.get('/change', (req, res) => {
    const user = getUser(req);
    if(user) {
        res.render('change', {});
    }
    else {
        req.flash('error', 'Nie jesteś zalogowany!');
        res.redirect('/login');
    }
})

app.post('/change', async (req, res) => {
    const user = getUser(req);
    if(user) {
        await changePassword(user, req.body.password);
        req.logOut();
        req.flash('error', 'Hasło zostało zmienione');
        req.session.destroy(function (err) {
            res.redirect('/login');
        });
    }
    else {
        req.flash('error', 'Nie jesteś zalogowany!');
        res.redirect('/login');
    }
})

app.get('/', async (req, res) => {
    const quizzes = await getQuizzes();
    res.render('index', {message: req.flash('error'), quizzes: quizzes});
})

app.get('/quiz/:quizId', async (req, res) => {
    const user = getUser(req);
    if(user) {
        if((await isSolved(req.params.quizId, user.username))) {
            req.flash('error', 'Już rozwiązałeś ten quiz!');
            res.redirect('/');
        }
        else {
            const quiz = await getQuiz(req.params.quizId);
            const questions = await getQuestions(req.params.quizId);
            res.render('quiz', {quiz: quiz, questions: questions});
        }
    }
    else {
        req.flash('error', 'Nie jesteś zalogowany!');
        res.redirect('/login');
    }
})

app.get('/results/:quizId', async (req, res) => {
    const user = getUser(req);
    if(user) {
        const report = await getReport(req.params.quizId, user.username);
        const averages = await getAverageCorrect(req.params.quizId);
        const best = await getBestResults(req.params.quizId);
        res.render('results', {report: report, averages: averages, best: best});
    }
    else {
        req.flash('error', 'Nie jesteś zalogowany!');
        res.redirect('/login');
    }
})

app.post('/results/:quizId', async (req, res) => {
    const user = getUser(req);
    if(user) {
        const answers = req.body.answers.split(',');
        const times = req.body.times.split(',');
        const result = await countResult(req.params.quizId, answers, times);
        saveAnswers(req.params.quizId, user.username, result);
        const report = await getReport(req.params.quizId, user.username);
        const averages = await getAverageCorrect(req.params.quizId);
        const best = await getBestResults(req.params.quizId);
        res.render('results', {report: report, averages: averages, best: best});
    }
    else {
        req.flash('error', 'Nie jesteś zalogowany!');
        res.redirect('/login');
    }
})

app.get('/solved', async (req, res) => {
    const user = getUser(req);
    if(user) {
        const quizzes = await getSolved(user.username);
        res.render('solved', {quizzes : quizzes});
    }
    else {
        req.flash('error', 'Nie jesteś zalogowany!');
        res.redirect('/login');
    }
})

app.listen(port, function() {
    console.log(`App listening at http://localhost:${port}`);
});
