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
    //optimize so no API requests happen when market is closed
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
				last_updated: moment.utc().toISOString(),
                closing_price: result.previousClose
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

// example api response {"symbol":"AAPL","companyName":"Apple Inc.","primaryExchange":"Nasdaq Global Select","sector":"Technology","calculationPrice":"tops","latestPrice":160.84,"latestSource":"IEX real time price","latestTime":"10:39:59 AM","latestUpdate":1505227199384,"latestVolume":11847236,"iexRealtimePrice":160.84,"iexRealtimeSize":100,"iexLastUpdated":1505227199384,"delayedPrice":160.93,"delayedPriceTime":1505226333132,"previousClose":161.5,"change":-0.66,"changePercent":-0.00409,"iexMarketPercent":0.00995,"iexVolume":117880,"avgTotalVolume":27204843,"iexBidPrice":158,"iexBidSize":100,"iexAskPrice":162,"iexAskSize":100,"marketCap":830775271520,"peRatio":18.81,"week52High":164.94,"week52Low":102.53,"ytdChange":0.39044339216530344}
