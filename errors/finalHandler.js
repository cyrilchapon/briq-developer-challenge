module.exports = function(err, req, res, next) {
  let status = err.status || 500;

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.status = req.app.get('env') === 'development' ? status : null;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(status || 500);
  res.render('error');
};
