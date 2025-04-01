import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex flex-row justify-between items-center">
        <div className="pl-5 flex flex-row items-center">
          <img
            className="size-10 rounded-full object-cover"
            src={selectedUser?.profilePic || "/avatar.png"}
            alt={selectedUser?.fullName}
          />
          <div className="flex flex-col justify-center text-left">
            <span className="ml-3 text-primary">{selectedUser?.fullName}</span>
            <span className="ml-3 text-sm text-zinc-400">
              {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        <div>
          <button className="text-zinc-50 text-2xl pr-5">&times;</button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
