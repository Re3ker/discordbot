const mysql = require('mysql');
const config = require(__basedir + '/config.json');

let connection;

function handleDisconnect() {
    connection = module.exports = mysql.createConnection(config.db);
    
    connection.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });
    
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            console.log(err);
        }
    });
}

handleDisconnect();