const utils = {

	isLoggedIn(){
		return sessionStorage.getItem('isLoggedIn');
	},

	login(){
		sessionStorage.setItem('isLoggedIn', true);
	},

	logout(){
		sessionStorage.removeItem('isLoggedIn');
	}
}


export default utils;