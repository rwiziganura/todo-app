import express from 'express';
import { createtodo, deletetodo, gettodo, updatetodo } from '../controller/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware); // Protect all todo routes

router.get('/todos', gettodo);
router.post('/todos', createtodo);
router.delete('/todos/:id', deletetodo);
router.put('/todos/:id', updatetodo);

export default router;