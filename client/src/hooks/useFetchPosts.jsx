import { useToast } from "@chakra-ui/react";
import axios from "axios";
axios.defaults.withCredentials = true;

import { useState } from "react";

const useFetchPosts = () => {
  const toast = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (route) => {
    if (loading) return; // Prevent multiple requests
    setLoading(true);
    try {
      const response = await axios.get(route);
      setPosts(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error)
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return { posts, loading, fetchPosts };
};

export default useFetchPosts;
