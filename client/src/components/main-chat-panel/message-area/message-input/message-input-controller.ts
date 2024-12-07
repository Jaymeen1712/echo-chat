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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

const useMessageInputController = () => {
  const [isAttachContainerOpen, setIsAttachContainerOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [fileAttachments, setFileAttachments] = useState<Map<string, FileType>>(
    new Map(),
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const attachContainerRef = useRef<HTMLDivElement | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);

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

  const isSendButtonDisable = useMemo(
    () => !(!!message || fileAttachments.size || audioUrl),
    [message, fileAttachments],
  );

  const handleCreateConversation = () => {
    if (!activeChat) return;

    const { userId } = activeChat;

    if (!userId || !currentUserData) return;

    const { userId: currentUserId } = currentUserData;

    createConversationMutate({
      participants: [userId, currentUserId],
    });
  };

  const handleOnMessageInputChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        const message = e.target.value;
        setMessage(message);

        if (!activeChat?.conversationId || !activeChat?.userId) return;

        socketClient.emit("send-true-typing", {
          conversationId: activeChat?.conversationId,
          targetUserId: activeChat?.userId,
        });

        if (!message.length) {
          socketClient.emit("send-false-typing", {
            conversationId: activeChat?.conversationId,
            targetUserId: activeChat?.userId,
          });
        }
      },
      [socketClient, activeChat?.conversationId, activeChat?.userId],
    );

  const handleCreateMessage = (createdConversationId?: string) => {
    if (!activeChat || !currentUserData) return;

    const { userId } = currentUserData;
    const conversationId = activeChat.conversationId || createdConversationId;

    if (!conversationId) return;

    const files = Array.from(fileAttachments.values()).flat();

    createMessageMutate({
      content: message,
      conversationId: activeChat.conversationId || conversationId,
      senderId: userId,
      files,
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

        const newAttachments = new Map(fileAttachments);

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
            const base64URL = await convertFileToBase64(compressedFile);
            const randomId = Math.random().toString(36).substr(2, 9);

            newAttachments.set(randomId, {
              data: base64URL,
              name: file.name,
              type: file.type,
              size: compressedFile.size,
            });
          } else {
            const base64URL = await convertFileToBase64(file);
            // // If it's a document (PDF, Word, etc.), store as Blob
            // const arrayBuffer = await file.arrayBuffer();
            // const dataBlob = new Blob([arrayBuffer], { type: file.type });
            const randomId = Math.random().toString(36).substr(2, 9);

            newAttachments.set(randomId, {
              data: base64URL,
              name: file.name,
              type: file.type,
              size: file.size,
            });
          }
        }

        setFileAttachments(newAttachments);
      }
    } catch (error) {
      toast.warn("Something went wrong!, Please try again");
      console.error("Error handling file attachment", error);
    }
  };

  const handleDeleteFile = (id: string) => {
    const tempImages = new Map(fileAttachments);
    tempImages.delete(id);
    setFileAttachments(tempImages);
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const handleToggleAttachButton = () => {
    if (!(fileAttachments.size >= 3 || audioUrl)) {
      setIsAttachContainerOpen((prev) => !prev);
    }
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
          type:
            data.sender._id === currentUserData.userId ? "receiver" : "sender",
        });
        setIsNewChatOpen(false);
        setFileAttachments(new Map());
        setAudioUrl(null);
        setAudioBlob(null);

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

        socketClient.emit("send-false-typing", {
          conversationId: activeChat?.conversationId,
          targetUserId: activeChat?.userId,
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
    if (audioBlob && audioUrl) {
      const audioFileAttachments: Map<string, FileType> = new Map();
      const randomId = Math.random().toString(36).substr(2, 9);

      const uniqueName = `audio_${new Date().toISOString()}_${randomId}.wav`;

      audioFileAttachments.set(randomId, {
        data: audioUrl,
        name: uniqueName,
        type: "audio/wav",
        size: audioBlob.size,
      });

      setFileAttachments(audioFileAttachments);
    }
  }, [audioBlob, audioUrl]);

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

  useEffect(() => {
    textInputRef.current && textInputRef.current.focus();
  }, []);

  return {
    message,
    handleOnMessageInputChange,
    handleMessageInputSubmit,
    fileAttachments,
    handleDeleteFile,
    isAttachContainerOpen,
    handleToggleAttachButton,
    attachContainerRef,
    handleAttachOnChange,
    isSendButtonDisable,
    audioUrl,
    setAudioUrl,
    setAudioBlob,
    textInputRef,
  };
};

export default useMessageInputController;
