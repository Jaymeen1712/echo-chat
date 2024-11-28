import { SingleMessageWithTypeType } from "@/components/main-chat-panel/message-area/message-list/message-list-controller";
import { USER_ACCESS_KEY } from "@/enums";
import { GroupedMessageByDateType } from "@/types";
import Cookies from "js-cookie";
import moment from "moment";

export const isAuthenticated = (): boolean => {
  const accessToken = Cookies.get(USER_ACCESS_KEY.TOKEN);
  return !!accessToken;
};

export function capitalizeWords(input: string | undefined) {
  if (!input) return "-";

  const words = input.replace(/_/g, " ").split(" ");

  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );

  if (capitalizedWords.length > 1) {
    capitalizedWords[1] =
      capitalizedWords[1].charAt(0).toUpperCase() +
      capitalizedWords[1].slice(1);
  }

  return capitalizedWords.join(" ");
}

export const removeCookies = () => {
  Cookies.remove(USER_ACCESS_KEY.TOKEN);
};

export const handleGroupMessagesByDate = (
  messages: SingleMessageWithTypeType[],
) => {
  const grouped: Record<string, GroupedMessageByDateType> = {};

  messages.forEach((message) => {
    const date = moment(message.createdAt).startOf("day");
    const formattedDate = date.format("YYYY-MM-DD");

    if (!grouped[formattedDate]) {
      grouped[formattedDate] = {
        label: moment(date).calendar(null, {
          sameDay: "[Today]",
          lastDay: "[Yesterday]",
          lastWeek: "dddd",
          sameElse: "MMM D, YYYY",
        }),
        date: formattedDate,
        messages: [],
      };
    }

    // Add the message to the respective group
    grouped[formattedDate].messages.push(message);
  });

  // Sort messages in descending order for each group
  Object.values(grouped).forEach((group) => {
    group.messages.sort((a, b) =>
      moment(b.createdAt).isBefore(a.createdAt) ? 1 : -1,
    );
  });

  return Object.values(grouped);
};

export const handleAddMessageToGroup = (
  newMessage: SingleMessageWithTypeType,
  groupedMessages: GroupedMessageByDateType[],
): GroupedMessageByDateType[] => {
  const newMessageDate = moment(newMessage.createdAt).startOf("day");
  const formattedDate = newMessageDate.format("YYYY-MM-DD");

  // Find the correct group based on the message date
  const groupIndex = groupedMessages.findIndex(
    (group) => group.date === formattedDate,
  );

  // If a group for this date exists, add the message to that group
  if (groupIndex >= 0) {
    groupedMessages[groupIndex].messages.push(newMessage);
  } else {
    // If no group for this date exists, create a new group
    const label = newMessageDate.calendar(null, {
      sameDay: "[Today]",
      lastDay: "[Yesterday]",
      lastWeek: "dddd",
      sameElse: "MMM D, YYYY",
    });

    groupedMessages.push({
      label,
      date: formattedDate,
      messages: [newMessage],
    });
  }

  // Sort messages in descending order for the group that the new message was added to
  groupedMessages.forEach((group) => {
    group.messages.sort((a, b) =>
      moment(b.createdAt).isBefore(a.createdAt) ? 1 : -1,
    );
  });

  return groupedMessages;
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      // Check if the result is a string (Base64)
      if (typeof reader.result === "string") {
        resolve(reader.result); // Only resolve if it's a string
      } else {
        reject(new Error("File could not be converted to a Base64 string"));
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file); // Convert file to base64 string
  });
};
