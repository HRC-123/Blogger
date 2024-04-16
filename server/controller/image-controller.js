import grid from "gridfs-stream"; //Used for streaming files from mongodb
import mongoose from "mongoose";

const url = "http://localhost:8000";

let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "photos",
  }); //!Here
  gfs = grid(conn.db, mongoose.mongo);
  gfs.collection("photos");
});

export const uploadImage = async (request, response) => {
  try {
    // Wait for the promise to resolve
    const file = await request.file;
    // response.json({ file: file });
    console.log(file);
  } catch (error) {
    // Handle any errors
    console.log(error);
    console.error(error);
  }

  if (!request.file) {
    return response.status(404).json("File not found");
  }

  const imageUrl = `${url}/file/${request.file.filename}`;

  return response.status(200).json(imageUrl);
};

export const getImage = async (request, response) => {
  try {
    const file = await gfs.files.findOne({ filename: request.params.filename });
    const readStream = gridfsBucket.openDownloadStream(file._id);
    readStream.pipe(response);//To convert into readable format
  } catch (error) {
    return response.status(500).json({msg:error.msg});
  }
};
