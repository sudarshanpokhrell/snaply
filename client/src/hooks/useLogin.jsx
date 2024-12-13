import { useState } from "react";
import { useAuthContext } from "../context/authContext";
import axios from "axios";
axios.defaults.withCredentials = true;

import { useToast } from "@chakra-ui/react";
const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setAuthUser } = useAuthContext();

  const toast = useToast();
  const login = async (formData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        formData
      );
      const user = response.data.data.user;
      localStorage.setItem("authUser", JSON.stringify(user));
      setAuthUser(user);

      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
        status: "success",
        duration: 5000,
        isCloseable: true,
      });

      setIsLoading(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
      toast({
        title: "An error occurred",
        description:
          error.response?.data?.message ||
          "An error occurred. Please try again later.",
        status: "error",
        duration: 5000,
        isCloseable: true,
      });
      setIsLoading(false);
    }
  };

  return { isLoading, error, login };
};

export default useLogin;
