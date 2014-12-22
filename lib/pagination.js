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
    count(query._conditions, function(err, total) {
      if (page !== 0 || total === 0) {
        query.exec(function(err, docs) {
          if (err) {
            cb(err, null, null);
          }
          cb(err, docs, total);
        });
      } else {
        cb(err, [], total);
      }
    });
  } else {
    return this;
  }
};

var count = function (conditions, cb) {
  model.count(conditions, function(err, total) {
    if(err) {
      cb(err, null, null);
    } else {
      cb(null, total);
    }
  });
};
