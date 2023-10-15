import { EventEmitter } from '@/app/util/EventEmitter';
import { World } from '@/app/world/World';

import * as socketIO from "socket.io-client";

export default class Socket {
    readonly onWorld = new EventEmitter<World>();

    readonly onConnect = new EventEmitter<void>();
    readonly onDisconnect = new EventEmitter<void>();
    readonly onConnectError = new EventEmitter<SocketConnectError>();

    private readonly socket: socketIO.Socket;

    constructor() {
        this.socket = socketIO.io('ws://127.0.0.1:8080');
        this.socket.on('connect', () => {
            this.onConnect.emit(undefined);
        });
        this.socket.on('connect_error', _ => {
            this.socket.close();
            this.onConnectError.emit(new SocketConnectError("Failed to connect to the WebSocket server."));
        });
        this.socket.on('disconnect', _ => {
            this.onDisconnect.emit(undefined);
        });
        this.socket.on('world', (world: string) => {
            this.onWorld.emit(JSON.parse(world) as World);
        });
    }

    get connected(): boolean {
        return this.socket.connected;
    }

    get disconnected(): boolean {
        return this.socket.disconnected;
    }

    sendSpawn() {
        if (this.connected) {
            this.socket.emit("spawn");
        }
    }

    sendMovingDirections(movingDirections: MovingDirections) {
        if (this.connected) {
            this.socket.emit("movingDirections", movingDirections);
        }
    }

    disconnect() {
        if (this.connected) {
            this.socket.disconnect();
        }
    }
}

export type MovingDirections = {
    up: boolean,
    down: boolean,
    left: boolean,
    right: boolean,
};

export class SocketConnectError extends Error {
    constructor(message: string) {
        super(message);
    }
}