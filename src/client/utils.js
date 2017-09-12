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

	async getUser(token) {
		let result = await fetch(`/user/?token=${token}`);
		return result.json();
	},

	async lookUpFriend(friendId){
		let result = await fetch(`/friend/?friendId=${friendId}`);
		return result.json();
	},

	async addFriend(friendId){
		let payload = {
			friendId: friendId,
			JWT: localStorage.getItem('token')
		}

		fetch('/add_friend', 
			{ 
				method: 'post',
				headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
				body: JSON.stringify(payload)

		})
	},

	async getStock(ticker){
		let result = await fetch(`stock/?ticker=${ticker}`);
		return result.json();
	}
}


export default utils;