const express = require("express");


const app = express();

app.get("/", (req, res) => {
    res.send("<h1> Pagina Principal </h1>")
});

app.listen(8080, () => {
    console.log(">>>>> Servidor Iniciado com Sucesso! <<<<<");
})