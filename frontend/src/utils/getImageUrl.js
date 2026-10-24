import { backend_url } from "../server";

export const getImageUrl = (image) => {
  if (!image || typeof image !== "string") {
    return "";
  }

  // Cloudinary or other HTTPS image URLs
  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  // Existing local image filenames
  return `${backend_url}${image.replace(/^\/+/, "")}`;
};
