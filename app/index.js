const express = require('express');
const port = process.env.PORT || 3000;

const app = express();
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
}).listen(port, () => {
    console.log('Listening on port: ' + port);
});
