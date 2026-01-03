/**
 * Email validation using regex
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Strong password validation
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)
 * @param {string} password 
 * @returns {object} { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
  if (!password) {
    return {
      isValid: false,
      message: "Password is required"
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long"
    };
  }

  if (password.length > 128) {
    return {
      isValid: false,
      message: "Password must not exceed 128 characters"
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter"
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter"
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number"
    };
  }

  if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)"
    };
  }

  // Check for common weak passwords
  const weakPasswords = [
    'password', 'password123', '12345678', 'qwerty123', 
    'admin123', 'welcome123', 'letmein123'
  ];
  
  if (weakPasswords.includes(password.toLowerCase())) {
    return {
      isValid: false,
      message: "Password is too common. Please choose a stronger password"
    };
  }

  return {
    isValid: true,
    message: "Password is strong"
  };
};

/**
 * Email validation with detailed error message
 * @param {string} email 
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateEmail = (email) => {
  if (!email) {
    return {
      isValid: false,
      message: "Email is required"
    };
  }

  if (typeof email !== 'string') {
    return {
      isValid: false,
      message: "Email must be a string"
    };
  }

  const trimmedEmail = email.trim();

  if (trimmedEmail.length === 0) {
    return {
      isValid: false,
      message: "Email cannot be empty"
    };
  }

  if (trimmedEmail.length > 254) {
    return {
      isValid: false,
      message: "Email is too long (maximum 254 characters)"
    };
  }

  if (!isValidEmail(trimmedEmail)) {
    return {
      isValid: false,
      message: "Invalid email format. Please provide a valid email address"
    };
  }

  // Check for multiple @ symbols
  if ((trimmedEmail.match(/@/g) || []).length > 1) {
    return {
      isValid: false,
      message: "Email cannot contain multiple @ symbols"
    };
  }

  // Check if domain part exists
  const parts = trimmedEmail.split('@');
  if (parts.length !== 2) {
    return {
      isValid: false,
      message: "Invalid email format"
    };
  }

  const [localPart, domainPart] = parts;

  if (localPart.length === 0) {
    return {
      isValid: false,
      message: "Email must have a username before @"
    };
  }

  if (domainPart.length === 0) {
    return {
      isValid: false,
      message: "Email must have a domain after @"
    };
  }

  if (!domainPart.includes('.')) {
    return {
      isValid: false,
      message: "Email domain must contain a period (.)"
    };
  }

  return {
    isValid: true,
    message: "Email is valid"
  };
};
