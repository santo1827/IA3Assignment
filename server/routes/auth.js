const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');


const router = express.Router()

dotenv.config({ path:'./.env' })

const con = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

router.post('/signup', (req, res) => {
    const username = req.body.username
    const password = bcrypt.hashSync(req.body.password, 12);
  
    const sqlcheck = `SELECT Username FROM users WHERE Username = ?`;
  
    con.query(sqlcheck, [username], (error, result) => {
      if (error) {
        res.json(error);
      } else {
        if (result.length > 0) {
          res.json('Username already assigned an account');
        } else {
          const sqlSignup = 'INSERT INTO users (Username, Password) VALUES (?, ?)';
          con.query(sqlSignup, [username, password], (error, result) => {
            if (error) {
              res.json(error);
            } else {
              res.json('Account created');
            }
          });
        }
      }
    });
  });
  
  router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!password) {
      res.json('Please enter a password!');
    } else {
      const query = `SELECT Password FROM users WHERE Username = ?`;
  
      con.query(query, [username], (error, result) => {
        if (error) {
          res.json('Something went wrong while connecting to the database');
          console.log(error)
        } else if (result.length > 0) {
          const storedPassword = result[0].Password;
          const comparison = bcrypt.compareSync(password, storedPassword);
  
          if (comparison) {
            res.json('Logged in');
          } else {
            res.json('Incorrect username or password');
          }
        } else {
          res.json('Incorrect username or password. Please try again');
        }
      });
    }
  });


module.exports = router