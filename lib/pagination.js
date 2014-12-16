var mongoose = require('mongoose');

mongoose.Query.prototype.paginate = function paginate (page, limit, cb) {
  page = parseInt(page, 10);
  page = page === 0 ? 0 : page || 1;
  limit = parseInt(limit, 10) || 10;

  var query = this;
  var model = this.model;
  var skipFrom = (page * limit) - limit;

  query = query.skip(skipFrom).limit(limit);

  if(cb) {
    if (page) {
      console.log('onlycount');
      model.count(query._conditions, function(err, total) {
        if(err) {
          cb(err, null, null);
        } else {
          cb(null, {}, total);
        }
      });
    } else {
      query.exec(function(err, docs) {
        if(err) {
          cb(err, null, null);
        } else {
          model.count(query._conditions, function(err, total) {
            if(err) {
              cb(err, null, null);
            } else {
              cb(null, docs, total);
            }
          });
        }
      });
    }
  } else {
    return this;
  }
};
