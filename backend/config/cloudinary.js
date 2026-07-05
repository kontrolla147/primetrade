const cloudinary = require("cloudinary").v2;

const { Readable } = require("stream");

/*==========================================================
CONFIGURE CLOUDINARY
==========================================================*/

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

  api_key: process.env.CLOUDINARY_API_KEY,

  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloud:", process.env.CLOUDINARY_CLOUD_NAME);

console.log("Key:", process.env.CLOUDINARY_API_KEY);

console.log("Secret Length:", process.env.CLOUDINARY_API_SECRET?.length);
/*==========================================================
UPLOAD BUFFER
==========================================================*/

const uploadBuffer = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
      },

      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

module.exports = {
  cloudinary,

  uploadBuffer,
};
