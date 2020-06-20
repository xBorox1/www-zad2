import * as sqlite3 from 'sqlite3';

function createDB() {
    sqlite3.verbose();
    let db = new sqlite3.Database('baza.db');
    db.run('CREATE TABLE users (id INT, name VARCHAR(255), password VARCHAR(255));');
    db.close();
}

function writeUsers() {

}

function clearDB() {
    sqlite3.verbose();
    let db = new sqlite3.Database('baza.db');
    db.run('DROP TABLE users;');
    db.close();
}

createDB();
writeUsers();
