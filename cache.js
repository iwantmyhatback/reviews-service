const redis = require('redis');
const { promisify } = require('util');
const client = redis.createClient({ host: 'sdc-redis' });

client.on('error', function (error) {
  console.error(error);
});

module.exports.client = client;
module.exports.asyncGet = promisify(client.get).bind(client);
module.exports.asyncSet = promisify(client.set).bind(client);
module.exports.asyncDel = promisify(client.del).bind(client);
