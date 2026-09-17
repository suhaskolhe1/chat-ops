import express from 'express';
import { generateToken } from '../controllers/auth.controller.js';
import { getRoomMessages } from '../controllers/message.controller.js';

const router = express.Router();

router.post('/auth', generateToken);
router.get('/rooms/:id/messages', getRoomMessages);

export default router;
