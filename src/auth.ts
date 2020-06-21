import {getUsers} from './db'
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

export function authInit() {
    const authenticateUser = async (username, password, done) => {
        const users = await getUsers();
        const user = users.find(user => user.username === username);
        if (user == null) {
            return done(null, false, {message: 'Nieprawidłowa nazwa użytkownika'})
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, {message: 'Nieprawidłowe hasło'})
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'username'}, authenticateUser));
    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser(function(user, done) {
        return done(null, async () => (await getUsers()).find(usr => usr === user));
    })
}
