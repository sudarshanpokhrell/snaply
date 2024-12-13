import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { FcLike } from "react-icons/fc";

import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

import { MdModeComment } from "react-icons/md";
import { FaBookmark } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import axios from "axios";

function CardFoot({ post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchPostInteractions = async () => {
      try {
        // Check if the post is liked
        const likeResponse = await axios.get(
          `http://localhost:8000/api/v1/posts/${post._id}/like`
        );
        setIsLiked(likeResponse.data.data.liked);

        // Check if the post is bookmarked
        //::TODO
        // const bookmarkResponse = await axios.get(
        //   `http://localhost:8000/api/v1/posts/${post._id}/bookmark`
        // );
        // setIsBookmarked(bookmarkResponse.data.data.bookmarked);
      } catch (error) {
        console.error("Error fetching post interactions:", error);
      }
    };
    fetchPostInteractions();
  }, [post._id]);

  const toggleLike = async (event) => {
    event.stopPropagation();
    try {
      setIsLiked((prev) => !prev);
      const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
      setLikeCount(newLikeCount);

      await axios.post(`http://localhost:8000/api/v1/posts/${post._id}/like`);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };
  //TODO: Implement bookmarking
  const toggleBookmark = async () => {
    try {
      setIsBookmarked((prev) => !prev);
      // await axios.post(
      //   `http://localhost:8000/api/v1/posts/${post._id}/bookmark`
      // );
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  return (
    <HStack justifyContent="space-evenly" w="full" spacing={4} p={1}>
      {/* Like Section */}
      <Flex
        gap={2}
        alignItems="center"
        cursor="pointer"
        _hover={{ color: "blue.500" }}
        onClick={toggleLike}
      >
        {isLiked ? (
          <FaHeart size={"22px"} color="red" />
        ) : (
          <FaRegHeart size={"22px"} />
        )}
        <Text fontSize="sm">{likeCount}</Text>
      </Flex>

      {/* Comment Section */}
      <Flex
        gap={2}
        alignItems="center"
        cursor="pointer"
        _hover={{ color: "blue.500" }}
      >
        <MdModeComment size={"22px"} />
        <Text fontSize="sm">{post.commentCount || 0}</Text>
      </Flex>

      {/* Bookmark Section */}
      <Flex
        gap={2}
        alignItems="center"
        cursor="pointer"
        _hover={{ color: "blue.500" }}
        onClick={toggleBookmark}
      >
        <FaBookmark size={"20px"} color={isBookmarked ? "blue" : "gray"} />
        <Text fontSize="sm">{isBookmarked ? "Saved" : "Save"}</Text>
      </Flex>
    </HStack>
  );
}

export default CardFoot;
