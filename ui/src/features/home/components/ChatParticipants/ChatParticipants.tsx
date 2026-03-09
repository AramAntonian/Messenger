import type { UserDto } from "../../dto/UserDto";
import ChatUser from "./ChatUser";
import "../../assets/ChatParicipants.css";

interface ChatParticipantsProps {
  users: UserDto[] | undefined;
}

function ChatParticipants({ users }: ChatParticipantsProps) {
  console.log(users);
  return (
    <div className="chat-participants-cont">
      <div className="chat-participants">Chat Participants</div>
      <div className="chat-users">
        {users && users.map((el: UserDto, idx: number) => <ChatUser user={el} key={idx} />)}
      </div>
    </div>
  );
}

export default ChatParticipants;
