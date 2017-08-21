import React from 'react';

import utils from '../utils';


function Profile(props) {

	const { first_name, last_name, created_at, picture } = props.user
	return (
		<div>
			<ul>
				<img className="profile-picture" src={picture}/>
				<li>{first_name} {last_name}</li>
			</ul>
		</div>
	)
}

export default Profile;