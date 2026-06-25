const sendSuccess = (res, statusCode, message, data = null) => {
  const response = { status: 'success', message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({ status: 'fail', message });
};

module.exports = { sendSuccess, sendError };