import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway(3001, { cors: true, transports: ['websocket'] })
export class MessagesGateway {
  constructor(private readonly authService: AuthService) {}
  @WebSocketServer()
  server;

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody('data')
    data: {
      user: { id: number; name: string };
      message: string;
    },
  ): void {
    console.log(`The user ${data.user.id} sent a message: ${data.message}`);
    this.server.emit('message', { message: data.message, user: data.user });
  }
}
