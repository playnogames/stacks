import React from 'react';

import utils from '../utils';


class Login extends React.Component {
	constructor() {
		super()
	}

	render() {
		return(
			<div className="login-container">
				<a className="login-link" href="/auth/facebook">Login with Facebook</a>
			</div>
		)
	}
}

export default Login;
