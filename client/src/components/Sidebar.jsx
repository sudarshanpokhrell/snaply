import React, { useState } from "react";
import {
  List,
  ListItem,
  Box,
  VStack,
  Text,
  Heading,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaSortDown } from "react-icons/fa";
import { useAuthContext } from "../context/authContext";
const Sidebar = () => {
  const { authUser } = useAuthContext();

  const [activeItem, setActiveItem] = useState("/");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    {
      icon: (isActive) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isActive ? "#3182ce" : "currentColor"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      label: "Home",
      path: "/",
    },
    {
      icon: (isActive) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isActive ? "#3182ce" : "currentColor"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      label: "Search",
      path: "/search",
    },
    {
      icon: (isActive) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isActive ? "#3182ce" : "currentColor"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      label: "Notifications",
      path: "/notifications",
    },
    {
      icon: (isActive) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isActive ? "#3182ce" : "currentColor"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
      label: "Create",
      path: "/create",
    },
    {
      icon: (isActive) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isActive ? "#3182ce" : "currentColor"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      label: "Profile",
      path: `/u/${authUser._id}`,
    },
    {
      icon: (isActive) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isActive ? "#3182ce" : "currentColor"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      label: "More",
      path: "/settings",
    },
  ];

  return (
    <Box
      width="250px"
      height="100vh"
      bg="white"
      boxShadow="md"
      position="fixed"
      left={0}
      top={0}
      display="flex"
      flexDirection="column"
      py={6}
      borderRight="1px"
      borderColor="gray.100"
    >
      <VStack spacing={4} width="full" align="stretch">
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={2}
          width="full"
          px={4}
          mb={4}
        >
          <Image src="../assets/camera.png" />
          <Heading fontSize="2xl" fontWeight="bold" color="gray.700">
            Snaply
          </Heading>
        </Box>

        <List spacing={4} width="full" px={2}>
          {navItems.map(({ icon: Icon, label, path }) => (
            <ListItem
              key={path}
              display="flex"
              alignItems="center"
              px={4}
              py={2}
              cursor="pointer"
              borderRadius="md"
              color={activeItem === path ? "blue.500" : "gray.500"}
              _hover={{
                bg: "gray.100",
                color: "blue.500",
              }}
              onClick={() => {
                if (label === "More") {
                  setIsMenuOpen(!isMenuOpen);
                } else {
                  setActiveItem(path);
                  navigate(path);
                }
              }}
            >
              <Box mr={4}>{Icon(activeItem === path)}</Box>
              <Text fontWeight="medium">{label}</Text>
              {label === "More" && (
                <Menu isOpen={isMenuOpen}>
                  <MenuButton
                    as={IconButton}
                    icon={<FaSortDown />}
                    variant="ghost"
                  />
                  <MenuList>
                    <MenuItem>Settings</MenuItem>
                    <MenuItem>Help</MenuItem>
                    <MenuItem>Logout</MenuItem>
                  </MenuList>
                </Menu>
              )}
            </ListItem>
          ))}
        </List>
      </VStack>
    </Box>
  );
};

export default Sidebar;
