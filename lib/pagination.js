var mongoose = require('mongoose');

mongoose.Query.prototype.paginate = function paginate (page, limit, cb) {
  limit = parseInt(limit, 10);
  page = parseInt(page, 10) || 1;
  limit = limit === 0 ? 0 : limit || 10;

  var query = this;
  var model = this.model;
  var skipFrom = (page * limit) - limit;

  query = query.skip(skipFrom).limit(limit);

  if(cb) {
    if (page === 0) {
      count(query._conditions, [], cb);
    } else {
      query.exec(function(err, docs) {
        if(err) {
          cb(err, null, null);
        } else {
          count(query._conditions, docs, cb);
        }
      });
    }
  } else {
    return this;
  }
};

var count = function (conditions, documentsFetched, cb) {
  model.count(conditions, function(err, total) {
    if(err) {
      cb(err, null, null);
    } else {
      cb(null, documentsFetched, total);
    }
  });
};
