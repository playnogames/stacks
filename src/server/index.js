import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import db from './db';
import facebookConfig from './auth';
import { verifyPerson } from './token';
import stockUtil from './stock';
import friends from './friends';

//INIT_______________
const port = process.env.PORT || 3000;

const app = express();

// serve static assets/files in build directory when you hit any express route
app.use(express.static(path.join(__dirname, '../../build')));

// parse request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// initialize DB tables
db.createPersonTable();
db.createStockLatestTable();
db.createFriendshipTable();


//ROUTES_______________

// serve index.html when person hits main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'../../build/index.html'));
}).listen(port, () => {
    console.log('Listening on port: ' + port);
});

// search for latest stock data
app.get('/stock/search', async(req, res) => {
	const ticker = req.query.ticker;

	let stock = await stockUtil.getLatestStockData(ticker)
	res.send(stock);
});

// search friend by friend id
app.get('/friend/search', async(req,res) => {
	const friendId = req.query.friendId;
	let payload;

	try {
		let friend = await friends.searchFriend(friendId);
		payload = {
			success: true,
			data: { 
				friendId: friend.id,
				firstName: friend.first_name,
				lastName: friend.last_name,
				picture: friend.picture
			}
		}
	} catch (error) {
		payload = {error: "no friend found"}
	}

	res.send(payload)
})

// request friend by friend id
app.post('/friend/request', async(req, res) => {
	let { token, friendId } = req.body

	// REFACTOR TO CATCH ERRORS
	let facebookId = await verifyPerson(token).id;
	console.log(facebookId)
	let person = await db.getPerson(facebookId);
	console.log(person, person.id)
	// let friend = await friends.requestFriend(personId, friendId);
})

// accept by friend id
app.post('/friend/accept', async(req, res) => {
	let { token, friendId } = req.body
	let facebookId = await verifyPerson(token).id;
	let personId = await db.getPerson(facebookId).id;
	// let friend = await friends.accept(personId, friendId);
})

// remove by friend id
app.post('/friend/accept', async(req, res) => {
	let { token, friendId } = req.body
	let facebookId = await verifyPerson(token).id;
	let personId = await db.getPerson(facebookId).id;
	// let friend = await friends.remove(personId, friendId);
})


//FACEBOOK AUTH_______________

// import, configure, initialize passport
const passport = facebookConfig();
app.use(passport.initialize());
app.use(passport.session());

// client login hits this route and redirects to facebook using passport configuration
// person grants FB permission, FB gives us back access token
// we use access token to get/create person and create our own JWT token
app.get('/auth/facebook', passport.authenticate('facebook'));

// once authenticated passport redirects to this route and we send JWT to client
app.get('/auth/facebook/callback',
    passport.authenticate('facebook'),
    (req, res) => res.redirect(`/?token=${req.user}`)
);

// receive JWT, look up person, send person data
app.get('/person', async (req, res) => {
	try {
		let facebookId = await verifyPerson(req.query.token).id;
		let personInfo = await db.getPerson(facebookId);
		res.send(personInfo);
	} catch (error) {
		console.log('person not found', error);
	}
})