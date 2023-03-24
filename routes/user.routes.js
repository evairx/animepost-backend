import express from 'express';
import UserController from '../controller/User.js';

const router = express.Router();
  
router.post('/signup', UserController.addUser);

router.post('/login', UserController.signIn);

router.get('/account', UserController.Account);

router.get('/account/favorites', UserController.favoritesPage);

router.post('/account/favorites/:userId/:animeId', UserController.favorites);






export default router;