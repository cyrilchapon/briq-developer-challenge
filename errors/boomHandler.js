module.exports = function(err, req, res, next) {
  if (!err.isBoom) {
    return next(err);
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.status = req.app.get('env') === 'development' ? err.output.statusCode : null;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.output.statusCode);
  return res.render('error');
};
