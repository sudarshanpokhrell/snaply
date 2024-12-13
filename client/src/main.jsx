import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "./index.css";
import App from "./App.jsx";
import { AuthContext, AuthProvider } from "./context/authContext.jsx";

const colors = {
  brand: {
    900: "#1a365d",
    800: "red",
    700: "#2a69ac",
  },
};

const theme = extendTheme({ colors });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </AuthProvider>
  </StrictMode>
);
