import express from 'express';
import path from 'path';
import db from './db';
import facebookConfig from './auth';
import { verifyToken } from './token';
import stock from './stock';

////////////INIT///////////
const port = process.env.PORT || 3000;

const app = express();
//serve static files in build directory when you hit any express route
app.use(express.static(path.join(__dirname, '../../build')));

db.createUsersTable();
db.createStockLastPriceTable();


////////////ROUTES///////////
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname,'../../build/index.html'));
}).listen(port, () => {
    console.log('Listening on port: ' + port);
});

app.get('/stock?*', (request, response) => {
	const ticker = request.query.ticker;

	stock.getUpdatedStockData(ticker)
		.then((result)=>{
			response.send(result)
		});
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

app.get('/user', async (request, response) => {
	try {
		let facebookId = await verifyToken(request.query.token).id;
		let userInfo = await db.getUser(facebookId);
		response.send(userInfo);
	} catch (error) {
		console.log('user not found', error);
	}
})