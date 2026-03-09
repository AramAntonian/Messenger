import { HttpException, Req, UseGuards, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from './chat.guard';
import { ChatService } from './chat.service';
import { MessageDto } from './dto/message.dto';
import { UserService } from 'src/user/user.service';
import { CreateChat } from './dto/createChat.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { CreateMessageDto } from './dto/createMessage.dto';
import { ChatDto } from './dto/chat.dto';

@UseGuards(WsJwtGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>();

  async handleConnection(client: Socket) {
    try {
      const jwt = client.handshake.auth.token;
      if (!jwt) {
        client.disconnect();
        return;
      }
      const user: UserDto = await this.jwtService.verify(jwt);
      if (!user) {
        client.disconnect();
      }
      this.connectedUsers.set(user.username, client.id);

      console.log(`${user.username}/${client.id} connected`);

      const data = await this.chatService.getChats(user.username);
      this.server.to(client.id).emit('chats', data);
    } catch (err) {
      console.error(err);
      client.disconnect();
    }
  }

  handleDisconnect(client: any) {
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        console.log(`${userId}/${client.id} disconected from server `);
        break;
      }
    }
  }

  @SubscribeMessage('newMessage')
  newMessage(@MessageBody() body: MessageDto) {
    const users = body.chat.users;
    const sockets: string[] = [];
    if (users) {
      for (const el of users) {
        const socket = this.connectedUsers.get(`${el.username}`);
        if (socket) {
          sockets.push(socket);
        }
      }
      if (sockets.length) {
        this.server.to(sockets).emit('onMessage', body);
      }
    }
  }

  @SubscribeMessage('newChat')
  async newChat(@MessageBody() chat: CreateChat) {
    const clients: string[] = [];

    for (const el of chat.users) {
      const socket = this.connectedUsers.get(`${el}`);
      if (socket) {
        clients.push(socket);
      }
    }

    try {
      const newChat = await this.chatService.addChat(chat);
      if (clients.length) {
        this.server.to(clients).emit('chats', [newChat]);
      }
    } catch {
      throw new HttpException('Internal server error', 500);
    }
  }

  @SubscribeMessage('enterChat')
  async enterChat(
    @MessageBody() id: number,
    @ConnectedSocket() client: Socket,
  ) {
    const clientId = this.connectedUsers.get(client.data?.user?.username);

    const messages: MessageDto[] | undefined = await this.chatService.getMessages(id);
    if (clientId && messages) {
      this.server.to(clientId).emit('messages', messages);
    } else {
      throw new HttpException('No Such Chat', HttpStatus.BAD_REQUEST);
    }
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() message: CreateMessageDto) {
    console.log(message);

    const clients: string[] = [];
    const newMessage = await this.chatService.newMessage(message);
    const chat: ChatDto | null = await this.chatService.getChat(message.chat, [
      'users',
    ]);
    if (!chat || !newMessage) {
      throw new HttpException(
        'Wrong Sender Or Chat creditinals',
        HttpStatus.NOT_FOUND,
      );
    }
    for (const el of chat.users!) {
      const socket = this.connectedUsers.get(el.username);
      if (socket) {
        clients.push(socket);
      }
    }
    console.log(clients)

    if (newMessage && clients.length) {
      this.server.to(clients).emit('messages', [newMessage]);
    } else {
      throw new HttpException(
        'Wrong Sender Or Chat creditinals',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
