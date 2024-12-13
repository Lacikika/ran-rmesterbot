const mysql = require('mysql2');
require('dotenv').config();

// Create a connection to the database
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'discord',
    password: process.env.MYSQL_PASSWORD || 'O5S29k46Tja2+',
    database: process.env.MYSQL_DATABASE || 'discord_bot',
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('100% ...');
    console.log('Connected to the MySQL database.');
});

// Increment user activity
function incrementUserActivity(userId, message, username) {
    const query = `INSERT INTO user_activity (user_id, message_count) VALUES (?, 1)
                   ON DUPLICATE KEY UPDATE message_count = message_count + 1`;
    connection.query(query, [userId], (err) => {
        if (err) {
            console.error('Error incrementing user activity:', err);
        }
	log('Üzenet', message, username) 
    });
}

function log(kind, message, username,) {
    const timestamp = new Date().toISOString();
    console.log(`[ ${timestamp} ][ ${kind} ] ${username} ${message}`);
} 

log('INFO', 'test', 'test')
// Get user activity
function getUserActivity(userId, callback) {
    const query = `SELECT message_count FROM user_activity WHERE user_id = ?`;
    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user activity:', err);
            callback(0);
            return;
        }
        const messageCount = results.length > 0 ? results[0].message_count : 0;
        callback(messageCount);
    });
}



module.exports = { incrementUserActivity, getUserActivity, log };
