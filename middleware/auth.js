const jwt = require('jsonwebtoken');
const config = require()

function authenticate(req, res, next) {
    // Obtener el token de acceso de la solicitud
    const token = req.headers['x-access-token'] || req.headers['authorization'];
  
    // Si no hay token, continuar sin autenticar al usuario
    if (!token) {
      return next();
    }
  
    // Verificar el token y obtener la información del usuario
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // Si el token es inválido, continuar sin autenticar al usuario
        return next();
      }
  
      // Si el token es válido, agregar la información del usuario a la solicitud
      req.user = decoded;
  
      // Continuar con la siguiente función
      next();
    });
  }


module.exports = authenticate;