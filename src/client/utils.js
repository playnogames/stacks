import query from 'query-string';
import axios from 'axios';

const utils = {

	setToken(){
		let token = query.parse(window.location.search).token
		if (token) {
			localStorage.setItem('token', token)
			//delete query string so that if user refreshes and the app re-mounts, token is not set again
			window.history.replaceState(null, null, window.location.pathname);
		}
	},

	getToken(){
		return localStorage.getItem('token');
	},

	logout(){
		localStorage.removeItem('token');
	},

	getUser(token){
		return axios.get(`/user/?token=${token}`)
			.then((response) => {
				return response.data
			})
	}
}


export default utils;