import express from 'express';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import path from 'path';

const app = express();

const port = process.env.PORT || 3000;
const { username, password, facebookId, facebookSecret }  = process.env

const pgp = require('pg-promise')();
const connectionString = process.env.DATABASE_URL || `postgres://${username}:${password}@localhost/stacks`;
const db = pgp(connectionString);


////////////MAIN ROUTE///////////
app.use(express.static(path.join(__dirname, '../../build')));

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname,'../../build/index.html'));
}).listen(port, () => {
    console.log('Listening on port: ' + port);
});

///////////DATABASE///////////

db.query('CREATE TABLE users(id SERIAL PRIMARY KEY, first_name VARCHAR(40), last_name VARCHAR(40), email VARCHAR(254), facebook_id BIGINT, created_at TIMESTAMP)')
    .then((response) => {
        console.log('users table created')
        
    }).catch((error) => {
        console.log('create users table error:', error)
        
    });

function findUser(facebookId){

    return db.query(`SELECT * FROM users WHERE facebook_id = ${facebookId}`)
    .then((response) => {
       if (response.length) { return response; }
       return null;
    }).catch((error) => {
        console.log("findUser failed:", error) 
    });
}


function createUser(userInfo){
    return db.query('INSERT INTO users(first_name, last_name, email, facebook_id, created_at) VALUES(${first_name}, ${last_name}, ${email}, ${id}, NOW())', userInfo)
    .then((response) => {
        console.log("inserted user:", userInfo)
    }).catch((error)=>{
        console.log("createUser error:", error)
    })
}


///////////FACEBOOK AUTH///////////

//initializes passport
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));


// configures strategy to authenticate using facebook
passport.use(new FacebookStrategy({ 
        clientID: facebookId,
        clientSecret: facebookSecret,
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        profileFields: ['id','name','gender','emails', 'photos']
    },
    (accessToken, refreshToken, profile, callback) => { 
        let user = profile._json;
        user.token = accessToken;
        user.email = user.email || null;

        findUser(user.id)
        .then((response)=>{
            if (!response){
                createUser(user)
            } else {
                console.log('user found:', response)
            }
        })
        .then(() => {
            callback(null, user)
        })
    })
);
    
// this route calls fb authentications
app.get('/auth/facebook', passport.authenticate('facebook'));

// redirected to this route
app.get('/auth/facebook/callback',
    passport.authenticate('facebook'), 
    (req, res) => { 
        res.send(req.user);
    }
);

