import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import utils from '../utils';

import Login from './Login';
import Dashboard from './Dashboard';


class App extends React.Component {
	constructor(){
		super();
	}

	render(){
		return(
			<BrowserRouter>
				<Switch>
					{ !utils.isLoggedIn() &&
						<Route path='/' component={ Login }/>
					}
					<Route exact path='/' component={ Dashboard } />
				</Switch>
			</BrowserRouter>
		)
	}
}

export default App;