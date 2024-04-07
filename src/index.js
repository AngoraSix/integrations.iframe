import '@babel/polyfill';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import https from 'https';
import morgan from 'morgan';
import pem from 'pem';
import { configureAPI } from './api';
import config from './config';
import Logger from './utils/logger';

const serverConfig = config.server;

const morganOptions = {};

if (config.morgan.STREAM) {
  const accessLogStream = fs.createWriteStream('./access.log', { flags: 'a' });
  morganOptions.stream = accessLogStream;
}

const morganInstance = morgan(config.morgan.FORMAT, morganOptions);

const app = express();

app.use(morganInstance);

app.use(cors({ origin: 'https://trello.com' }));

app.use('/static', express.static('static'));

// Configure API endpoints
configureAPI(app);

const startServer = async(app, httpsServer = false) => {
  let server = app;
  if (httpsServer) {
    Logger.data('*** HTTPS Enabled ***');
    try {
      Logger.data('Creating Self Signed Certificate');
      server = await new Promise((resolve, reject) => {
        pem.createCertificate(
          { days: 365, selfSigned: true },
          function (err, keys) {
            if (err) {
              reject(err);
            }
            server = https.createServer(
              { key: keys.serviceKey, cert: keys.certificate },
              app
            );
            resolve(server);
          }
        );
      });
      Logger.data('Self Signed Certificate Created');
    } catch (e) {
      Logger.error('Could not create HTTPS Server:', e);
    }
    Logger.data('******* HTTPS ********');
  }

  const PORT = httpsServer ? serverConfig.HTTPS_PORT : serverConfig.PORT;

  server.listen(PORT, () => {
    Logger.success(`DEPLOYING BUILD[${config.BUILD}]`);
    Logger.success(`Connected to ${PORT}`);
    Logger.success('***************************************');
    Logger.success('Config for API Svc:');
    Logger.deepObject(config.getPublicConfig());
    Logger.success('***************************************');
  });
};

startServer(app, serverConfig.HTTPS);
if (serverConfig.HTTPS) {
  startServer(app, false);
}
