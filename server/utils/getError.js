const { handleGetResponse } = require("./utils");

const sendErrors = ({ res, error, duplicationMessage, genericMessageKey }) => {
  console.error("Error occurred:", error);
  if (error.name === "ValidationError") {
    return res.status(400).json(
      handleGetResponse({
        message: "Validation error. Check input data.",
        isError: true,
      })
    );
  }

  // 2. MongoError (e.g., duplicate email error)
  if (error.code === 11000) {
    // 11000 is a MongoDB error code for duplicate key
    return res.status(409).json(
      handleGetResponse({
        message: duplicationMessage,
        isError: true,
      })
    );
  }

  // // 3. Custom business logic errors
  // if (error instanceof CustomError) {
  //   return res.status(error.statusCode).json(
  //     handleGetResponse({
  //       message: error.message,
  //       isError: true,
  //     })
  //   );
  // }

  // 4. Generic server errors
  return res.status(500).json(
    handleGetResponse({
      message: `Could not ${genericMessageKey} due to a server error.`,
      isError: true,
    })
  );
};

module.exports = { sendErrors };
