import express from 'express';
import TrelloSVC from '../services/trello';

const router = express.Router();

router.get('/', TrelloSVC.indexConnector);

export default router;
