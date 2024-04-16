import { useState, useEffect } from "react";
import { API } from "../../../service/api";

import { Box, Grid } from "@mui/material";

import { useSearchParams, Link } from "react-router-dom";
//Components

import Post from "./Post";
const Posts = () => {
  const [posts, setPosts] = useState([]);

  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");

  useEffect(() => {
    const fetchData = async () => {
      let response = await API.getAllPosts({ category: category || "" })
        .then((response) => {
          if (response.isSuccess) {
            setPosts(response.data);
          }
        })
        .catch((error) => {
          console.log("Error in Posts.jsx" + error);
        });
    };

    fetchData();
  }, [category]);

  return (
    <>
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <Grid item lg={3} sm={4} xs={12} key={post._id}>
            <Link to={`/details/${post._id}`} style={{textDecoration:'none',color:'inherit'}}>
              <Post post={post} />
            </Link>
          </Grid>
        ))
      ) : (
        <Box style={{ color: "#878787", margin: "30px 80px", fontSize: 18 }}>
          No data available to display
        </Box>
      )}
    </>
  );
};

export default Posts;
