import express from 'express';
import protectRoute from '../middleware/protect-route.js';
import { getUsers, getMessages, sendMessage } from '../controllers/message-controller.js';

const router = express.Router();

router.use(protectRoute);
router.get('/users', getUsers);
router.get('/:id', getMessages);
router.post('/:id', sendMessage);

export default router;