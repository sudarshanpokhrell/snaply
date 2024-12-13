import React from 'react'
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Container 
} from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <Flex 
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      overflow="hidden"
    >
      {/* Left Side - App Introduction */}
      <Box 
        flex={1} 
        bg="blue.600" 
        color="white" 
        display={{ base: 'none', md: 'flex' }}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p={12}
        textAlign="center"
      >
        <Heading 
          as="h1" 
          size="3xl" 
          mb={6}
          fontWeight="bold"
        >
          Snaply
        </Heading>
        <Text 
          fontSize="xl" 
          maxWidth="500px"
          lineHeight="tall"
        >
          Your ultimate platform for seamless sharing, 
          connecting, and experiencing moments that matter. 
          Snap, share, and stay connected with Snaply.
        </Text>
      </Box>

      {/* Right Side - Authentication Form */}
      <Flex 
        flex={1} 
        bg="white" 
        justifyContent="center" 
        alignItems="center"
        p={8}
        overflowY="auto"
      >
        <Container 
          maxWidth="400px" 
          width="full"
          height="100%"
        >
          <Outlet />
        </Container>
      </Flex>
    </Flex>
  )
}

export default AuthLayout