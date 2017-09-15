import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import db from './db';
import facebookConfig from './auth';
// import token from './token';
import stockUtil from './stock';
import friend from './friend';
import personUtil from './person';

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

// search friend by friend's person id
app.get('/friend/search', async(req,res) => {
	const friendId = req.query.friendId;
	let payload;

	let friendInfo = await friend.searchFriend(friendId);

	if (friendInfo) {
		payload = {
			success: true,
			data: { 
				friendId: friendInfo.id,
				firstName: friendInfo.first_name,
				lastName: friendInfo.last_name,
				picture: friendInfo.picture
			}
		}
	} else {
		payload = {error: "no friend found :("}
	}
	
	res.send(payload);
})

// request friend by friend id
app.post('/friend/request', async(req, res) => {
	let friendId = req.body.friendId;
	let token = req.headers.authorization.split(' ')[1];
	let payload;

	try {
		let personId = await personUtil.verifyPerson(token);
		if (personId) {
			await friend.requestFriend(personId, friendId);
			payload = {success: true}
		}
	} catch (error) {
		payload = { error: "couldn't request friend" }
	}
	
	res.send(payload);
})

// accept by friend id
app.post('/friend/accept', async(req, res) => {
	let { token, friendId } = req.body
	try {
		let personId = await personUtil.verifyPerson(token)
	} catch (error) {
		console.log('unable to verify person:', error);
	}
	// let friend = await friend.accept(personId, friendId);
})

// remove by friend id..//send 404 when JWT faills??
app.post('/friend/remove', async(req, res) => {
	let { token, friendId } = req.body
	try {
		let personId = await personUtil.verifyPerson(token)
	} catch (error) {
		console.log('unable to verify person:', error);
	}
	// let friend = await friend.remove(personId, friendId);
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
	let token = req.headers.authorization.split(' ')[1]
	try {
		let personInfo = await personUtil.getPerson(token)
		res.send(personInfo);
	} catch (err) {
		// need to send some response to display on client
	}
})