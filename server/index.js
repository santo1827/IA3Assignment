const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv')

const app = express();

dotenv.config({ path:'./.env' })
const PORT = process.env.PORT || 5000;


//middlewares
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(
  cors({
    origin:"http://frontend:3000"
  })
)

//routes
app.use('/info', require('./routes/endpoints'))
app.use('/auth', require('./routes/auth'))

//server initiation
app.listen(PORT || 5000, () => console.log(`Server listening on port: ${PORT}`));