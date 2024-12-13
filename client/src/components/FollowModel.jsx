import {
  Button,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export const FollowModel = ({ isOpen, onClose, title, type, userId }) => {
  const [users, setUsers] = useState([]);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://jsonplaceholder.typicode.com/${type}`
          );
          if (!response.ok) {
            throw new Error("Something went wrong!");
          }
          const data = await response.json();
          setUsers(data.map((user) => user.name));
        } catch (error) {
          toast({
            title: "An error occurred.",
            description: error.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      };     

      fetchData();
    }
  }, [isOpen, type]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxHeight="50vh" overflowY="auto">
          <List>
            {users.map((user, index) => (
              <ListItem key={index}>{user}</ListItem>
            ))}
          </List>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
