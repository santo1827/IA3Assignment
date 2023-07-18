const express = require('express')

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

app.use(cors());