import React from 'react';

import utils from '../utils';

function Profile(props) {
	
	const {id, first_name, created_at} = props.user
	return (
		<div>
			<ul>
				<li>{first_name}</li>
				<li>{created_at}</li>
			</ul>
		</div>
	)
}

export default Profile;