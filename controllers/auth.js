const db_conection = require("../database");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

exports.register = (req, res) => {
    console.log(req.body);

    const { name, cpf, telephone, email, password, passwordConfirm } = req.body;

    db_conection.query('SELECT email FROM user WHERE email = ?', [email], async(error, results) => {
        if(error){
            console.log(error);
       }
       if(results.length > 0) {
        return res.render('register', {
            message: 'Esse email já está cadastrado'
        })
       }
       else if(password !== passwordConfirm){
        return res.render('register', { 
            message: ' As senhas não são iguais'
        });
       }

       let hashedPassword = await bcrypt.hash(password, 8);
       console.log(hashedPassword);

    });
}