const model = require('./models.js');
const paginator = require('./paginator.js');
const { client, asyncSet, asyncGet, asyncDel } = require('./cache.js');

const controller = {};

controller.sendReviewList = function (req, res) {
  return asyncGet(req.params.product_id.toString())
    .then((cacheData) => {
      if (cacheData) {
        cacheData = JSON.parse(cacheData);
        let response = {
          product: req.params.product_id,
          page: req.query.page,
          count: req.query.count,
          results: paginator(cacheData.rows, req.query.count, req.query.page),
        };
        return response;
      } else {
        return model
          .queryProductReviews(req.params.product_id, req.query.sort)
          .then((data) => {
            asyncSet(req.params.product_id.toString(), JSON.stringify(data), 'EX', 90);
            let response = {
              product: req.params.product_id,
              page: req.query.page,
              count: req.query.count,
              results: paginator(data.rows, req.query.count, req.query.page),
            };
            return response;
          })
          .catch((error) => {
            console.error(
              '!!! Controller Error Retrieving Product Reviews From Model Or Transforming Response Data !!!'
            );
          });
      }
    })
    .catch((error) => {
      console.error('!!! Error Checking Cache For Product Review Data !!!');
    });
};

controller.sendProductMetadata = function (req, res) {
  return asyncGet(`${req.params.product_id}_md`).then((cacheData) => {
    if (cacheData) {
      return JSON.parse(cacheData);
    } else {
      return model
        .queryProductMetadata(req.params.product_id)
        .then((data) => {
          asyncSet(`${req.params.product_id}_md`, JSON.stringify(data), 'EX', 90);
          return data;
        })
        .catch((error) => {
          console.error('!!! Controller Error Retrieving Product Metadata From Model !!!');
        });
    }
  });
};

controller.addReview = function (req, res) {
  console.log(req.body);
  return model
    .insertReview(req.params.product_id, req.body)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error('!!! Controller Error Retrieving Product Metadata From Model !!!');
    });
};

controller.markReviewHelpful = function (req, res) {
  return model
    .updateReviewHelpful(req.params.review_id)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error('!!! Controller Error Sending Helpful Metadata To Model !!!');
    });
};

controller.markReviewReported = function (req, res) {
  return model
    .updateReviewReported(req.params.review_id)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error('!!! Controller Error Sending Helpful Metadata To Model !!!');
    });
};

module.exports = controller;
