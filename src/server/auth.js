import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import moment from 'moment';

import { createToken } from './token';
import db from './db';


const { FB_ID, FB_PW }  = process.env;

function facebookConfig() {
	// what does this do??
	passport.serializeUser((user, done) => done(null, user));
	passport.deserializeUser((user, done) => done(null, user));

	// configuration to authenticate using facebook
	passport.use(new FacebookStrategy({
	        clientID: FB_ID,
	        clientSecret: FB_PW,
	        // redirect route after user authenticates on FB page
	        callbackURL: 'http://localhost:3000/auth/facebook/callback',
	        profileFields: ['id','name','emails', 'photos']
	    },
	    // callback executed after user authenticates on FB page
	    async (accessToken, refreshToken, profile, callback) => {
	        let user = profile._json;
	        user.token = accessToken;
	        user.email = user.email || null;
	        user.picture = user.picture.data.url || null;
	        user.created_at = moment.utc().toISOString();

	        try {
	        	// check DB for user
	        	let result = await db.getPerson(user.id);
	        	console.log('user found:', result);
	        } catch (error){
	        	// if user doesn't exist, add user to DB
	        	console.log('user doesnt exist:', error);
	        	db.addPerson(user);
	        }

	        // create JWT token to be stored in client localStorage
	        let token  = await createToken(user);
	        callback(null, token);
	    })
	);

	return passport;
}

export default facebookConfig;
