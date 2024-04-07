import errorResponse from '../utils/errorResponse';

const errorMiddleware = (err, req, res, next) => {
  errorResponse(err, req, res);
};

export default errorMiddleware;
