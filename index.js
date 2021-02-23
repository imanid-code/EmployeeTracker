const mysql = require("mysql");
const inquirer = require("inquirer");


const connectObj = {
    host: "local host",
    port: 3306,
    user: 'root',
    password: '12345678',
    database: 'employee_db'
};

const connection = mysql.createConnection(connectObj);

connection.connect(function(err){
    if (err) {
        throw err;
    }
    console.log(`connect to the db as id ${connection.threadId}`)
})