import * as sqlite3 from 'sqlite3';
import {Question, Quiz, User} from './models';
const bcrypt = require('bcrypt');

const quizzes : Quiz[] = [
    {
        id: 0,
        intro: "Liczyć każdy może."
    },
    {
        id: 1,
        intro: "Quiz sprawdzający wiedzę numerologiczną."
    },
    {
        id: 2,
        intro: "Quiz sprawdzający wiedzę z Pana Tadeusza."
    },
]

const questions : Question[] = [
    {
        quiz_id: 0,
        num: 1,
        text: "2 + 2 = ?",
        answer: 4,
        penalty: 1
    },

    {
        quiz_id: 0,
        num: 2,
        text: "2 * 8 = ?",
        answer: 16,
        penalty: 2
    },

    {
        quiz_id: 0,
        num: 3,
        text: "55 - 5 = ?",
        answer: 50,
        penalty: 3
    },

    {
        quiz_id: 0,
        num: 4,
        text: "21 * 37 = ?",
        answer: 777,
        penalty: 8
    },

    {
        quiz_id: 1,
        num: 1,
        text: "Ile diabłów mieści się na końcu szpilki?",
        answer: 1500100900,
        penalty: 23
    },

    {
        quiz_id: 1,
        num: 2,
        text: "Na ile zdrowasiek wkładamy kogoś do piecia?",
        answer: 3,
        penalty: 3
    },

    {
        quiz_id: 2,
        num: 1,
        text: "Ile stron ma Pan Tadeusz?",
        answer: 400,
        penalty: 15
    },

    {
        quiz_id: 2,
        num: 2,
        text: "Ile wersów ma Pan Tadeusz?",
        answer: 9721,
        penalty: 3
    },

    {
        quiz_id: 2,
        num: 3,
        text: "Ile słów ma Pan Tadeusz?",
        answer: 68682,
        penalty: 12
    },
]

export async function createDB() {
    sqlite3.verbose();
    let db = new sqlite3.Database('baza.db');

    const passwd1 = await bcrypt.hash("user1", 10);
    const passwd2 = await bcrypt.hash("user2", 10);

    let quizCommand = "INSERT INTO quizzes (id, intro) VALUES ";
    let questionCommand = "INSERT INTO questions (quiz_id, num, text, answer, penalty) VALUES ";
    let first = false;

    for(const quiz of quizzes) {
        if(first) quizCommand += ", ";
        quizCommand += "(" + quiz.id + ", \"" + quiz.intro + "\")";
        first = true;
    }
    quizCommand += ';';

    first = false;
    for(const question of questions) {
        if(first) questionCommand += ", ";
        questionCommand += "(" + question.quiz_id + ", " + question.num + ", \"" + question.text + "\", " + question.answer + ", " + question.penalty + ")";
        first = true;
    }
    questionCommand += ';';

    db.serialize(() => {
        db.run('CREATE TABLE users (id INT, username VARCHAR(255), password VARCHAR(255));');
        db.run('CREATE TABLE quizzes (id INT, intro TEXT);');
        db.run('CREATE TABLE questions (quiz_id INT, num INT, text TEXT, answer INT, penalty INT);');
        db.run('INSERT INTO users (id, username, password) VALUES (0, \"user1\", ' + '\"' + passwd1 + '\"), (1, \"user2\", ' + '\"' + passwd2 + '\");');
        db.run(quizCommand);
        db.run(questionCommand);
    });
    db.close();
}

export async function getUsers() {
    sqlite3.verbose();
    let users : User[] = [];
    let db = new sqlite3.Database('baza.db');
    await new Promise((resolve, rejest) => {
        db.all('SELECT * FROM users;', [], (err, rows) => {
            if (err) throw(err);
            for(const row of rows)
            {
                let {id, username, password} = row;
                users.push({id, username, password});
            }
            resolve(rows);
    })});
    db.close();
    return users;
}

export async function getQuizzes() {
    sqlite3.verbose();
    let quizzes : Quiz[] = [];
    let db = new sqlite3.Database('baza.db');
    await new Promise((resolve, rejest) => {
        db.all('SELECT * FROM quizzes;', [], (err, rows) => {
            if (err) throw(err);
            for(const row of rows)
            {
                let {id, intro} = row;
                quizzes.push({id, intro});
            }
            resolve(rows);
        })});
    db.close();
    return quizzes;
}

export async function changePassword(user, password) {
    sqlite3.verbose();
    let db = new sqlite3.Database('baza.db');
    let passwd = await bcrypt.hash(password, 10);
    db.serialize(() => {
        db.run("DELETE FROM users WHERE id=" + user.id + ";");
        db.run("INSERT INTO users (id, username, password) VALUES (" + user.id + ", \"" + user.username + "\", \"" + passwd + "\");");
    })
    db.close();
}

function clearDB() {
    sqlite3.verbose();
    let db = new sqlite3.Database('baza.db');
    db.run('DROP TABLE users;');
    db.close();
}
