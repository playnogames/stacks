import db from './db';

export default {
	async searchFriend(friendId) {
		let friend = await db.getFriend(friendId);
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