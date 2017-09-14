import query from 'query-string';

const utils = {

	setToken() {
		let token = query.parse(window.location.search).token
		if (token) {
			localStorage.setItem('token', token)
			//delete query string so that if user refreshes and the app re-mounts, token is not set again
			window.history.replaceState(null, null, window.location.pathname);
		}
	},

	getToken() {
		return localStorage.getItem('token');
	},

	logout() {
		localStorage.removeItem('token');
	},

	async getPerson(token) {
		let result = await fetch(`/person/?token=${token}`);
		return result.json();
	},

	async searchFriend(friendId){
		let result = await fetch(`/friend/search?friendId=${friendId}`);
		return result.json();
	},

	async requestFriend(friendId){
		let payload = {
			friendId: friendId,
			token: localStorage.getItem('token')
		}

		fetch('/friend/request', 
			{ 
				method: 'post',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(payload)
		})
	},

	async searchStock(ticker){
		let result = await fetch(`stock/search?ticker=${ticker}`);
		return result.json();
	}
}


export default utils;