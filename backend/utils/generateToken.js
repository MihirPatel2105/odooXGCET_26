import jwt from "jsonwebtoken";

/**
 * Generate JWT Token
 * @param {String} userId - User ID to encode in token
 * @returns {String} JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "your_jwt_secret_key",
    { expiresIn: "1d" }
  );
};

export default generateToken;
