const ChatItem = () => {
  return (
    <div className="flex cursor-pointer items-center justify-center gap-x-4 rounded-xl px-2 py-3 text-sm transition-all hover:bg-purple-primary/10">
      <div className="avatar">
        <img src="/user-avatar-1.png" alt="Avatar" />
      </div>
      <div className="flex-1">
        <h4 className="text-base font-semibold leading-7">Design chat</h4>
        <span className="flex gap-x-2 leading-7">
          <span className="text-purple-primary">You:</span>
          <span className="line-clamp-1 flex-1 text-ellipsis break-all opacity-50">
            Jessie Rollins sent one
          </span>
        </span>
      </div>
      <div>
        <span className="opacity-50">4m</span>
      </div>
    </div>
  );
};

export default ChatItem;
