const connection = require('./database.js');
const model = {};

model.queryProductReviews = function (product_id) {
  return connection
    .query('SELECT r.* FROM product_reviews pr INNER JOIN reviews r ON r.review_id=pr.review_id WHERE product_id=$1', [
      product_id,
    ])
    .then((data) => {
      console.log(data.rows);
      console.log('*** Successfully Queried Reviews By Product From Database ***');
      //Need to handle pagination of response object
      let response = {
        product: product_id,
        page: 0,
        count: data.rows.length,
        results: data.rows,
      };
      return response;
    })
    .catch((error) => {
      // console.error(error);
      console.error('!!! Error Querying Reviews By Product From Database !!!');
    });
};

model.queryProductMetadata = function (product_id) {
  return connection
    .query(
      'SELECT pm.*,ch.characteristic_id,ch.value, cn.name \
      FROM product_metadata pm \
      JOIN characteristic_set cs ON pm.product_id=cs.product_id \
      JOIN characteristic ch ON cs.characteristic_id=ch.characteristic_id \
      JOIN characteristic_names cn ON ch.char_name_id=cn.char_name_id \
      WHERE cs.product_id=$1;',
      [product_id]
    )
    .then((data) => {
      // console.log(data.rows);
      console.log('*** Successfully Queried Reviews By Product From Database ***');
      return data;
    })
    .then((data) => {
      //Set Product Data To Response Object
      let response = {
        product: product_id,
        ratings: data.rows[0] ? data.rows[0].ratings : null,
        recommended: data.rows[0] ? data.rows[0].recommended : null,
        data: data.rows,
      };
      return response;
    })
    .then((data) => {
      //Set Characteristic Data To Response Object
      let response = data;
      let characteristics = {};
      for (let row of data.data) {
        let temp = {
          [row.name]: {
            id: row.characteristic_id,
            value: (row.value.total / row.value.count).toFixed(4),
          },
        };
        characteristics[row.name] = temp[row.name];
      }
      delete response.data;
      response['characteristics'] = characteristics;
      return response;
    })
    .catch((error) => {
      // console.error(error);
      console.error('!!! Error Querying Reviews By Product From Database !!!');
    });
};

model.insertReview = function (req, res) {};

model.updateReviewHelpful = function (req, res) {};

model.updateReviewReported = function (req, res) {};

module.exports = model;

model.queryProductMetadata(1);
