/**
 * Generate unique Login ID based on company, employee name, year, and serial number
 * Format: OIJODO20220001
 * OI → Company initials
 * JODO → First 2 letters of first name + first 2 letters of last name
 * 2022 → Year of joining
 * 0001 → Serial number
 */
export const generateLoginId = async (fullName, dateOfJoining, companyCode = "OI") => {
  try {
    // Extract first and last name
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts[nameParts.length - 1] || "";

    // Get first 2 letters of each name (uppercase)
    const firstNamePart = firstName.substring(0, 2).toUpperCase();
    const lastNamePart = lastName.substring(0, 2).toUpperCase();

    // Get year from date of joining
    const joiningDate = new Date(dateOfJoining);
    const year = joiningDate.getFullYear();

    // Get company code (default to OI for Odoo India)
    const companyInitials = companyCode.substring(0, 2).toUpperCase();

    // Generate serial number by counting existing employees for that year
    const User = (await import("../models/User.js")).default;
    
    // Find all users with login IDs for this year
    const yearPrefix = `${companyInitials}${firstNamePart}${lastNamePart}${year}`;
    const existingUsers = await User.find({
      loginId: { $regex: `^${companyInitials}.*${year}` }
    }).sort({ loginId: -1 });

    // Calculate serial number
    let serialNumber = 1;
    if (existingUsers.length > 0) {
      // Extract the last serial number and increment
      const lastLoginId = existingUsers[0].loginId;
      const lastSerial = lastLoginId.slice(-4);
      serialNumber = parseInt(lastSerial) + 1;
    }

    // Format serial number with leading zeros (4 digits)
    const serialPart = serialNumber.toString().padStart(4, "0");

    // Construct final login ID
    const loginId = `${companyInitials}${firstNamePart}${lastNamePart}${year}${serialPart}`;

    return loginId;
  } catch (error) {
    console.error("Error generating login ID:", error);
    throw error;
  }
};

/**
 * Generate a random secure password
 * Format: Capital letter + lowercase + numbers + special char
 * Example: Temp@2026
 */
export const generatePassword = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000);
  const password = `Temp@${year}${randomNum}`;
  return password;
};
