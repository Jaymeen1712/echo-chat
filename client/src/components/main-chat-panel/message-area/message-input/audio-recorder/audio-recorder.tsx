import { convertFileToBase64 } from "@/utils";
import React, { useRef, useState } from "react";
import { PiMicrophoneBold } from "react-icons/pi";

interface AudioRecorderProps {
  setAudioUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setAudioBlob: React.Dispatch<React.SetStateAction<Blob | null>>;
  isDisabled: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  setAudioUrl,
  setAudioBlob,
  isDisabled,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleRecordClick = async (): Promise<void> => {
    if (isDisabled) return;

    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder: MediaRecorder = new MediaRecorder(stream);

        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event: BlobEvent) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          // Combine audio chunks into a Blob and create an audio URL
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          setAudioBlob(audioBlob);

          const randomId = Math.random().toString(36).substr(2, 9);
          const uniqueName = `audio_${new Date().toISOString()}_${randomId}.wav`;
          const file = new File([audioBlob], uniqueName, {
            type: "audio/wav",
          });
          const base64URL = await convertFileToBase64(file);
          setAudioUrl(base64URL);

          // Clean up media tracks
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);

        // Auto-stop after 5 seconds
        timeoutRef.current = setTimeout(() => {
          mediaRecorder.stop();
          setIsRecording(false);
        }, 5000);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }
  };

  return (
    <PiMicrophoneBold
      size={25}
      onClick={handleRecordClick}
      className={`cursor-pointer ${!isRecording ? "text-purple-primary" : "text-red-600"}`}
    />
  );
};

export default AudioRecorder;
