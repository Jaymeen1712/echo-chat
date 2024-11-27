import moment from "moment";
import { SingleMessageWithTypeType } from "../message-list-controller";

interface MessageItemProps {
  type: "sender" | "receiver";
  message: SingleMessageWithTypeType;
}

const MessageItem: React.FC<MessageItemProps> = ({ type, message }) => {
  const { content, sender, createdAt } = message;
  const { name } = sender;

  return (
    <div
      className={`flex ${type === "sender" ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`flex w-[70%] items-end gap-x-4 ${type !== "sender" && "!flex-row-reverse"}`}
      >
        <div className="avatar min-h-fit min-w-fit">
          <img src="/user-avatar-1.png" alt="Avatar" />
        </div>

        <div
          className={`flex cursor-pointer flex-col gap-y-3 rounded-2xl bg-purple-primary/10 px-5 py-3 text-sm ${type !== "sender" && "!bg-purple-primary"}`}
        >
          {type === "sender" && (
            <h4 className={`font-semibold text-purple-dark-1`}>{name}</h4>
          )}

          <span
            className={`font-medium ${type !== "sender" && "!text-white-primary"}`}
          >
            {content}
          </span>

          <div
            className={`flex items-center gap-x-2 ${type !== "sender" && "!text-white-primary"}`}
          >
            <div className="h-4 w-4 flex-1 rounded-full"></div>

            <div className="flex gap-x-4 opacity-50">
              <span>23</span>
              <span>{moment(createdAt).format("hh:mm A")}</span>
            </div>
          </div>  
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
