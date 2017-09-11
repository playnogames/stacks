import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import utils from '../utils';
import Login from './Login';
import Dashboard from './Dashboard';
import Profile from './Profile';


class App extends React.Component {
	constructor() {
		super();

		// when user logs in, server sends client token by redirecting the page with JWT token in the url query string
		// grab token from url and set to localStorage
		utils.setToken();

		this.state = {
			//get token from localStorage
			token: utils.getToken(),
			user: undefined
		}
	}

	async componentDidMount() {
		//after app mounts, if we have token, verify it with server and return user associated with token
		if (this.state.token) {
			let user = await utils.getUser(this.state.token);
			this.setState({ user });
		}
	}

	render() {
		let loggedIn = typeof this.state.user !== 'undefined';
		let user = this.state.user;

		return (
			<div>
				<div className="header-container">
					<h1>S T A C K S ! 💸</h1>
				</div>

				{ loggedIn && <Profile user={user}/> }

				<BrowserRouter>
					<Switch>
						{ loggedIn  && <Route exact path="/" component={Dashboard}/>}
						<Route path="/" component={Login}/>
					</Switch>
				</BrowserRouter>

			</div>
		);
	}
}

export default App;
