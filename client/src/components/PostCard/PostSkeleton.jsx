import React from "react";
import {
  Box,
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  VStack,
} from "@chakra-ui/react";

function PostSkeleton() {
  return (
    <VStack gap={2} w={"full"}>
      <Box
        borderWidth="1px"
        borderRadius="md"
        overflow="hidden"
        boxShadow="sm"
        p={4}
        bg="white"
        width="full"
        maxW="600px"
        mx="auto"
      >
        {/* Header */}
        <Flex alignItems="center" mb={4}>
          <SkeletonCircle size="10" />
          <Box ml={4}>
            <Skeleton height="14px" width="120px" mb={2} />
            <Skeleton height="10px" width="90px" />
          </Box>
        </Flex>

        {/* Body */}
        <Skeleton height="200px" borderRadius="md" mb={4} />

        {/* Footer */}
      </Box>
      <Box
        borderWidth="1px"
        borderRadius="md"
        overflow="hidden"
        boxShadow="sm"
        p={4}
        bg="white"
        width="full"
        maxW="600px"
        mx="auto"
      >
        {/* Header */}
        <Flex alignItems="center" mb={4}>
          <SkeletonCircle size="10" />
          <Box ml={4}>
            <Skeleton height="14px" width="120px" mb={2} />
            <Skeleton height="10px" width="90px" />
          </Box>
        </Flex>

        {/* Body */}
        <Skeleton height="200px" borderRadius="md" mb={4} />

        {/* Footer */}
      </Box>
    </VStack>
  );
}

export default PostSkeleton;
