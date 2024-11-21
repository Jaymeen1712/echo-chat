getUniqueConversationParticipantsKey = (participants) => {
  return participants
    .sort()
    .map((id) => id.toString())
    .join("");
};

module.exports = { getUniqueConversationParticipantsKey };
