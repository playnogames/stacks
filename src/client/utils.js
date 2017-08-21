import query from 'query-string';
import axios from 'axios';


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
		let user = await axios.get(`/user/?token=${token}`);
		return user.data;
	}
}


export default utils;