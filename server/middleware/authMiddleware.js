const jwt = require("jsonwebtoken");
const { handleGetResponse } = require("../utils/utils");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.auth_token;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(
      handleGetResponse({
        message: "Unauthorized: Token missing",
      })
    );
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;
