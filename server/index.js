const express = require('express');
const request = require('request');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const fs = require('fs');

const PORT = 5000;

const app = express();
const con = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"password",
  database:"gymApp"
})

app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));

app.post('/exercises/search', (req, res) => {
  const name = req.body.search

  request.get({
    url: `https://api.api-ninjas.com/v1/exercises?name=${name}`,
    headers: {
      'X-Api-Key':'lRfrEwrin8NPlXodL/dM3g==W6iT0EaDccfb6bvX'
    },
  }, (error,response,body) => {
    if (error) return console.error('Request failed:', error);
    else if (response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'));
    else {
      const pbody = JSON.parse(body)
      res.json(pbody)
    }
  }
  )

})

app.post('/signup', (req, res) => {
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

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!password) {
    res.json('Please enter a password!');
  } else {
    const query = `SELECT Password FROM users WHERE Username = ?`;

    con.query(query, [username], (error, result) => {
      if (error) {
        res.json('Something went wrong while connecting to the database');
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






app.post('/exercises/:name', (req, res) => {
  const name = req.body.name;
  const sqlGetID = `SELECT * FROM exercise WHERE Name LIKE '%${name}%'`;
  con.query(sqlGetID, (error, result) => {
    if (result === '[]') {
      res.json(`No record found matching ${name} in the database. Please try a different search query.`)
    } else {
      res.json(JSON.stringify(result));
    }
    
    

    if (error) {
      res.json("There has been an error connecting to the database");
      console.log(error);
    }
  });
});

app.get('/exercises/insert', (req,res) => {
  const muscle = "traps"

  request.get({
    url: `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`,
    headers: {
      'X-Api-Key':'lRfrEwrin8NPlXodL/dM3g==W6iT0EaDccfb6bvX'
    },
  }, (error,response,body) => {
    if (error) return console.error('Request failed:', error);
    else if (response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'));
    else {
      const pbody = JSON.parse(body)
    }
  }
  )
})

app.get('/exercises/db', (req, res) => {
  const sqlGet = 'SELECT * FROM exercise'
  con.query(sqlGet, (error, result) => {
    res.send(result)
    if(error) {
      res.json("There has been an error connecting to the database");
      console.log(error);
    }
  })
})

app.get('/exercises', (req, res) => {
  var muscle = 'traps';
  request.get({
    url: 'https://api.api-ninjas.com/v1/exercises?muscle=' + muscle,
    headers: {
      'X-Api-Key': 'lRfrEwrin8NPlXodL/dM3g==W6iT0EaDccfb6bvX'
    },
  }, function (error, response, body) {
    if (error) return console.error('Request failed:', error);
    else if (response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'));
    else res.json(body);
  });
});

app.get('/gym', (req, res) => {

  fs.readFile('./gym.json', 'utf-8', (error, data) => {
    if(error){
      console.log(error);
      return;
   }
   res.send(JSON.parse(data));
  })
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));