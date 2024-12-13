import { useToast } from "@chakra-ui/react";
import axios from "axios";
axios.defaults.withCredentials = true;

import { useState } from "react";

const usePost = () => {
  const toast = useToast();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPost = async (postId) => {
    if (loading) return; // Prevent multiple requests
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/posts/${postId}`);

      setPost(response.data.data);
      console.log(response.data.data);
      
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { post, loading, error, fetchPost };
};

export default usePost;
