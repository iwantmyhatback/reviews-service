const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router.js');
const cors = require('cors');
const port = process.env.PORT || 8393;

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/', router);

app.listen(port, () => console.log(`*** Reviews-Service is listening on port ${port} ***`));
