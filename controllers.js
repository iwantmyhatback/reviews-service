const model = require('./models.js');
const controller = {};

controller.sendReviewList = function (req, res) {
  return model
    .queryProductReviews(req.params.product_id)
    .then((data) => {
      // console.log(data);
      console.log('*** Controller Successfully Retrieved Product Reviews From Model ***');
      return data.results;
    })
    .catch((error) => {
      // console.error(error);
      console.error('!!! Controller Error Retrieving Product Reviews From Model !!!');
    });
};

controller.sendProductMetadata = function (req, res) {
  return model
    .queryProductMetadata(req.params.product_id)
    .then((data) => {
      console.log(data);
      console.log('*** Controller Successfully Retrieved Product Metadata From Model ***');
      return data;
    })
    .catch((error) => {
      // console.error(error);
      console.error('!!! Controller Error Retrieving Product Metadata From Model !!!');
    });
};

controller.addReview = function (req, res) {
  console.log(req.body);
  return model
    .insertReview(req.params.product_id, req.body)
    .then((data) => {
      console.log('*** Controller Successfully Retrieved Product Metadata From Model ***');
      return data;
    })
    .catch((error) => {
      // console.error(error);
      console.error('!!! Controller Error Retrieving Product Metadata From Model !!!');
    });
};

controller.markReviewHelpful = function (req, res) {
  return model
    .updateReviewHelpful(req.params.review_id)
    .then((data) => {
      // console.log(data);
      console.log('*** Controller Successfully Sent Helpful Metadata To Model ***');
      return data;
    })
    .catch((error) => {
      // console.error(error);
      console.error('!!! Controller Error Sending Helpful Metadata To Model !!!');
    });
};

controller.markReviewReported = function (req, res) {
  return model
    .updateReviewReported(req.params.review_id)
    .then((data) => {
      // console.log(data);
      console.log('*** Controller Successfully Sent Helpful Metadata To Model ***');
      return data;
    })
    .catch((error) => {
      // console.error(error);
      console.error('!!! Controller Error Sending Helpful Metadata To Model !!!');
    });
};

module.exports = controller;
