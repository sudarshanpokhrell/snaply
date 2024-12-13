import {
    Avatar,
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Flex,
    Image,
    SimpleGrid,
    Text,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
  } from "@chakra-ui/react";
  import React, { useEffect, useState, useRef } from "react";
  import axios from "axios";
  import CardFoot from "./PostCard/CardFoot";
  import { useAuthContext } from "./../context/authContext";
  import { useNavigate } from "react-router-dom";
  axios.defaults.withCredentials = true;
  
  function SinglePost({ post }) {
    console.log(post)

    const { authUser } = useAuthContext();
    const toast = useToast();
    const [isFollowing, setIsFollowing] = useState(false);
    const navigate = useNavigate();

    //Delete Post
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
  
    const handleDelete = () => {
      onClose();
      deletePost();
    };
    useEffect(() => {
      const fetchIsFollowing = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/v1/users/isFollowing/${post.authorDetails._id}`
          );
          setIsFollowing(response.data.data);
        } catch (error) {
          toast({
            title: "An error occurred.",
            description: error.response
              ? error.response.data.message
              : error.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      };
      fetchIsFollowing();
    }, [post.authorDetails._id]);
  
    const followUser = async () => {
      try {
        setIsFollowing(!isFollowing);
        await axios.post(`http://localhost:8000/api/v1/users/follow/${post.authorDetails._id}`);
      } catch (error) {
        toast({
          title: "Error following user",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
  
    const deletePost = async () => {
      try {
        const response = await axios.delete(
          `http://localhost:8000/api/v1/posts/delete/${post._id}`
        );
  
        if (response.status === 200) {
          toast({
            title: "Post deleted successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
        navigate("/");
      } catch (error) {
        toast({
          title: "Error deleting post",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
  
      }
    };

  
    return (
      <Card
        borderColor="gray.200"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="sm"
        overflow="hidden"
        width="full"
        bg="white"
        _hover={{ boxShadow: "md" }}
      >
        {/* Header */}
        <CardHeader p={4}>
          <Flex align="center">
            <Avatar size="sm" src={post.authorDetails.profilePicture} />
            <Box
              cursor={"pointer"}
              ml={3}
              onClick={() => navigate(`/u/${post.authorDetails._id}`)}
            >
              <Text fontWeight="bold" fontSize="md">
                {post.authorDetails.fullName}
              </Text>
              <Text fontSize="sm" color="gray.500">
                @{post.authorDetails.username}
              </Text>
            </Box>
            {post.authorDetails._id === authUser._id && (
              <>
                <Button
                  ml="auto"
                  variant="outline"
                  size="sm"
                  colorScheme="red"
                  borderRadius="full"
                  onClick={onOpen}
                >
                  Delete
                </Button>
                <AlertDialog
                  isOpen={isOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={onClose}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Delete Post
                      </AlertDialogHeader>
  
                      <AlertDialogBody>
                        Are you sure you want to delete this post? You can't undo
                        this action afterwards.
                      </AlertDialogBody>
  
                      <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                          Cancel
                        </Button>
                        <Button colorScheme="red" onClick={handleDelete} ml={3}>
                          Delete
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </>
            )}
  
            {post.authorDetails._id !== authUser._id && (
              <Button
                ml="auto"
                variant="outline"
                size="sm"
                colorScheme="blue"
                borderRadius="full"
                onClick={followUser}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </Flex>
        </CardHeader>
  
        {/* Body */}
        <CardBody p={0} >
          {post.pictures && post.pictures.length > 0 ? (
            post.pictures.length === 1 ? (
              <Image
                src={post.pictures[0]}
                alt="Post"
                objectFit="cover"
                width="100%"
                maxHeight="300px"
              />
            ) : (
              <>
                <SimpleGrid px={2} columns={{ base: 1, md: 2 }} spacing={2}>
                  {post.pictures.map((picture, index) => (
                    <Image
                      key={index}
                      src={picture}
                      alt={`Post image ${index + 1}`}
                      objectFit="cover"
                      width="100%"
                      height="250px"
                      borderRadius="md"
                    />
                  ))}
                </SimpleGrid>
              </>
            )
          ) : (
            <Box p={4}>
              <Text fontSize="md" color="gray.700" textAlign={"left"}>
                {post.content}
              </Text>
            </Box>
          )}
        </CardBody>
  
        {/* Divider */}
        <Divider />
  
        {/* Footer */}
        <CardFooter p={2}>
          <CardFoot post={post} />
        </CardFooter>
      </Card>
    );
  }
  
  export default SinglePost;
  