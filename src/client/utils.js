const utils = {

	isLoggedIn(){
		return localStorage.getItem('token');
	},

	logout(){
		localStorage.removeItem('token');
	}
}


export default utils;