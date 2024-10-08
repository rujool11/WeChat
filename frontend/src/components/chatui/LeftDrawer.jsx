import React from "react";
import {
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerHeader,
  DrawerContent,
  DrawerBody,
  Box,
  Input,
  useToast,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import SearchIcon from "../icons/SearchIcon";
import ChatLoading from "./ChatLoading.jsx";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import UserListItem from "../useravatar/UserListItem.jsx";
import { Spinner } from "@chakra-ui/react";

const LeftDrawer = ({ children }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const toast = useToast();
  const { user, setSelectedChat, chats, setChats } = ChatState();

  const accessChats = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json", // since posting data
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      
      // if chat already in chats, dont append, else append data to chats
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();

    } catch (error) {
      console.log(error);
      toast({
        title: "error fetching chat",
        description: `${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "please enter search field",
        status: "warning",
        isClosable: true,
        duration: 5000,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        // since these API calls are protected
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);

    } catch (error) {
      console.log(error);
      toast({
        title: "api call failed",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top-left",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={onOpen}>{children}</div>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px" fontFamily="Kanit">
            Search Users
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" pd={2}>
              <Input
                placeholder="search for user"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                margin={1}
              />
              <Button marginTop={1} onClick={handleSearch}>
                <SearchIcon size={18} />
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChats(user._id)}
                  />
                );
              })
            )}
            {loadingChat && <Spinner d="flex" ml="auto" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default LeftDrawer;
