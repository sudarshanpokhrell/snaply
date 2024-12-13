import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FollowModel } from "./FollowModel";
import { useFetchUser } from "../hooks/useFetchUser";
import { useAuthContext } from "../context/authContext";
import axios from "axios";
import EditProfileModal from "./EditProfileModal";

axios.defaults.withCredentials = true;

const UserProfile = ({ userId }) => {
  const { authUser } = useAuthContext();
  const toast = useToast();
  const [isFollowing, setIsFollowing] = useState(false);

  const { user, loading, fetchUser } = useFetchUser();

  useEffect(() => {
    const fetchIsFollowing = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/users/isFollowing/${userId}`
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
  }, [userId]);

  const followUser = async () => {
    try {
      setIsFollowing(!isFollowing);
      await axios.post(`http://localhost:8000/api/v1/users/follow/${userId}`);
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

  const {
    isOpen: isFollowersOpen,
    onOpen: onFollowersOpen,
    onClose: onFollowersClose,
  } = useDisclosure();
  const {
    isOpen: isFollowingOpen,
    onOpen: onFollowingOpen,
    onClose: onFollowingClose,
  } = useDisclosure();
  const {
    isOpen: isEditProfileOpen,
    onOpen: onEditProfileOpen,
    onClose: onEditProfileClose,
  } = useDisclosure();

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box
      maxW={"container.lg"}
      p={4}
      borderRadius="md"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Avatar
            size="xl"
            name="RONB"
            src={user.user.profilePicture} // Replace with actual image URL
            border="2px solid white"
          />
          <Box ml={4}>
            <VStack gap={0} alignItems={"left"}>
              <Text fontSize="xl" fontWeight="bold">
                {user.user.fullName}
              </Text>
              <Text textAlign={"left"}>{user.user.username}</Text>
            </VStack>
          </Box>
        </Flex>
        <Flex alignItems="center">
          {authUser._id === userId ? (
            <Button variant="outline" colorScheme="blue" size="sm" mr={2} onClick={onEditProfileOpen}>
              Edit Profile
            </Button>
          ) : (
            <Button variant="outline" colorScheme="blue" size="sm" mr={2} onClick={followUser}>
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </Flex>
      </Flex>
      <Flex mt={4} ml={4} gap={4}>
        <Text fontWeight={"500"} onClick={onFollowersOpen} cursor={"pointer"}>
          {user.followersCount} followers
        </Text>
        <Text fontWeight={"500"} onClick={onFollowingOpen} cursor={"pointer"}>
          {user.followingCount} following
        </Text>
      </Flex>
      <Box mt={5} textAlign={"left"}>
        <Text fontSize="lg" fontWeight="600">
          {user.user.fullName}
        </Text>
        <Text
          minW={"80%"}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="pre-wrap"
        >
          {user.user?.bio}
        </Text>
      </Box>
      <FollowModel
        isOpen={isFollowersOpen}
        onClose={onFollowersClose}
        title="Followers"
        type="followers"
        userId={userId}
      />
      <FollowModel
        isOpen={isFollowingOpen}
        onClose={onFollowingClose}
        title="Following"
        type="following"
        userId={userId}
      />
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={onEditProfileClose}
        userId={userId}
      />
    </Box>

  );
};

export default UserProfile;
