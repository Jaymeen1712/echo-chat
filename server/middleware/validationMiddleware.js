const { body, param, query, validationResult } = require("express-validator");
const { handleGetResponse } = require("../utils/utils");

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      handleGetResponse({
        message: "Validation failed",
        data: errors.array(),
        isError: true,
      })
    );
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),
  
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  
  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  
  handleValidationErrors
];

// Message creation validation
const validateMessageCreation = [
  body("senderId")
    .isMongoId()
    .withMessage("Invalid sender ID"),
  
  body("conversationId")
    .isMongoId()
    .withMessage("Invalid conversation ID"),
  
  body("content")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Message content cannot exceed 5000 characters"),
  
  body("files")
    .optional()
    .isArray({ max: 10 })
    .withMessage("Maximum 10 files allowed per message"),
  
  body("files.*.name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("File name must be between 1 and 255 characters"),
  
  body("files.*.type")
    .optional()
    .matches(/^(image|video|audio|application)\/.+/)
    .withMessage("Invalid file type"),
  
  body("files.*.size")
    .optional()
    .isInt({ min: 1, max: 50 * 1024 * 1024 }) // 50MB max
    .withMessage("File size must be between 1 byte and 50MB"),
  
  handleValidationErrors
];

// Conversation creation validation
const validateConversationCreation = [
  body("participantId")
    .isMongoId()
    .withMessage("Invalid participant ID"),
  
  handleValidationErrors
];

// User search validation
const validateUserSearch = [
  body("query")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search query must be between 1 and 100 characters")
    .escape(), // Prevent XSS
  
  handleValidationErrors
];

// MongoDB ObjectId validation
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName}`),
  
  handleValidationErrors
];

// User update validation
const validateUserUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),
  
  body("image")
    .optional()
    .isURL()
    .withMessage("Image must be a valid URL"),
  
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateMessageCreation,
  validateConversationCreation,
  validateUserSearch,
  validateObjectId,
  validateUserUpdate,
  handleValidationErrors
};
