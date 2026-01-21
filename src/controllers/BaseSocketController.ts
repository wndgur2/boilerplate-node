import { Server } from 'socket.io';
import { SocketClient } from '../types';

export abstract class BaseSocketController {
  protected io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  /**
   * Initialize socket event handlers
   */
  abstract initialize(): void;

  /**
   * Handle socket connection
   */
  protected handleConnection(socket: SocketClient): void {
    console.log(`Socket connected: ${socket.id}`);
    this.registerEvents(socket);
  }

  /**
   * Handle socket disconnection
   */
  protected handleDisconnection(socket: SocketClient): void {
    console.log(`Socket disconnected: ${socket.id}`);
  }

  /**
   * Register socket events - to be implemented by child classes
   */
  protected abstract registerEvents(socket: SocketClient): void;

  /**
   * Emit to a specific socket
   */
  protected emitToSocket(socket: SocketClient, event: string, data: any): void {
    socket.emit(event, data);
  }

  /**
   * Emit to all connected sockets
   */
  protected emitToAll(event: string, data: any): void {
    this.io.emit(event, data);
  }

  /**
   * Emit to all sockets except the sender
   */
  protected broadcastFrom(socket: SocketClient, event: string, data: any): void {
    socket.broadcast.emit(event, data);
  }
}
