import errorMiddleware from './middlewares/errorMiddleware';
import trelloRouter from './routes/trello';

export const configureAPI = (app) => {
  // Open / Public endpoints
  app.use('/trello', trelloRouter);

  // Running message
  app.get('/', (req, res) => {
    res.json({ message: 'Up and running' });
  });

  app.use(errorMiddleware);
};
