const express = require('express');
const router = express.Router();

router.route('/:product_id/list').get((req, res) => {
  res.status(200);
  res.send(' Return List Of Reviews');
});

router.route('/:product_id/meta').get((req, res) => {
  res.status(200);
  res.send('Return Product Reviews Metadata');
});

router.route('/:product_id').post((req, res) => {
  res.status(201);
  res.send('Add Review To Product');
});

router.route('/helpful/:review_id').put((req, res) => {
  res.status(204);
  res.send('Mark Review Helpful');
});

router.route('/report/:review_id').put((req, res) => {
  res.status(204);
  res.send('Mark Review Reported');
});

module.exports = router;
