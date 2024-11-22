const USER_QUERY_KEY = {
  SEARCH_USERS: "searchUsers",
  ME: "me",
};

const CONVERSATION_QUERY_KEY = {
  GET_ALL_CONVERSATIONS: "getAllConversations",
};

const MESSAGE_QUERY_KEY = {
  GET_ALL_MESSAGES: "getAllMessages",
};

export const QUERY_KEY = {
  ...USER_QUERY_KEY,
  ...CONVERSATION_QUERY_KEY,
  ...MESSAGE_QUERY_KEY,
};
