const connection = require('./database.js');
const model = {};

model.queryProductReviews = function (product_id) {
  return connection
    .query('SELECT r.* FROM product_reviews pr INNER JOIN reviews r ON r.review_id=pr.review_id WHERE product_id=$1', [
      product_id,
    ])
    .then((data) => {
      // console.log(data.rows);
      console.log('*** Successfully Queried Reviews By Product From Database ***');
      ////////Need to handle pagination of response object
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
      console.log('*** Successfully Queried Product Metadata From Database ***');
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
      //Set Individual Characteristic Review Data To Response Object
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
      console.error('!!! Error Querying Product Metadata From Database !!!');
    });
};

model.insertReview = function (product_id, requestBody) {
  let review_id;
  let reviewBody = {
    rating: requestBody.rating,
    summary: requestBody.summary,
    body: requestBody.body,
    recommend: requestBody.recommend,
    reviewer_name: requestBody.reviewer_name,
    reviewer_email: requestBody.reviewer_email,
    date: new Date().toISOString().split('T')[0],
  };
  let photosBody = {};
  for (let i = 0; i < requestBody.photos.length; i++) {
    photosBody[i] = requestBody.photos[i];
  }

  async function tableInserter() {
    // INSERT THE NEW REVIEW
    await connection
      .query(
        'INSERT INTO reviews (rating, summary, body, recommend, reviewer_name, reviewer_email, date) VALUES ($1,$2,$3,$4,$5,$6,$7);',
        [
          reviewBody.rating,
          reviewBody.summary,
          reviewBody.body,
          reviewBody.recommend,
          reviewBody.reviewer_name,
          reviewBody.reviewer_email,
          reviewBody.date,
        ]
      )
      .then((data) => {
        // console.log(data);
        console.log('*** Successfully Inserted New Review Into The Database [Reviews Table] ***');
      })
      .catch((error) => {
        // console.error(error);
        console.error('!!! Error Inserting New Review Into The Database [Reviews Table] !!!');
      });

    // GET BACK THE REVIEW ID
    await connection
      .query('SELECT * FROM reviews ORDER BY review_id DESC LIMIT 1;')
      .then((data2) => {
        // console.log(data2);
        console.log(
          '*** Successfully Queried Newly Inserted Review With review_id From The Database [Reviews Table] ***'
        );
        review_id = data2.rows[0].review_id;
      })
      .catch((error) => {
        // console.error(error);
        console.error('!!! Error Querying Newly Inserted Review With review_id From The Database [Reviews Table] !!!');
      });

    // CONNECT THE NEW REVIEW TO ITS PRODUCT
    connection
      .query('INSERT INTO product_reviews (product_id, review_id) VALUES ($1, $2);', [product_id, review_id])
      .then((data) => {
        console.log('*** Successfully Inserted New review_id:product_id Into The Database [Product_Reviews Table] ***');
        return data;
      })
      .catch((error) => {
        // console.error(error);
        console.error('!!! Error Inserting New review_id:product_id Into The Database [Product_Reviews Table] !!!');
      });

    // INSERT PHOTOS UNDER APPROPRIATE REVIEW ID
    connection
      .query('INSERT INTO photos (review_id, photos) VALUES ($1, $2);', [review_id, photosBody])
      .then((data) => {
        console.log("*** Successfully Inserted New Review's Photos Into The Database [Photos Table] ***");
        return data;
      })
      .catch((error) => {
        // console.error(error);
        console.error("!!! Error Inserting New Review's Photos Into The Database [Photos Table] !!!");
      });

    // UPDATE CHARACTERISTIC REVIEWS WITH NEW VALUES
    for (let key in requestBody.characteristics) {
      connection
        .query(
          `UPDATE characteristic SET value = jsonb_set(value, '{count}', (COALESCE(value->>'count','0')::int + 1)::text::jsonb) \
        WHERE characteristic_id=$1`,
          [key]
        )
        .then((data) => {
          console.log(
            "*** Successfully Updated Characteristic Rating 'count' In The Database [Characteristic Table] ***"
          );
          return data;
        })
        .catch((error) => {
          // console.error(error);
          console.error("!!! Error Inserting New Review's Photos Into The Database [Photos Table] !!!");
        });

      connection
        .query(`UPDATE characteristic SET value = jsonb_set(value, '{total}', $1) WHERE characteristic_id=$2`, [
          requestBody.characteristics[key],
          key,
        ])
        .then((data) => {
          console.log(
            "*** Successfully Updated Characteristic Rating 'total' In The Database [Characteristic Table] ***"
          );
          return data;
        })
        .catch((error) => {
          console.error(error);
          console.error("!!! Error Updating Characteristic Rating 'total' In The Database [Characteristic Table] !!!");
        });
    }

    // UPDATE PRODUCT METADATA RATINGS
    connection
      .query(
        `UPDATE product_metadata SET ratings = jsonb_set(ratings, '{${requestBody.rating}}', (COALESCE(ratings->>'${requestBody.rating}','0')::int + 1)::text::jsonb) WHERE product_id=${product_id}`
      )
      .then((data) => {
        console.log('*** Successfully Updated Product Ratings In The Database [Product_Metadata Table] ***');
        return data;
      })
      .catch((error) => {
        console.error(error);
        console.error('!!! Error Updating Product Ratings In The Database [Product_Metadata Table] !!!');
      });

    // UPDATE PRODUCT METADATA RECOMMENDED
    connection
      .query(
        `UPDATE product_metadata SET recommended = jsonb_set(recommended, '{${requestBody.recommend}}', (COALESCE(recommended->>'${requestBody.recommend}','0')::int + 1)::text::jsonb) WHERE product_id=${product_id}`
      )
      .then((data) => {
        console.log('*** Successfully Updated Number Of Recommendations In The Database [Product_Metadata Table] ***');
        return data;
      })
      .catch((error) => {
        // console.error(error);
        console.error('!!! Error Updating Number Of Recommendations In The Database [Product_Metadata Table] !!!');
      });
  }

  tableInserter();
};

model.updateReviewHelpful = function (review_id) {
  connection
    .query('UPDATE reviews SET helpfulness=helpfulness+1 WHERE review_id=$1', [review_id])
    .then((data) => {
      // console.log(data);
      console.log('*** Successfully Marked The Review Helpful In The Database [Reviews Table] ***');
    })
    .catch((error) => {
      console.error(error);
      console.error('!!! Error Marking The Review Helpful In The Database [Reviews Table] !!!');
    });
};

model.updateReviewReported = function (review_id) {
  connection
    .query('UPDATE reviews SET reported=1 WHERE review_id=$1', [review_id])
    .then((data) => {
      // console.log(data);
      console.log('*** Successfully Reported The Review In The Database [Reviews Table] ***');
    })
    .catch((error) => {
      // console.error(error);
      console.error('!!! Error Reporting The Review In The Database [Reviews Table] !!!');
    });
};

module.exports = model;
