import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Box, Flex } from "@chakra-ui/react";

function RootLayout() {
  return (
    <Flex h="100vh" w="90vw" bg="gray.100" overflowX="hidden" > 
      <Box w="250px" borderRight="1px solid" borderColor="gray.200" p={4}>
        <Sidebar />
      </Box>
      <Box flexGrow={1} p={4} overflowX="hidden" > {/* Prevent horizontal scrolling */}
        <Outlet />
      </Box>
    </Flex>
  );
}

export default RootLayout;
