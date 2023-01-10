const db_conection = require("../database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const { promisify } = require("util");
const { decode } = require("punycode");

exports.register = (req, res) => {
  const { name, cpf, telephone, email, password, passwordConfirm } = req.body;
  console.log(req.body);
  try {
    if (
      !name ||
      !cpf ||
      !telephone ||
      !email ||
      !password ||
      !passwordConfirm
    ) {
      return res.status(400).render("register", {
        message: "Preencha todos os dados",
      });
    }
  } catch (error) {
    console.log(error);
  }

  db_conection.query(
    "SELECT email FROM user WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        return res.render("register", {
          message: "Esse email já está cadastrado",
        });
      } else if (password !== passwordConfirm) {
        return res.render("register", {
          message: " ERRO: As senhas são diferentes",
        });
      }
      db_conection.query("SELECT cpf FROM user WHERE cpf = ?", [
        cpf,
        async (error, results) => {
          if (error) {
            console.log(error);
          }
          if (results.length > 0) {
            return res.render("register", {
              message: "Cpf já está cadastrado",
            });
          }
        },
      ]);

      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      db_conection.query(
        "INSERT INTO user SET ?",
        {
          name: name,
          cpf: cpf,
          telephone: telephone,
          email: email,
          password: hashedPassword,
        },
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log(results);
            return res.render("register", {
              message: "Usuario registrado",
            });
          }
        }
      );
    }
  );
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).render("login", {
        message: "Insira um email e senha",
      });
    }
  } catch (error) {
    console.log(error);
  }

  db_conection.query(
    "SELECT * FROM user WHERE email = ?",
    [email],
    async (error, results) => {
      console.log(results);
      if (!results || !(await bcrypt.compare(password, results[0].password))) {
        return res.status(401).render("login", {
          message: "Email ou Senha incorretos",
        });
      } else {
        const id = results[0].id;
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        console.log("The token is: " + token);
        const cookieOpitions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          ),
          httpOnly: true,
        };
        res.cookie("jwt", token, cookieOpitions);
        res.status(200).redirect("/");
      }
    }
  );
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(req.cookies.jwt,
        process.env.JWT_SECRET
      );
      console.log(decoded);

      db_conection.query('SELECT * FROM user WHERE id = ?', [decode.id], (error, result)=>{
        console.log(result);
      })
    } catch (error) {
        console.log(error);
    }
  }
  next();
};
