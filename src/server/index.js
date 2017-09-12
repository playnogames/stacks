import express from 'express';
import path from 'path';
import db from './db';
import facebookConfig from './auth';
import { verifyToken } from './token';
import stockUtil from './stock';
import friends from './friends';

//INIT_______________
const port = process.env.PORT || 3000;

const app = express();

// serve static assets/files in build directory when you hit any express route
app.use(express.static(path.join(__dirname, '../../build')));

// initialize DB tables
db.createUsersTable();
db.createStockLatestTable();
db.createFriendshipTable();


//ROUTES_______________

// serve index.html when user hits main route
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname,'../../build/index.html'));
}).listen(port, () => {
    console.log('Listening on port: ' + port);
});

// request for latest stock data
app.get('/stock', async(request, response) => {
	const ticker = request.query.ticker;

	let stock = await stockUtil.getLatestStockData(ticker)
	response.send(stock);
});

// lookup friend by friend id
app.get('/friend', async(request,response) => {
	const id = request.query.friendId
	let friend = await friends.lookUp(id);
	response.send({
		id: friend.id,
		first_name: friend.first_name,
		last_name: friend.last_name,
		picture: friend.picture
	})
})

// add friend by friend id
app.post('/add_friend', async(request, response) => {
	console.log(request)
	// let friend = await friends.add(id);
})


//FACEBOOK AUTH_______________

// import, configure, initialize passport
const passport = facebookConfig();
app.use(passport.initialize());
app.use(passport.session());

// client login hits this route and redirects to facebook using passport configuration
// user grants FB permission, FB gives us back access token
// we use access token to get/create user and create our own JWT token
app.get('/auth/facebook', passport.authenticate('facebook'));

// once authenticated passport redirects to this route and we send JWT to client
app.get('/auth/facebook/callback',
    passport.authenticate('facebook'),
    (request, response) => response.redirect(`/?token=${request.user}`)
);

// receive JWT, look up user, send user data
app.get('/user', async (request, response) => {
	try {
		let facebookId = await verifyToken(request.query.token).id;
		let userInfo = await db.getUser(facebookId);
		response.send(userInfo);
	} catch (error) {
		console.log('user not found', error);
	}
})