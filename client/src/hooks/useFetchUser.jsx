import { useToast } from "@chakra-ui/react";
import axios from "axios";
import React from "react";

export const useFetchUser = () => {
  const toast = useToast();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const fetchUser = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/users/${userId}`);
      setUser(response.data.data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "Unable to fetch user details.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  return { user, loading, fetchUser };
};


