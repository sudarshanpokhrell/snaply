import React, { useEffect, useState } from "react";
import useFetchPosts from "../hooks/useFetchPosts";
import { Box, Container, Stack } from "@chakra-ui/react";
import PostSkeleton from "./PostCard/PostSkeleton";
import PostCard from "./PostCard/PostCard";

function UserPosts({ userId }) {
  const { posts, loading, fetchPosts } = useFetchPosts();
  const [allPosts, setAllPosts] = useState(posts);

  useEffect(() => {
    fetchPosts(`http://localhost:8000/api/v1/posts/user/${userId}`);
  }, [userId]);

  useEffect(() => {
    setAllPosts(posts);
  }, [posts]);

  const handlePostDelete = (postId, isDeleted = true) => {
    if (isDeleted) {
      setAllPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId)
      );
    } else {
      fetchPosts(`http://localhost:8000/api/v1/posts/user/${userId}`);
    }
  };

  

  return (
    <Box p={4} minH="100vh" overflowX="hidden" bg="gray.100">
      <Container minW="600px" p={0}>
        <Stack spacing={6} width={"full"}>
          {loading ? (
            <PostSkeleton />
          ) : (
            allPosts.map((post) => (
              <PostCard
                post={post}
                onDelete={handlePostDelete}
                key={post._id}
                authorId={userId}
              />
            ))
          )}
        </Stack>
      </Container>
    </Box>
  );
}

export default UserPosts;
