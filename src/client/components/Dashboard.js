import React from 'react';

import StockSearch from './StockSearch';
import FriendSearch from './FriendSearch';



class Dashboard extends React.Component {

	render(){
		return(
			<div className="dashboard-container">
				<div className="dashboard-header">
					<h3>DASHBOARD</h3>
					<StockSearch />
					<FriendSearch />
				</div>
				<div className="dashboard-content"></div>
			</div>
		)
	}
}

export default Dashboard;
