const express = require('express');
const fs = require('fs');
const request = require('request');
const mysql = require('mysql2')

const router = express.Router()

const con = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

router.get('/exercises/db', (req, res) => {
    const sqlGet = 'SELECT * FROM exercise'
    con.query(sqlGet, (error, result) => {
        res.send(result)
        if(error) {
        res.json("There has been an error connecting to the database");
        console.log(error);
        }
    })
})

// router.post('/exercises/:name', (req, res) => {
//     const name = req.body.name;
//     const sqlGetID = `SELECT * FROM exercise WHERE Name LIKE '%${name}%'`;

//     con.query(sqlGetID, (error, result) => {
//         if (result === '[]') {
//         res.json(`No record found matching ${name} in the database. Please try a different search query.`)
//         } else {
//         res.json(JSON.stringify(result));
//         }
        
        

//         if (error) {
//         res.json("There has been an error connecting to the database");
//         console.log(error);
//         }
//     });
// });

router.post('/exercises/search', (req, res) => {
    const name = req.body.search

    request.get({
        url: `https://api.api-ninjas.com/v1/exercises?name=${name}`,
        headers: {
        'X-Api-Key': process.env.X_API_KEY_EXERCISE
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

router.get('/gym', (req, res) => {

fs.readFile('./gym.json', 'utf-8', (error, data) => {
    if(error){
    console.log(error);
    return;
    }
    res.send(JSON.parse(data));
})
});


module.exports = router;