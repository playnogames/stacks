import db from './db';
import tokenizer from './tokenizer';

export default {
	verifyPerson(token){
		try {
			return tokenizer.verifyToken(token);
		} catch (err) {
			console.log('couldnt verify person:', err);
			throw err;
		}
	},

	async getPerson(token){
		let personId = this.verifyPerson(token);
		try {
			let personInfo = await db.getPerson(personId);
			return personInfo;
		} catch (err) {
			console.log('couldnt find person:', err);
			throw err;
		}
		
	},

	async verifyPersonFacebookId(facebookId){
		try {
			let personId = await db.verifyPersonFacebookId(facebookId);
			return personId;
		} catch (err) {
			console.log("verifyPersonFacebookId error:", err);
			return null;
		}
	},

	async addPerson(personInfo){
		try {
			let personId = await db.addPerson(personInfo);
			return personId;
		} catch (err) {
			throw err;
		}
	}
}