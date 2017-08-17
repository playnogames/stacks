import jwt from 'jsonwebtoken';

export function createToken(user) {
    return jwt.sign(
        { id: user.id },
        'MY_SECRET_KEY',
        { expiresIn: 60 * 60 }
    );
}

export function verifyToken(token) {
	return jwt.verify(token, 'MY_SECRET_KEY');
}