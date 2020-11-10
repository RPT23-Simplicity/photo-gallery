const express = require('express');
const path = require('path');
const morgan = require('morgan');

const cors = require('cors');

const photoDB = require('../database/index.js');

const app = express();

app.use(cors({
  origin: '*',
}));

app.use(morgan('dev'));

const options = {
  setHeaders(res) {
    res.set('Cache-control', 'public, max-age=300');
  },
};

app.use(express.static(path.join(__dirname, '../public'), options));

// get all main photos (regular and thumbnail) for all styles by product ID
app.get('/photos/:productid', async (req, res) => {
  try {
    const productId = Number(req.params.productid);
    const photos = await photoDB.getPhotosByProductId(productId);
    res.send(photos);
  } catch (err) {
    console.log(err);
    res.status(400).send({ err: err.message });
  }
});

// get all photos (including other photos) by style ID
app.get('/photos/:productid/:styleid', async (req, res) => {
  try {
    const productId = Number(req.params.productid);
    const styleId = req.params.styleid;
    const photos = await photoDB.getPhotosByStyleId(productId, styleId);
    res.send(photos);
  } catch (err) {
    console.log(err);
    res.status(400).send({ err: err.message });
  }
});

// dev endpoint for single photo gallery component
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;
