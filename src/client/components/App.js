import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import utils from '../utils';
import Login from './Login';
import Dashboard from './Dashboard';
import Profile from './Profile';


class App extends React.Component {
	
	constructor(){
		super();

		utils.setToken();

		this.state = {
			token: utils.getToken(),
			user: null
		}
	}

	componentDidMount(){
		if (this.state.token) {
			utils.getUser(this.state.token)
				.then((result) => {
					this.setState({ user: result })
				})
		}
	}

	render(){
		let user = this.state.user
		return (
			<div>
				{ user && <Profile user={ user }/> }
				<BrowserRouter>
					<Switch>

						{ user  &&  
							<Route exact path='/' component={ Dashboard }/>
						}

						<Route path='/' component={ Login } />
					</Switch>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;