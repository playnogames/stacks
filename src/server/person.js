import db from './db';
import tokenizer from './tokenizer';

export default {
	async verifyPerson(token){
		let personId = await tokenizer.verifyToken(token);
		console.log("verify", personId);

		return personId.personId;
	},

	async getPerson(token){
		let personId = await this.verifyPerson(token);
		console.log("get,", personId);
		if (personId) {
			let personInfo = await db.getPerson(personId);
			console.log("person", personInfo);
			return personInfo;
		}
	},

	async verifyPersonFacebookId(facebookId){
		//FIX THIS...cant do let personId = await db.verifyPersonFacebookId(facebookId).id because why?
		let personId = await db.verifyPersonFacebookId(facebookId);
		return personId.id;
	},

	async addPerson(personInfo){
		let personId = await db.addPerson(personInfo).id;
		return personId;
	}
}