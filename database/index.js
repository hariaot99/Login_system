const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({path: './database/.env'});

const db_conection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

db_conection.connect(function(err){
    if (err) throw err;
    console.log(">>>>> Banco de Dados Conectado!");
})

module.exports = db_conection;