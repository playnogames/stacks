import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import utils from '../utils';
import Login from './Login';
import Dashboard from './Dashboard';


function loggedIn() {
	return false;
}

function requireAuth(component) {
	return (
		loggedIn() ? component : <Login />
	);
}

class App extends React.Component {
	constructor(){
		super();
	}

	render(){
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path='/' render={ () => (requireAuth(<Dashboard/>)) } />
				</Switch>
			</BrowserRouter>
		);
	}
}

export default App;