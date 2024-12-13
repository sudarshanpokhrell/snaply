import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  Button,
  VStack,
  Image,
  Stack,
  HStack,
  IconButton,
  useToast,
} from "@chakra-ui/react";
// import { CloseIcon } from "@chakra-ui/icons";
import { IoIosClose } from "react-icons/io";
import React, { useState } from "react";
import { MdDriveFolderUpload } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Create() {
  const navigate = useNavigate();
  const [caption, setCaptions] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const toast = useToast();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const updatedPreviews = [...imagePreviews];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedPreviews.push(reader.result);
        setImagePreviews([...updatedPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    const formData = {
      content: caption,
      pictures: imagePreviews,
    };

    console.log(formData);

    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/posts/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast({
        title: "Post Created",
        description: "Your post has been created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log("Error", error);
      toast({
        title: "Error",
        description:
          error.response.data.message ||
          "An error occurred while creating the post",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setCaptions(""); // Clear the form after submission
      setImagePreviews([]);
      navigate("/");
    }

   
  };

  return (
    <Box p={4} minH="100vh" bg="gray.100">
      <Container maxW="700px" p={6} bg="white" borderRadius="md" boxShadow="sm">
        <Heading as="h1" size="lg" mb={6} textAlign="center">
          Create Your Post
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            {/* Caption Input */}
            <FormControl isRequired>
              <FormLabel fontWeight="bold">Caption</FormLabel>
              <Textarea
                placeholder="Write your caption here..."
                variant="outline"
                resize="none"
                value={caption}
                onChange={(e) => setCaptions(e.target.value)}
              />
            </FormControl>

            {/* Image Upload */}
            <FormControl>
              <FormLabel
                display={"flex"}
                alignItems={"center"}
                gap={"5px"}
                htmlFor="image"
                fontWeight="bold"
                _hover={{ cursor: "pointer" }}
              >
                Upload Images <MdDriveFolderUpload size={"25px"} />{" "}
              </FormLabel>
              {/* <label htmlFor="image">Upload</label> */}
              <Input
                id="image"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                pt={1}
                display="none"
              />
              {imagePreviews.length > 0 && (
                <Stack mt={4} spacing={4} width="full">
                  {imagePreviews.map((image, index) => (
                    <HStack key={index} spacing={4} align="center">
                      <Image
                        src={image}
                        alt={`Preview ${index + 1}`}
                        borderRadius="md"
                        boxShadow="sm"
                        maxH="150px"
                        maxW="150px"
                      />
                      <IconButton
                        aria-label="Remove image"
                        icon={<IoIosClose />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => removeImage(index)}
                      />
                    </HStack>
                  ))}
                </Stack>
              )}
            </FormControl>

            {/* Submit Button */}
            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              size="lg"
              borderRadius="md"
            >
              Post Now
            </Button>
          </VStack>
        </form>
      </Container>
    </Box>
  );
}

export default Create;
