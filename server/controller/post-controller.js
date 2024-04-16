import Post from "../model/post.js";

export const createPost = async (request, response) => {
  try {
    const post = await new Post(request.body);
    await post.save();

    return response.status(200).json("Post saved successfully");
  } catch (error) {
    return response.status(500).json(error);
  }
}; //!Access token from frontend 4 1.10.14

export const getAllPosts = async (request, response) => {
  let category = request.query.category;
  let posts;
  try {
    if (category) {
      posts = await Post.find({ categories: category });
    } else {
      posts = await Post.find({}); //!Sara data ajayega
    }

    return response.status(200).json(posts);
  } catch (error) {
    return response.status(500).json({ msg: error.message });
  }
};

export const getPost = async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);

    return response.status(200).json(post);
  } catch (error) {
    return response.status(500).json({ msg: error.message });
  }
};

export const updatePost = async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);

    if (!post) {
      return response.status(404).json({ msg: "Post not found" });
    }

    await Post.findByIdAndUpdate(request.params.id, { $set: request.body }); //! $set -> replacing object, $addToSet->appending object => Methods

    return response.status(200).json({ msg: "post updated successfully" });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

export const deletePost = async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);

    if (!post) {
      return response.status(404).json({ msg: "Post not found" });
    }

    await post.delete();

    return response.status(200).json({msg:"Post deleted Successfully"})
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};
