import express from 'express';
import path from 'path';
import db from './db';
import facebookConfig from './auth';
import { verifyToken } from './token';

////////////INIT///////////

const port = process.env.PORT || 3000;

const app = express();
//serve static files in build directory when you hit any express route
app.use(express.static(path.join(__dirname, '../../build')));

db.createUsersTable();


////////////ROUTES///////////

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname,'../../build/index.html'));
}).listen(port, () => {
    console.log('Listening on port: ' + port);
});


///////////FACEBOOK AUTH///////////

const passport = facebookConfig();
app.use(passport.initialize());
app.use(passport.session());

// this route calls fb authentications
app.get('/auth/facebook', passport.authenticate('facebook'));

// redirected to this route
app.get('/auth/facebook/callback',
    passport.authenticate('facebook'),
    (request, response) => response.redirect(`/?token=${request.user}`)
);

app.get('/user', (request, response) => {
	verifyToken(request.query.token, (facebookId) => {
		db.findUser(facebookId)
			.then((result) => {
				response.send(result);
			}).catch((error) => {
				console.log('user not found', error)
			})
	})
})