import jwt from 'jsonwebtoken';

export function createToken(user) {
	// encrypts user id using key string and expiration time
    return jwt.sign(
        { id: user.id },
        'MY_SECRET_KEY',
        { expiresIn: 60 * 60 }
    );
}

export function verifyToken(token) {
	// returns object with user id 
	return jwt.verify(token, 'MY_SECRET_KEY');
}