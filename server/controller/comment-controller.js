import Comment from "../model/comment.js";

export const newComment = async (request, response) => {
  try {
    const comment = await new Comment(request.body);
    await comment.save();

    response.status(200).json({ msg: "Comment saved successfully" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

export const getComments = async (request, response) => {
  try {
    console.log("HEHEHEHE");
    const comments = await Comment.find({ postId: request.params.id })
      .then((comments) => {
        console.log("No error in fetching comments");
         response.status(200).json(comments);
      })
      .catch((error) => {
        console.log("Shit myann" + error);
      });
  } catch (error) {
    response.status(500).json({ msg: "Error in fetching comments" });
  }
};

export const deleteComment = async (request, response) => {
  try {
    const comment = await Comment.findById(request.params.id);
    await comment.delete();

    response.status(200).json({ msg: "comment deleted successfully" });
  } catch (error) {
     response.status(500).json({ error: error.message });
  }
};
