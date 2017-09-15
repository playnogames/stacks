import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import moment from 'moment';

import tokenizer from './tokenizer';
import personUtil from './person';
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
	        let person = {};
	        let personId;
	        
	        profile = profile._json;
	        
	        person.fbId = profile.id;
	        person.firstName = profile.first_name;
	        person.lastName = profile.last_name;
	        person.email = profile.email || null;
	        person.picture = profile.picture.data.url || null;
	        person.createdAt = moment.utc().toISOString();


	        try {
	        	// check DB for person, return person id
	        	personId = await personUtil.verifyPersonFacebookId(person.fbId);
	        	console.log('user found:', personId);
	        } catch (error) {
	        	// if user doesn't exist, add user to DB, return person id
	        	personId = await personUtil.addPerson(person);
	        	console.log('user doesnt exist:', error);
	        }

	        console.log("HEELOOO", personId);
	        // user person id to create JWT token
	        let token  = await tokenizer.createToken(personId);
	        callback(null, token);
	    })
	);

	return passport;
}

export default facebookConfig;
