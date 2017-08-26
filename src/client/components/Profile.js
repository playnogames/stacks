import React from 'react';

import utils from '../utils';


function Profile(props) {

	const { first_name, last_name, created_at, picture } = props.user
	return (
		<div className="profile-container">
			<div className="profile-content">
				<img className="profile-picture" alt="user profile" src={picture}/>
				<p className="profile-name">{first_name} {last_name}</p>
			</div>
		</div>
	)
}

export default Profile;
