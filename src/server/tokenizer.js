import jwt from 'jsonwebtoken';

export default {
	createToken(personId) {
		// encrypts person id using key string and expiration time
	    return jwt.sign(
	        { personId: personId },
	        'MY_SECRET_KEY',
	        { expiresIn: 60 * 60 }
	    );
	},
	verifyToken(token) {
		// returns object with personId 
		return jwt.verify(token, 'MY_SECRET_KEY').personId;
	}
} 
	

