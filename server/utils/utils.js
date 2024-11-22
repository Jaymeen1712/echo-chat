const handleGetResponse = ({ isError = false, message, data }) => {
  return isError
    ? {
        message,
        isError: true,
      }
    : {
        data,
        message,
        isError: false,
      };
};

module.exports = {
  handleGetResponse,
};
