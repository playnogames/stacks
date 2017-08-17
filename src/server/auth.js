import passport from 'passport';
import FacebookStrategy from 'passport-facebook';

import { createToken } from './token';
import db from './db';


const { facebookId, facebookSecret }  = process.env;

function facebookConfig(app) {
	passport.serializeUser((user, done) => done(null, user));
	passport.deserializeUser((user, done) => done(null, user));

	// configures strategy to authenticate using facebook
	passport.use(new FacebookStrategy({
	        clientID: facebookId,
	        clientSecret: facebookSecret,
	        callbackURL: 'http://localhost:3000/auth/facebook/callback',
	        profileFields: ['id','name','emails', 'photos']
	    },
	    async (accessToken, refreshToken, profile, callback) => {
	        let user = profile._json;
	        user.token = accessToken;
	        user.email = user.email || null;
	        user.picture = user.picture.data.url || null;

	        try {
	        	let result = await db.findUser(user.id);
	        	console.log('user found:', result);
	        } catch (error){
	        	console.log('user doesnt exist:', error);
	        	db.createUser(user);
	        }

	        let token  = await createToken(user);
	        callback(null, token);
	    })
	);

	return passport;
}

export default facebookConfig;
