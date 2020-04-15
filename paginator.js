let paginator = function (array, count = 5, page = 1) {
  let start = (page - 1) * count;
  let end = page * count;
  let paginated = array.slice(start, end);
  return paginated;
};

module.exports = paginator;
