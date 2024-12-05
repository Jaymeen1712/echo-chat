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
const clients = {};

module.exports = {
  handleGetResponse,
  clients,
};
