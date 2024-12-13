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
import useLogin from "./../hooks/useLogin";

export default function Login() {
  const { loading, error, login } = useLogin();

  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    // Implement form data change
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Implement form submission
    await login(formData);
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
          Login to Snaply
        </Highlight>
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={3} mt={4} width="full" mb={6}>
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
          <Text color="red.500" textAlign="center">
            {error}
          </Text>
          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            mt={4}
            disabled={loading}
          >
            Login to Snaply
          </Button>

          <Text>
            New to Snaply?{" "}
            <ChakraLink as={RouterLink} to="/auth/register" color="blue.500">
              Register
            </ChakraLink>
          </Text>
        </VStack>
      </form>

      {/* Profile Picture Upload */}
    </Box>
  );
}
