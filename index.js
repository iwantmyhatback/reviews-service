const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router.js');

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/reviews', router);

app.listen(8393, () => console.log('*** Reviews-Service is listening at http://localhost:8393 ***'));