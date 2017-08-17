const pgp = require('pg-promise')();

const { username, password }  = process.env
const connectionString = process.env.DATABASE_URL || `postgres://${username}:${password}@localhost:5432/stacks`;
const db = pgp(connectionString);

export default {
    //refactor to be generic and take table name and schema
    async createUsersTable(){
        try { 
            let result = await db.query('CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, first_name VARCHAR(40), last_name VARCHAR(40), email VARCHAR(254), facebook_id BIGINT, created_at TIMESTAMP, picture VARCHAR(500))')
            console.log('users table active');
        } catch (error) {
            console.log('create users table error:', error);
        }
    },

    async findUser(facebookId){
        try {
            let result = await db.one(`SELECT * FROM users WHERE facebook_id = ${facebookId}`);
            return result;
        } catch (error) {
            throw error;
        }
    },

    async createUser(userInfo){
        try {
            let result = await db.query('INSERT INTO users(first_name, last_name, email, facebook_id, created_at, picture) VALUES(${first_name}, ${last_name}, ${email}, ${id}, NOW(), ${picture})', userInfo)
            console.log("inserted user:", userInfo)
        } catch (error) {
            console.log("createUser error:", error)
        }
    }
}

