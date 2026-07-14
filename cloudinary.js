const CLOUDINARY = {
  cloudName: "dsec6tlnk",

  image(publicId) {
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/f_auto,q_auto/${publicId}`;
  },
};
