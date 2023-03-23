const jwt = require('jsonwebtoken');
const config = require('../config');''

function verifyToken (req,res, next) {
    const token = req.headers['auth'];
    if (!token) {
       return res.sendStatus(403);
    }
    const decoded = jwt.verify(token, config.secret);
    req.userId = decoded.id;
    console.log(req.userId)
    next()
}

/*function verifyToken(req, res, next) {
    // Obtener el token de acceso de la solicitud
    const token = req.headers['authorize'];
  
    // Si no se proporciona el token de acceso, enviar un mensaje de error al usuario
    if (!token) {
      return res.status(401).send({"type":"auth_error","message":"missing token"});
    }
  
    // Verificar el token de acceso
    try {
      const decoded = jwt.verify(token, config.secret);
      req.user = decoded;
      next();
    } catch (err) {
      // Si hay un error al verificar el token, enviar un mensaje de error al usuario
      return res.status(401).send({"type":"auth_error","message":"invalid token"});
    }
  }*/
  
  function authorize(roles = []) {
    if (typeof roles === 'string') {
      roles = [roles];
    }
  
    return (req, res, next) => {
      if (req.userId.role || !roles.includes(req.userId.role)) {
        return res.json({ message: 'Prohibido.' });
      }
      next();
    }
}


module.exports = {verifyToken, authorize};
