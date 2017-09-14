import db from './db';

export default {
	async searchFriend(id) {
		let friend = await db.getFriend(id);
		return friend;
	},

	async requestFriend(personId, friendId) {
		try {
			db.requestFriend([personId,friendId]);
		} catch (error) {
			console.log(error);
		}
	}
}