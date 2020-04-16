const express = require('express');
const path = require('path');
const controller = require('./controllers.js');

const router = express.Router();

router.route('/reviews/:product_id/list').get((req, res) => {
  controller.sendReviewList(req, res).then((data) => {
    res.status(200);
    res.send(data);
  });
});

router.route('/reviews/:product_id/meta').get((req, res) => {
  controller.sendProductMetadata(req, res).then((data) => {
    res.status(200);
    res.send(data);
  });
});

router.route('/reviews/:product_id').post((req, res) => {
  controller.addReview(req, res).then(() => {
    res.sendStatus(201);
  });
});

router.route('/reviews/helpful/:review_id').put((req, res) => {
  controller.markReviewHelpful(req, res).then(() => {
    res.sendStatus(204);
  });
});

router.route('/reviews/report/:review_id').put((req, res) => {
  controller.markReviewReported(req, res).then(() => {
    res.sendStatus(204);
  });
});

router.route('/loaderio-147a84b1e50511e59e780e6fb634d9b3/').get((req, res) => {
  res.sendFile(path.join(__dirname, './loader.txt'));
});

module.exports = router;
