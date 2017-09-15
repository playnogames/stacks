import db from './db';

export default {
	async searchFriend(friendId) {
		try {
			let friendInfo = await db.getFriend(friendId);
			return friendInfo;
		} catch (err) {
			// probably dont need to log this error...this is user error
			console.log("searchFriend error: ", err);
			return null;
		}
	},

	async requestFriend(personId, friendId) {
		try {
			await db.requestFriend([personId,friendId]);
		} catch (err) {
			console.log('requestFriend error:', err);
			throw err;
		}
	}
}