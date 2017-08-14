import jwt from 'jsonwebtoken';

export function createToken(user) {
    return jwt.sign(
        { id: user.id },
        'MY_SECRET_KEY',
        { expiresIn: 60 * 60 }
    );
}

export function verifyToken(token, callback) {
	return jwt.verify(token, 'MY_SECRET_KEY', (error, result) => {
		if (result) {
			let {id, iat, exp} = result
			callback(id)
		} else {
			console.log('JWT error:', error)
		}
	})
}