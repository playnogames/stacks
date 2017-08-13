import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import db from './db';

const { facebookId, facebookSecret }  = process.env

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
	    (accessToken, refreshToken, profile, callback) => { 
	        let user = profile._json;
	        user.token = accessToken;
	        user.email = user.email || null;

	        db.findUser(user.id)
	        .then((response)=>{
	            if (!response){
	                db.createUser(user)
	            } else {
	                console.log('user found:', response)
	            }
	        })
	        .then(() => {
	            callback(null, user)
	        })
	    })
	);

	return passport;	
}

export default facebookConfig;