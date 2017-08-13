const pgp = require('pg-promise')();

const { username, password }  = process.env
const connectionString = process.env.DATABASE_URL || `postgres://${username}:${password}@localhost/stacks`;
const db = pgp(connectionString);

export default {
    //refactor to be generic and take table name and schema
    createUsersTable(){
        db.query('CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, first_name VARCHAR(40), last_name VARCHAR(40), email VARCHAR(254), facebook_id BIGINT, created_at TIMESTAMP)')
            .then((response) => {
                console.log('users table created')
                
            }).catch((error) => {
                console.log('create users table error:', error)
                
            });   
    },


    findUser(facebookId){

        return db.query(`SELECT * FROM users WHERE facebook_id = ${facebookId}`)
        .then((response) => {
           if (response.length) { return response; }
           return null;
        }).catch((error) => {
            console.log("findUser failed:", error) 
        });
    },


    createUser(userInfo){
        return db.query('INSERT INTO users(first_name, last_name, email, facebook_id, created_at) VALUES(${first_name}, ${last_name}, ${email}, ${id}, NOW())', userInfo)
        .then((response) => {
            console.log("inserted user:", userInfo)
        }).catch((error)=>{
            console.log("createUser error:", error)
        })
    }
}

