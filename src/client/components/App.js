import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import utils from '../utils';
import Login from './Login';
import Dashboard from './Dashboard';
import Profile from './Profile';


class App extends React.Component {
	constructor() {
		super();

		// when person logs in, server sends client token by redirecting the page with JWT token in the url query string
		// grab token from url and set to localStorage
		utils.setToken();

		this.state = {
			isAuthenticated: utils.isAuthenticated(),
			person: null
		}
	}

	async componentDidMount() {
		// after app mounts, if we have token, verify it with server and return person associated with token
		if (this.state.isAuthenticated) {
			let person = await utils.getPerson();
			this.setState({ person });
		}
	}

	render() {
		let person = this.state.person;

		return (
			<div>
				<div className="header-container">
					<h1>S T A C K S ! 💸</h1>
				</div>

				{ person && <Profile person={person}/> }

				<BrowserRouter>
					<Switch>
						{ person  && <Route exact path="/" component={Dashboard}/>}
						<Route path="/" component={Login}/>
					</Switch>
				</BrowserRouter>

			</div>
		);
	}
}

export default App;
