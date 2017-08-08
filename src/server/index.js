import express from 'express';
import pg from 'pg';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

const { username, password, facebookId, facebookSecret }  = process.env
const connectionString = process.env.DATABASE_URL || `postgres://${username}:${password}@localhost/stacks`;
const client = new pg.Client(connectionString);

app.use(express.static(path.join(__dirname, '../../build')));

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname,'../../build/index.html'));
}).listen(port, () => {
    console.log('Listening on port: ' + port);
});


client.connect();
client.query('CREATE TABLE users(id SERIAL PRIMARY KEY, first_name VARCHAR(40), last_name VARCHAR(40), email VARCHAR(254), created_at TIMESTAMP)')
    .then((response) => {
        console.log('users table created')
        client.end()
    }).catch((error) => {
        console.log(error)
    });

//initializes passport
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// configures strategy to authenticate using facebook
passport.use(new FacebookStrategy({ 
        clientID: facebookId,
        clientSecret: facebookSecret,
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    (accessToken, refreshToken, profile, callback) => { 
        callback(null, profile)
    })
);
    
// this route calls fb authentications
app.get('/auth/facebook', passport.authenticate('facebook'));

// redirected to this route
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/'}), 
    (req, res) => { 
        
    }
);
