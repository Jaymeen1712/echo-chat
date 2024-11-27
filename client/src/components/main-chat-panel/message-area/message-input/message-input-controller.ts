import {
  useCreateConversationMutation,
  useCreateMessageMutation,
  useUpdateConversationMutation,
} from "@/queries";
import { useAppStore } from "@/store";
import {
  CreateConversationResponseType,
  CreateMessageResponseType,
} from "@/types";
import { socketClient } from "@/wrapper";
import { useEffect, useState } from "react";

const useMessageInputController = () => {
  const [message, setMessage] = useState("");

  const {
    activeChat,
    currentUserData,
    patchActiveChat,
    patchActiveMessages,
    patchSubSidebarChats,
    setIsNewChatOpen,
  } = useAppStore();

  const createConversationMutation = useCreateConversationMutation();
  const createMessageMutation = useCreateMessageMutation();
  const updateConversationMutation = useUpdateConversationMutation();

  const { mutate: createConversationMutate, data: createConversationData } =
    createConversationMutation;

  const { mutate: createMessageMutate, data: createMessageData } =
    createMessageMutation;

  const { mutate: updateConversationMutate, data: updateConversationData } =
    updateConversationMutation;

  const handleCreateConversation = () => {
    if (!activeChat) return;

    const { userId } = activeChat;

    if (!userId || !currentUserData) return;

    const { userId: currentUserId } = currentUserData;

    createConversationMutate({
      participants: [userId, currentUserId],
    });
  };

  const handleOnMessageInputChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    const message = e.target.value;
    setMessage(message);
  };

  const handleCreateMessage = (createdConversationId?: string) => {
    if (!activeChat || !currentUserData) return;

    const { userId } = currentUserData;
    const conversationId = activeChat.conversationId || createdConversationId;

    if (!conversationId) return;

    createMessageMutate({
      content: message,
      conversationId: activeChat.conversationId || conversationId,
      senderId: userId,
    });
  };

  const handleMessageInputSubmit = () => {
    if (!activeChat) return;

    const { isChatTemp } = activeChat;

    if (isChatTemp) {
      handleCreateConversation();
    } else {
      handleCreateMessage();
    }
  };

  const handleUpdateConversation = (
    conversationId: string,
    lastMessageId: string,
  ) => {
    updateConversationMutate({
      conversationId,
      lastMessageId,
    });
  };

  useEffect(() => {
    if (createConversationData) {
      const createdConversation = createConversationData.data
        .data as CreateConversationResponseType;
      const { _id } = createdConversation;

      handleCreateMessage(_id);
    }
  }, [createConversationData]);

  useEffect(() => {
    if (createMessageData) {
      const { isError, data } = createMessageData.data;
      const { _id, conversation } = data as CreateMessageResponseType;

      if (!isError && currentUserData) {
        setMessage("");
        handleUpdateConversation(conversation, _id);
        patchActiveChat({
          isChatTemp: false,
          conversationId: conversation,
          userId: undefined,
        });
        patchActiveMessages({
          ...data,
          type: data.sender === currentUserData.userId ? "receiver" : "sender",
        });
        setIsNewChatOpen(false);

        // Handle socket
        socketClient.emit("message-updated", {
          message: {
            ...data,
            sender: {
              _id: currentUserData.userId,
              name: currentUserData.name,
              image: currentUserData.image,
            },
            type: "sender",
          },
        });
      }
    }
  }, [createMessageData]);

  useEffect(() => {
    if (updateConversationData) {
      const updatedConversation = updateConversationData.data.data;
      patchSubSidebarChats(updatedConversation);

      // Handle socket
      socketClient.emit("conversation-updated", {
        conversation: updatedConversation,
        receiverId: activeChat?.userId,
      });
    }
  }, [updateConversationData]);

  return { message, handleOnMessageInputChange, handleMessageInputSubmit };
};

export default useMessageInputController;
