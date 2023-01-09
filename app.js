const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const publicDirectory  = path.join(__dirname, './public');

//definindo local do front end em hbs
app.use(express.static(publicDirectory));

//permissao para receber URL-encoded bodies enviados pelos forms HTML
app.use(express.urlencoded({ extended: false}));

//garantir que os dados do forms chegam em json
app.use(express.json());
// Inicializando os cookies instalados
app.use(cookieParser());
//definindo local das rotas
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


app.set('view engine', 'hbs');

app.listen(8085, () => {
    console.log(">>>>> Servidor Iniciado com Sucesso! Porta: 8085 ");
})