import React from "react";
import { useParams } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import { Box, Divider } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import UserPosts from "../components/UserPosts";
function User() {
  const { userId } = useParams();

  return (
    <Box>
      <UserProfile userId={userId} />
      <Divider />
      <UserPosts userId={userId} />
    </Box>
  );
}

export default User;
