import path from 'path';
import errorMiddleware from './middlewares/errorMiddleware';
import trelloRouter from './routes/trello';

export const configureAPI = (app) => {
  // Open / Public endpoints
  app.use('/trello', trelloRouter);

  // Open / Public endpoints
  app.get('/favicon.ico', (req, res) => {
    const filePath = './static/images/favicon.ico';
    const resolvedPath = path.resolve(filePath);
    return res.sendFile(resolvedPath);
  });

  // Running message
  app.get('/', (req, res) => {
    res.json({ message: 'Up and running' });
  });

  app.use(errorMiddleware);
};
