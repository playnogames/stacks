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

    async createStockLastPriceTable(){
        try { 
            let result = await db.query('CREATE TABLE IF NOT EXISTS stock_last_price (id SERIAL PRIMARY KEY, ticker VARCHAR(4), current_price DECIMAL(6,2), last_updated TIMESTAMP)')
            console.log('stock_last_price table active');
        } catch (error) {
            console.log('create stock table error:', error);
        }
    },

    async getUser(facebookId){
        try {
            let result = await db.one(`SELECT * FROM users WHERE facebook_id = ${facebookId}`);
            return result;
        } catch (error) {
            throw error;
        }
    },

    async getStockLastPrice(ticker){
        try {
            let result = await db.one(`SELECT * FROM stock_last_price WHERE "ticker" = '${ticker}'`);
            return result;
        } catch (error) {
            console.log(error)
            return null;
        }
    },


    async addUser(userInfo){
        try {
            let result = await db.query('INSERT INTO users(first_name, last_name, email, facebook_id, created_at, picture) VALUES(${first_name}, ${last_name}, ${email}, ${id}, NOW(), ${picture})', userInfo)
            console.log("inserted user:", userInfo)
        } catch (error) {
            console.log("addUser error:", error)
        }
    },

    async addStockLastPrice(stockData){
        try {
            let result = await db.query('INSERT INTO stock_last_price(ticker, current_price, last_updated) VALUES(${ticker}, ${current_price}, ${last_updated})', stockData)
            console.log("added stock:", stockData.ticker)
        } catch (error) {
            console.log("addStockLastPrice error:", error)
        }
    }

}

