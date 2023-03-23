import express from 'express';
import UserController from '../controller/User.js';

const router = express.Router();

const requireLogin = (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Debe iniciar sesión para acceder a esta ruta" });
    }
    next();
  }
  
router.post('/singup', UserController.addUser);
router.post('/login', UserController.signIn);
router.get('/logout', UserController.logout);
router.get('/account', UserController.Account);
router.get('/account/queque', UserController.Queque);





export default router;