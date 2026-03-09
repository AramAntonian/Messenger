import type { Socket } from "socket.io-client";
import AddIcon from "../../../../assets/addButton.png";
import CreateChatModal from "./CreateChatModal";
import { useState } from "react";
import "../../assets/CreateChat.css";
import { logout } from "../../../../service/logout";
import type { UserDto } from "../../dto/UserDto";

interface CreateChat {
  socket: Socket;
}

function CreateChat({ socket }: CreateChat) {
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose(): void {
    setOpen(false);
  }

  async function createChat(name: string, users: string[]) {
    const participants = [...users];
    if (!users.length) {
      alert("add at least one user");
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
    handleClose()
  }

  return (
    <>
      <div className="add-cont">
        <div className="add-text">No Chat Found!</div>
        <img src={AddIcon} className="add-icon-button" onClick={handleOpen} />
        <div className="add-text">Create A New Chat!</div>
      </div>
      <CreateChatModal onClose={handleClose} open={open} createChat={createChat} />
    </>
  );
}

export default CreateChat;
