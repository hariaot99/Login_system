const express = require("express");
const db_conection = require('./database/index');
const app = express();
const path = require('path');
const publicDirectory  = path.join(__dirname, './public');

app.use(express.static(publicDirectory));

app.get("/", (req, res) => {
    res.render('index')
});

app.set('view engine', 'hbs');

app.listen(8080, () => {
    console.log(">>>>> Servidor Iniciado com Sucesso! ");
})