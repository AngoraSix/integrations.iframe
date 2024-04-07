import Logger from './logger';

const errorResponse = (err = {}, req = {}, res = null) => {
  const {
    message = 'Something went wrong',
    name = 'API_ERROR',
    response: { data, status: responseStatus } = {},
  } = err;

  const status = err.status || responseStatus || 500;

  Logger.error(`[${name}] ${message} - ${req.originalUrl} [${status}]`);
  if (data) {
    Logger.object(data);
    Logger.error('*******');
  }

  if (res) {
    const errorResponse = { message, name };

    if (data) {
      errorResponse.data = data;
    }

    res.status(status).json(errorResponse);
  }
};

export default errorResponse;
