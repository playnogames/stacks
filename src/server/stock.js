import api from './api';
import db from './db';

function isStockUpdated(stockData){
	return true;
}


export default {
	async getUpdatedStockData(ticker){
		let stockData = await db.getStockLastPrice(ticker);
		console.log("stock", stockData)
		if (!stockData || !isStockUpdated(stockData)){
			let result = await api.fetchStockData(ticker);
			
			stockData = {
				ticker: ticker,
				current_price: result.latestPrice,
				last_updated: new Date().toISOString()
			}

			db.addStockLastPrice(stockData);
		}

		return stockData;
	}
}