import bcrypt from "bcryptjs";

/**
 * Hash password using bcrypt
 * @param {String} password - Plain text password
 * @returns {String} Hashed password
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare password with hashed password
 * @param {String} enteredPassword - Plain text password
 * @param {String} hashedPassword - Hashed password from database
 * @returns {Boolean} Match result
 */
export const comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};
