import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import utils from '../utils';
import Login from './Login';
import Dashboard from './Dashboard';
import Profile from './Profile';


class App extends React.Component {
	constructor() {
		super();

		utils.setToken();

		this.state = {
			token: utils.getToken(),
			user: undefined
		}
	}

	async componentDidMount() {
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
