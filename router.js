const express = require('express');
const router = express.Router();
const controller = require('./controllers.js');

router.route('/:product_id/list').get((req, res) => {
  controller.sendReviewList(req, res).then(() => {
    res.status(200);
    res.send(' Return List Of Reviews');
  });
});

router.route('/:product_id/meta').get((req, res) => {
  controller.sendProductMetadata(req, res).then(() => {
    res.status(200);
    res.send('Return Product Reviews Metadata');
  });
});

router.route('/:product_id').post((req, res) => {
  controller.addReview(req, res).then(() => {
    res.status(201);
    res.send('Add Review To Product');
  });
});

router.route('/helpful/:review_id').put((req, res) => {
  controller.markReviewHelpful(req, res).then(() => {
    res.status(204);
    res.send('Mark Review Helpful');
  });
});

router.route('/report/:review_id').put((req, res) => {
  controller.markReviewReported(req, res).then(() => {
    res.status(204);
    res.send('Mark Review Reported');
  });
});

module.exports = router;
