const cloudinary = require("../config/cloudinary");
const FileType = require("file-type");

const uploadToCloudinary = async (file, folder = "ecommerce/products") => {
  if (!file?.buffer) {
    throw new Error("No image file provided");
  }

  // Detect the actual file type from its contents
  const detected = await FileType.fromBuffer(file.buffer);

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!detected || !allowedTypes.includes(detected.mime)) {
    throw new Error("Invalid image. Only JPEG, PNG and WebP are allowed");
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    stream.end(file.buffer);
  });
};

const deleteFromCloudinary = async (imageUrl) => {
  if (!imageUrl?.startsWith("https://res.cloudinary.com/")) {
    return; // Ignore old local image filenames
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const prefix = `https://res.cloudinary.com/${cloudName}/image/upload/`;

  if (!imageUrl.startsWith(prefix)) {
    throw new Error("Image does not belong to this Cloudinary account");
  }

  const imagePath = imageUrl.slice(prefix.length);
  const withoutVersion = imagePath.replace(/^v\d+\//, "");
  const publicId = decodeURIComponent(
    withoutVersion.replace(/\.[^.]+$/, "")
  );

  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
