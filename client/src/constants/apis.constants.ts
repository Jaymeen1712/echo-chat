const API_ENDPOINT = "/chat-service";

const AUTH_API_ROUTES = {
  REGISTER: `${API_ENDPOINT}/register`,
  LOGIN: `${API_ENDPOINT}/login`,
};

const USERS_API_ROUTES = {
  ME: `${API_ENDPOINT}/me`,
  SEARCH_USERS: `${API_ENDPOINT}/searchUsers`,
  UPDATE_USER: `${API_ENDPOINT}/update-user`,
};

const CONVERSATIONS_API_ROUTES = {
  CREATE_CONVERSATION: `${API_ENDPOINT}/conversation`,
  GET_ALL_CONVERSATIONS: `${API_ENDPOINT}/conversations`,
  UPDATE_CONVERSATION: `${API_ENDPOINT}/conversation`,
  DELETE_CONVERSATION: `${API_ENDPOINT}/conversation/:conversationId`,
};

const MESSAGES_API_ROUTES = {
  CREATE_MESSAGE: `${API_ENDPOINT}/message`,
  GET_ALL_MESSAGES: `${API_ENDPOINT}/messages/:conversationId`,
  DELETE_MESSAGE: `${API_ENDPOINT}/message/:messageId`,
};

export const API_ROUTES = {
  ...AUTH_API_ROUTES,
  ...USERS_API_ROUTES,
  ...CONVERSATIONS_API_ROUTES,
  ...MESSAGES_API_ROUTES,
};
