//API_NOTIFICATION_MESSAGES


export const API_NOTIFICATION_MESSAGES = {
  loading: {
    //If loader exists
    title: "Loading....",
    message: "Data is being loaded,Please wait",
  },
  success: {
    title: "success",
    message: "Data successfully loaded",
  },
  responseFailure: {
    title: "Error",
    message:
      "An error occurred while fetching response from the server. Please try again",
  },
  requestFailure: {
    title: "Error",
    message: "An error occurred while parsing request data",
  },
  networkError: {
    title: "Error",
    message:
      "Unable to connect with the server.Please check internet connectivity and try again later",
  },
};

// API Service Call
//Sample request
//Need Service Call : {url:'/',method:'POST/GET/PUT/DELETE',params:true/false,query;true/false}
export const SERVICE_URLS = {
  userSignup: { url: "/signup", method: "POST" },
  userLogin: { url: "/login", method: "POST" },
  forgotPassword: { url: "/forgotPassword", method: "GET" },
  uploadFile: { url: "/file/upload", method: "POST" },
  resetPassword: { url: "/resetPassword", method: "PUT" },
  createPost: { url: "/create", method: "POST" }, //!
  getAllPosts: { url: "/posts", method: "GET", params: true },
  getPostById: { url: "/post", method: "GET", query: true }, //!Why query is used?
  updatePost: { url: "/update", method: "PUT", query: true },
  deletePost: { url: "/delete", method: "DELETE", query: true },
  newComment: { url: "/comment/new", method: "POST" },
  getAllComments: { url: "/comments", method: "GET", query: true },
  deleteComment: { url: "/comment/delete", method: "DELETE", query: true },
};
