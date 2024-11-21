const handleGetResponse = ({ isError = false, message, data }) => {
  return isError
    ? {
        message,
      }
    : {
        data,
        message,
      };
};

module.exports = {
  handleGetResponse,
};
