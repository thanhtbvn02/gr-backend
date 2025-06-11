const { v2: cloudinary } = require("cloudinary");
const envConfig = require("../config/envconfig");

// Configuration
cloudinary.config({
  cloud_name: envConfig.cloudinaryCloudName,
  api_key: envConfig.cloudinaryApiKey,
  api_secret: envConfig.cloudinaryApiSecret,
  secure: true,
});

const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "users",
      use_filename: true,
      unique_filename: true,
    });
    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error("Lỗi khi upload ảnh lên Cloudinary:", error);
    throw new Error("Không thể upload ảnh");
  }
};

const deleteImage = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    console.error("Lỗi khi xóa ảnh từ Cloudinary:", error);
    throw new Error("Không thể xóa ảnh");
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};
