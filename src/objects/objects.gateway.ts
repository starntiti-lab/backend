import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})
export class ObjectsGateway {
  @WebSocketServer()
  server: Server;

  emitObjectCreated(object: any) {
    this.server.emit('object.created', {
      _id: object._id,
      title: object.title,
      description: object.description,
      imageUrl: object.imageUrl,
      createdAt: object.createdAt,
    });
  }
}