import { useAppStore } from "@/store";
import { peerConnection, socketClient } from "@/wrapper";
import { useCallback } from "react";
import { toast } from "react-toastify";

const useMessageAreaController = () => {
  const { receivedOffer, activeChat, setReceivedOffer } = useAppStore();

  const createAnswer = useCallback(
    async ({
      offer,
      senderUserId,
    }: {
      offer: RTCSessionDescriptionInit;
      senderUserId: string;
    }) => {
      try {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer),
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socketClient.emit("send-answer", { senderUserId, answer });
      } catch (error) {
        console.error("Error creating answer:", error);
      }
    },
    [peerConnection, socketClient],
  );

  const handleDeclineCall = () => {
    setReceivedOffer(undefined);
  };

  const handleAcceptCall = useCallback(async () => {
    if (!receivedOffer) {
      toast.error("Something went wrong while accepting offer");
      return;
    }

    const { offer, senderDetails } = receivedOffer;
    await createAnswer({
      offer,
      senderUserId: senderDetails.userId,
    });
  }, [peerConnection, socketClient, receivedOffer]);

  return { activeChat, receivedOffer, handleDeclineCall, handleAcceptCall };
};

export default useMessageAreaController;
