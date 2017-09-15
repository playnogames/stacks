const pgp = require('pg-promise')();

const { DB_USER, DB_PW }  = process.env
const connectionString = process.env.DATABASE_URL || `postgres://${DB_USER}:${DB_PW}@localhost:5432/stacks`;
const db = pgp(connectionString);

export default {
// table init ___________________________

    async createPersonTable(){
        try { 
            let result = await db.query('CREATE TABLE IF NOT EXISTS person (id SERIAL PRIMARY KEY, first_name VARCHAR(40), last_name VARCHAR(40), email VARCHAR(254), facebook_id BIGINT, created_at TIMESTAMP WITH TIME ZONE, picture VARCHAR(500))')
            console.log('person table active');
        } catch (error) {
            console.log('create person table error:', error);
        }
    },

    // make stock_id SMALLINT and create another DB table of tickers & 4 digit stock_id
    async createStockLatestTable(){
        try { 
            let result = await db.query('CREATE TABLE IF NOT EXISTS stock_latest (stock_id SERIAL PRIMARY KEY, ticker VARCHAR(4), closing_price DECIMAL(6,2), current_price DECIMAL(6,2), last_updated TIMESTAMP WITH TIME ZONE)')
            console.log('stock_latest table active');
        } catch (error) {
            console.log('create stock table error:', error);
        }
    },

    async createFriendshipTable(){
        try { 
            let result = await db.query('CREATE TABLE IF NOT EXISTS friendship (friendship_id SERIAL PRIMARY KEY, person_id INT, friend_id INT, created_at TIMESTAMP, status SMALLINT)')
            console.log('friendship table active');
        } catch (error) {
            console.log('create friendship table error:', error);
        }
    },

// person ___________________________

    async verifyPersonFacebookId(facebookId){
        try {
            let result = await db.one(`SELECT id FROM person WHERE facebook_id = ${facebookId}`);
            return result;
        } catch (error) {
            throw error;
        }
    },

    async getPerson(personId){
        try {
            let result = await db.one(`SELECT * FROM person WHERE id = ${personId}`);
            return result;
        } catch (error) {
            throw error;
        }
    },

    async addPerson(personInfo){
        try {
            let result = await db.one('INSERT INTO person(first_name, last_name, email, facebook_id, created_at, picture) VALUES(${firstName}, ${lastName}, ${email}, ${fbId}, ${createdAt}, ${picture}) RETURNING id', personInfo)
            console.log('inserted person:', personInfo)
        } catch (error) {
            console.log('addPerson error:', error)
        }
    },


// friending ___________________________   

    async getFriend(friendId){
        try {
            let result = await db.one(`SELECT * FROM person WHERE id = ${Id}`);
            return result;
        } catch (error) {
            throw error;
        }
    },

    async requestFriend(ids){
        try {
            let result = await db.query('INSERT INTO friendship(person_id, friend_id, status) VALUES ($1, $2, 1), ($2, 1, 2)', ids)
            console.log('added friendship request:', ids)
        } catch (error) {
            console.log('friendship error:', error)
        }
    },

// stocks ___________________________  

    async getStockLatest(ticker){
        try {
            let result = await db.one(`SELECT * FROM stock_latest WHERE "ticker" = '${ticker}'`);
            return result;
        } catch (error) {
            console.log(error)
            return null;
        }
    },


    async addStockLatest(stock){
        try {
            let result = await db.query('INSERT INTO stock_latest(ticker, closing_price, current_price, last_updated) VALUES(${ticker}, ${closing_price}, ${current_price}, ${last_updated})', stock)
            console.log('added stock:', stock.ticker)
        } catch (error) {
            console.log('addStockLatest error:', error)
        }
    },

    async updateStockLatest(stock){
        try {
            let result = await db.query('UPDATE stock_latest SET closing_price=${closing_price}, current_price=${current_price}, last_updated=${last_updated} WHERE ticker=${ticker}', stock)
            console.log('updated stock', stock.ticker);
        } catch(error) {
            console.log('updateStockLatest', error);
        }
    }


}

