import { Box, Container, Center } from "@chakra-ui/react";
import React, { useEffect } from "react";
import usePost from "../hooks/usePost";
import { useParams } from "react-router-dom";
import SinglePost from "../components/SinglePost";
import PostSkeleton from "../components/PostCard/PostSkeleton";
function Post() {
  const { postId } = useParams();
  const { post, loading, error, fetchPost } = usePost(postId);

  useEffect(() => {
    // Ensure fetching post data when postId changes
    fetchPost(postId);
  }, [postId, fetchPost]);

  if (loading) {
    return (
      <Center h="100vh">
        <PostSkeleton />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <Box>Error: {error.message}</Box>
      </Center>
    );
  }

  return (
    <Container maxW="lg" py={8}>
      
      <SinglePost post={post} />
      {/* Hello */}
    </Container>
  );
}

export default Post;
