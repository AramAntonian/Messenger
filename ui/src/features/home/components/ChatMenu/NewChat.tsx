import { useContext, useState } from "react";
import addButton from "../../../../assets/addButton.png";
import "../../assets/NewChat.css";
import CreateChatModal from "./CreateChatModal";
import type { UserDto } from "../../dto/UserDto";
import { logout } from "../../../../service/logout";
import { WebSocketContext } from "../../../../contexts/WebSocketContext";

function NewChat() {
  const socket = useContext(WebSocketContext);
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }
  async function createChat(name: string, users: string[]) {
    const participants = [...users];
    if (!users.length) {
      return alert("add at least one user");
    }
    const res = localStorage.getItem("USER");
    let me: UserDto;
    if (res) {
      me = await JSON.parse(res);
    } else {
      return logout();
    }
    participants.push(me.username);
    const data = { name, users: participants };
    socket.emit("newChat", data);
    handleClose();
  }

  return (
    <>
      <div className="new-chat-cont" onClick={handleOpen}>
        <img src={addButton} />
        <div>Create A New Chat</div>
      </div>
      <CreateChatModal onClose={handleClose} open={open} createChat={createChat} />
    </>
  );
}

export default NewChat;
