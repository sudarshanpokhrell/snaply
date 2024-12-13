import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  VStack,
  Link as ChakraLink,
  InputGroup,
  InputRightElement,
  Highlight,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import  useSignUp  from "../hooks/useSignUp";
export default function Register() {
  const { loading, register } = useSignUp();

  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    profilePicture: null,
  });

  const handleChange = (event) => {
    // Implement form data change
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileUpload = (event) => {
    setFormData({
      ...formData,
      profilePicture: event.target.files[0],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Implement form submission
    await register(formData);
  };
  return (
    <Box
      width="full"
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      mb={4}
      mt={10}
    >
      <Heading
        mb={2}
        textAlign="center"
        width="full"
        fontWeight="semibold"
        fontSize="25px"
      >
        <Highlight
          query="Snaply"
          styles={{ color: "#AD49E1", fontWeight: "bold" }}
        >
          Join SNAPLY and start sharing moments that matter.
        </Highlight>
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={3} mt={4} width="full" mb={6}>
          <FormControl isRequired>
            <FormLabel ml="5px">Username</FormLabel>
            <Input
              placeholder="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel ml="5px">Full Name</FormLabel>
            <Input
              placeholder="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel ml="5px">Email</FormLabel>
            <Input
              placeholder="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel ml="5px">Password</FormLabel>
            <InputGroup>
              <Input
                placeholder="Password"
                type={show ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <InputRightElement>
                <Button
                  size="sm"
                  onClick={() => setShow(!show)}
                  variant="ghost"
                >
                  {show ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl>
            <FormLabel ml="5px">Profile Picture</FormLabel>
            <Input
              variant="flushed"
              type="file"
              name="profilePicture"
              accet="image/*"
              onChange={handleFileUpload}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            mt={4}
            disabled={loading}
          >
            Create Account
          </Button>

          <Text>
            Already have an account?{" "}
            <ChakraLink as={RouterLink} to="/auth/login" color="blue.500">
              Login
            </ChakraLink>
          </Text>
        </VStack>
      </form>

      {/* Profile Picture Upload */}
    </Box>
  );
}
