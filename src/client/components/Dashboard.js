import React from 'react';

import utils from '../utils';
import SelectMenu from './SelectMenu';
import tickers from './ticker';

class Dashboard extends React.Component {
	constructor(){
		super();
		this.state={
			stock: ''
		}

		this.submitTickerSearch = this.submitTickerSearch.bind(this)
	}
	
	async submitTickerSearch(ticker){
		let stock = await utils.getStock(ticker);
		this.setState({ stock: stock })
	}

	render(){
		return(
			<div className="dashboard-container">
				<div className="dashboard-header">
					<h3>DASHBOARD</h3>
					<SelectMenu  submit={this.submitTickerSearch} />
					<div>{this.state.stock.current_price}</div>
				</div>
				<div className="dashboard-content"></div>
			</div>
		)
	}
}

export default Dashboard;
