interface MessageItemProps {
  type: "sender" | "receiver";
}

const MessageItem: React.FC<MessageItemProps> = ({ type }) => {
  return (
    <div
      className={`flex ${type === "sender" ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`flex w-[70%] items-end gap-x-4 ${type !== "sender" && "flex-row-reverse"}`}
      >
        <div className="avatar">
          <img src="/user-avatar-1.png" alt="Avatar" />
        </div>

        <div
          className={`flex cursor-pointer flex-col gap-y-3 rounded-2xl bg-purple-primary/10 px-5 py-3 text-sm ${type !== "sender" && "bg-purple-primary"}`}
        >
          {type === "sender" && (
            <h4 className={`text-purple-dark-1 font-semibold`}>
              Jasmin Lowery
            </h4>
          )}

          <span
            className={`font-medium ${type !== "sender" && "text-white-primary"}`}
          >
            I added a new flows to our design system. Now you can use them for
            your projects! I added a new flows to our design system. Now you can
            use them for your projects! I added a new flows to our design
            system. Now you can use them for your projects! I added a new flows
            to our design system. Now you can use them for your projects!
          </span>

          <div
            className={`flex items-center gap-x-2 ${type !== "sender" && "text-white-primary"}`}
          >
            <div className="h-4 w-4 flex-1 rounded-full"></div>

            <div className="flex gap-x-4 opacity-50">
              <span>23</span>
              <span>09:20</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
