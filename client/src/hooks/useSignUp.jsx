import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;


import { useAuthContext } from "../context/authContext";
const useSignUp = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const register = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        formData
      );
      if (response.status === 201) {
        console.log(response.data);
      }
      console.log(response.data);
      const user = response.data.data.user;
      localStorage.setItem("authUser", JSON.stringify(user));

      setAuthUser(user);

      console.log("User", user);
      toast({
        title: "Account created.",
        description: "You have successfully created an account.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred.",
        description:
          error.response?.data?.message ||
          "Unable to create an account. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.log(error);
      setLoading(false);
    }
  };

  return { loading, register };
};

export default useSignUp;
