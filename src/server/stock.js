import api from './api';
import db from './db';
import moment from 'moment';

function isStockOutdated(stock){
	const timeLastUpdated = (moment.utc() - moment.utc(stock.last_updated))/60000
	
    if (timeLastUpdated > 10) {
		return true; 
	}

	return false
}


export default {
	async getLatestStockData(ticker){
        //query DB for stock data
		let stock = await db.getStockLatest(ticker);
        //if db returns null, isStockNew = true
        let isStockNew = !stock

        //if stock is new OR stock was fetched more than 10 minutes ago
		if (isStockNew || isStockOutdated(stock)){
            //request stock data from api
			let result = await api.fetchStock(ticker);
			
			stock = {
				ticker: ticker,
				current_price: result.latestPrice,
				last_updated: moment.utc().toISOString()
			}

			if (isStockNew){
                //if stock is new to the database, add stock to DB
				db.addStockLatest(stock);	
			} else {
                // if stock existed but was outdated, update with new stock data
				db.updateStockLatest(stock);
			}

		}

		return stock;
	}
}