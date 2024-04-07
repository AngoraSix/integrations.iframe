import dotenv from 'dotenv';

// Just check for .env file
dotenv.config();

// Build
const BUILD = process.env.BUILD || 'unknown';

// Server
const PORT = process.env.A6_INTEGRATIONS_IFRAME_SVC_PORT || 80;
const HTTPS_PORT = process.env.A6_INTEGRATIONS_IFRAME_SVC_HTTPS_PORT || 443;

const MORGAN = {
  FORMAT: process.env.A6_INTEGRATIONS_IFRAME_SVC_MORGAN_FORMAT || 'dev',
  STREAM: process.env.A6_INTEGRATIONS_IFRAME_SVC_MORGAN_LEVEL_LOGGING || 'info',
};

export const HTTPS = process.env.A6_INTEGRATIONS_IFRAME_SVC_HTTPS || false;

const CONFIG = {
  BUILD,
  server: {
    PORT,
    HTTPS,
    HTTPS_PORT,
  },
  morgan: MORGAN,
};

const PRIVATE_KEYS = [];

const getPublicConfig = (data = CONFIG) => {
  return Object.keys(data).reduce((prev, currentKey) => {
    if (typeof data[currentKey] === 'function') {
      return prev;
    }

    const isPrivate =
      PRIVATE_KEYS.filter(
        (k) => currentKey.toLowerCase().indexOf(k.toLowerCase()) >= 0
      ).length > 0;

    if (!isPrivate) {
      if (typeof data[currentKey] !== 'object') {
        prev[currentKey] = data[currentKey];
      } else {
        prev[currentKey] = getPublicConfig(data[currentKey]);
      }
    } else {
      prev[currentKey] = '**** S3CR3T ****';
    }

    return prev;
  }, {});
};

CONFIG.getPublicConfig = getPublicConfig;

export default CONFIG;
