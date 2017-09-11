import request from 'request-promise';

export default {
	fetchStockData(ticker) {
		var options = {
		    uri: `https://api.iextrading.com/1.0/stock/${ticker}/quote`,
		    headers: {
		        'User-Agent': 'Request-Promise'
		    },
		    json: true 
		};
	
		return request(options);
	}
}