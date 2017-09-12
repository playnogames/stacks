import React from 'react';

import StockWidget from './StockWidget';
import Friend from './Friend';



class Dashboard extends React.Component {
	

	// async submitFriendSearch(ticker){
	// 	let friend = await utils.getStock(ticker);
	// 	this.setState({ stock: stock })
	// }

	render(){
		return(
			<div className="dashboard-container">
				<div className="dashboard-header">
					<h3>DASHBOARD</h3>
					<StockWidget />
					<Friend />
				</div>
				<div className="dashboard-content"></div>
			</div>
		)
	}
}

export default Dashboard;
