import jwt from 'jsonwebtoken';

export function createToken(person) {
	// encrypts person id using key string and expiration time
    return jwt.sign(
        { id: person.id },
        'MY_SECRET_KEY',
        { expiresIn: 60 * 60 }
    );
}

export function verifyPerson(token) {
	// returns object with person id 
	return jwt.verify(token, 'MY_SECRET_KEY');
}