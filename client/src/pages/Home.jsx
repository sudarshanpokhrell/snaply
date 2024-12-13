import React, { useEffect, useState } from "react";
import useFetchPosts from "../hooks/useFetchPosts";
import { Box, Spinner, Container, Stack } from "@chakra-ui/react";
import PostCard from "../components/PostCard/PostCard";
import PostSkeleton from "../components/PostCard/PostSkeleton";

function Home() {
  const { posts, loading, fetchPosts } = useFetchPosts();
  const [allPosts, setAllPosts] = useState(posts);

  //TODO:: OPTIMIZE THIS

  useEffect(() => {
    fetchPosts("http://localhost:8000/api/v1/posts");
  }, []);

  useEffect(() => {
    setAllPosts(posts);
  }, [posts]);

  const handlePostDelete = (postId, isDeleted = true) => {
    if (isDeleted) {
      setAllPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId)
      );
    } else {
      fetchPosts("http://localhost:8000/api/v1/posts");
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
                authorId={post.authorDetails._id}
              />
            ))
          )}
        </Stack>
      </Container>
    </Box>
  );
}

export default Home;
