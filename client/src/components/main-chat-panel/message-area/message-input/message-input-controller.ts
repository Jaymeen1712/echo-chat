import {
  useCreateConversationMutation,
  useCreateMessageMutation,
  useUpdateConversationMutation,
} from "@/queries";
import { useAppStore } from "@/store";
import {
  CreateConversationResponseType,
  CreateMessageResponseType,
  FileType,
} from "@/types";
import { convertFileToBase64 } from "@/utils";
import { socketClient } from "@/wrapper";
import imageCompression from "browser-image-compression";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const useMessageInputController = () => {
  const [isAttachContainerOpen, setIsAttachContainerOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [fileAttachments, setFileAttachments] = useState<Map<string, FileType>>(
    new Map(),
  );

  const attachContainerRef = useRef<HTMLDivElement | null>(null);

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
      files: Array.from(fileAttachments.values()).flat(),
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

  const handleAttachOnChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    try {
      const files = e.target.files;

      if (files) {
        const filesLength = files.length;

        const totalFilesCount = fileAttachments.size;

        if (totalFilesCount + filesLength > 3) {
          toast.warn("You can only attach 3 files.");
        }

        const newAttachments: Map<
          string,
          { url: string; name: string; type: string; size: number }
        > = new Map(fileAttachments);

        const maxFiles = filesLength > 3 ? 3 - totalFilesCount : filesLength;

        for (let i = 0; i < maxFiles; i++) {
          const file = files[i];

          if (file.type.startsWith("image/")) {
            // If it's an image, compress it
            const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            };

            const compressedFile = await imageCompression(file, options);
            const base64File = await convertFileToBase64(compressedFile);
            const randomId = Math.random().toString(36).substr(2, 9);

            newAttachments.set(randomId, {
              url: base64File, // Base64 for images
              name: file.name,
              type: file.type,
              size: compressedFile.size,
            });
          } else {
            // If it's a document (PDF, Word, etc.), store as Blob
            const blobUrl = URL.createObjectURL(file); // Create a URL for the Blob file
            const randomId = Math.random().toString(36).substr(2, 9);

            newAttachments.set(randomId, {
              url: blobUrl, // Blob URL for documents
              name: file.name,
              type: file.type,
              size: file.size,
            });
          }
        }

        setFileAttachments(newAttachments); // Update state with new files
      }
    } catch (error) {
      toast.warn("Something went wrong!, Please try again");
      console.error("Error handling file attachment", error);
    }
  };

  const handleDeleteImage = (id: string) => {
    const tempImages = new Map(fileAttachments);
    tempImages.delete(id);
    setFileAttachments(tempImages);
  };

  const handleToggleAttachButton = () => {
    setIsAttachContainerOpen((prev) => !prev);
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
        setFileAttachments(new Map());

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
    const handleClickOutside = (e: MouseEvent) => {
      if (
        attachContainerRef.current &&
        !attachContainerRef.current.contains(e.target as Node)
      ) {
        setIsAttachContainerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  return {
    message,
    handleOnMessageInputChange,
    handleMessageInputSubmit,
    fileAttachments,
    handleDeleteImage,
    isAttachContainerOpen,
    handleToggleAttachButton,
    attachContainerRef,
    handleAttachOnChange,
  };
};

export default useMessageInputController;
