import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (
    filePath,
    folder = "HRMS",
    resourceType = "image"
) => {
    const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: resourceType
    });

    return {
        url: result.secure_url,
        publicId: result.public_id
    };
};
