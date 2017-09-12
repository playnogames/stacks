import db from './db';

export default {
	async lookUp(id) {
		let friend = await db.getFriend(id);
		return friend;
	},

	async add(userId, friendId) {
		try {
			db.addFriend([userId,friendId]);
		} catch (error) {
			console.log(error);
		}
	}
}