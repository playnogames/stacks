import query from 'query-string';

const utils = {

	configFetch(method, payload){
		//this seems wrong?? should i be passing it from the apps state or something...?
		let token = localStorage.getItem('token');
		let config = { 
			method: method,
			headers: {
				'Accept': 'application/json',
            	'Content-Type': 'application/json',
            	'Authorization': `Bearer ${token}`
            }
		}

		if (payload) {
			config.body = JSON.stringify(payload);
		}
		
		return config;
	},

	isAuthenticated(){
		return !!localStorage.getItem('token');
	},

	setToken(){
		let token = query.parse(window.location.search).token;
		if (token) {
			localStorage.setItem('token', token)
			//delete query string so that if user refreshes and the app re-mounts, token is not set again
			window.history.replaceState(null, null, window.location.pathname);
		}
	},

	logout(){
		localStorage.removeItem('token');
	},

	async getPerson(){
		let config = this.configFetch('get');
		let result = await fetch(`/person`, config);
		return result.json();
	},

	async searchFriend(friendId){
		let result = await fetch(`/friend/search?friendId=${friendId}`);
		return result.json();
	},

	async requestFriend(friendId){
		let payload = { friendId: friendId };
		let config = this.configFetch('post', payload);

		let result = await fetch('/friend/request', config);
		return result.json();
	},

	async searchStock(ticker){
		let result = await fetch(`stock/search?ticker=${ticker}`);
		return result.json();
	}
}


export default utils;