import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | null = null;
  private backendUrl = 'http://localhost:5000';

  constructor(private authService: AuthService) {
    this.authService.currentUser;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(this.backendUrl, {
        withCredentials: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to realtime server');
        this.joinRoom();
      });
    } else {
      this.joinRoom();
    }
  }

  joinRoom(socketUserId?: string) {
    let userId = socketUserId;

    if (!userId) {
      const user = this.authService.currentUser();
      userId = user?.id || user?._id;

      if (this.socket && this.socket.connected && userId) {
        this.socket.emit('join', userId);
      }
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onBalanceUpdate(): Observable<{ balance: number }> {
    return new Observable(observer => {
      this.socket?.on('balance_update', (data: { balance: number }) => {
        observer.next(data);
      });
    });
  }

  onNewTransaction(): Observable<void> {
    return new Observable(observer => {
      this.socket?.on('new_transaction', () => {
        observer.next();
      });
    });
  }
}
