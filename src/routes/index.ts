import express from 'express';
import getNotes from '../controllers/getNotes';
import { query, validationResult, body } from 'express-validator';
import getHoraires from '../controllers/getHoraires';
import getUserInfos from '../controllers/getUserInfos';
import login from '../controllers/login';
import getPublicKey from '../controllers/getPublicKey';
import encryptData from '../controllers/encryptData';
import decrypt from '../middlewares/decrypt';
import getMenus from '../controllers/getMenus';
import Gaps from '../utils/gaps';

const router = express.Router();

router.post(
  '/notes',
  body('username').isLength({ min: 3 }),
  body('password').isLength({ min: 4 }),
  body('gapsId').exists(),
  body('year').isLength({ min: 4, max: 4 }),
  decrypt,
  getNotes,
);

router.post(
  '/horaires',
  body('username').isLength({ min: 3 }),
  body('password').isLength({ min: 4 }),
  body('gapsId').isLength({ min: 1 }),
  decrypt,
  getHoraires,
);

router.post(
  '/login',
  body('username').isLength({ min: 3 }),
  body('password').isLength({ min: 4 }),
  decrypt,
  login,
);

router.post(
  '/user',
  body('username').isLength({ min: 3 }),
  body('password').isLength({ min: 4 }),
  body('gapsId').isLength({ min: 1 }),
  decrypt,
  getUserInfos,
);

router.get('/menus', getMenus);

router.get('/free-rooms', async (req, res) => {
  let json = await Gaps.get_free_rooms();
  //console.log(json);
  res.json(json);
});

router.get('/public_key', getPublicKey);
router.get('/encryptdata', encryptData); // pour tester seulement

export default router;
