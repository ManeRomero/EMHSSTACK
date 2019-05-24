const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Lo sentimos, no estás autorizado en el sistema.');
  res.redirect('/');
};

helpers.randomHash = () => {
  const aceptado = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-'
  var resultado = ''

  for (var i = 0; i < 9; i++) {
    resultado += aceptado.charAt(Math.floor(Math.random() * aceptado.length));
  }
  console.log('EL HASH RESULTADO ES: ', resultado)
  return resultado
}
module.exports = helpers;