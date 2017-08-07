const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const pg = require('pg');
const username = process.env.username;
const password = process.env.password;
const connectionString = process.env.DATABASE_URL || 'postgres://'+username+':'+password+'@localhost/stacks';
const client = new pg.Client(connectionString);


app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
}).listen(port, () => {
    console.log('Listening on port: ' + port);
});


client.connect();
client.query('CREATE TABLE users(id SERIAL PRIMARY KEY, first_name VARCHAR(40), last_name VARCHAR(40), email VARCHAR(254), created_at TIMESTAMP)')
    .then((response) => {
        console.log('users table created')
        client.end()})
    .catch((error) => {
        console.log(error)})
