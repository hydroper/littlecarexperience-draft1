import { EventEmitter } from '@/app/util/EventEmitter';
import { World } from '@/app/world/World';

export default class Socket {
    readonly onWorld = new EventEmitter<World>();

    readonly onConnect = new EventEmitter<void>();
    readonly onDisconnect = new EventEmitter<void>();
    readonly onConnectError = new EventEmitter<SocketConnectError>();

    private readonly socket: WebSocket;

    constructor() {
        this.socket = new WebSocket('ws://127.0.0.1:8080');
        this.socket.addEventListener('open', () => {
            this.onConnect.emit(undefined);
        });
        this.socket.addEventListener('error', _ => {
            this.onConnectError.emit(new SocketConnectError("Failed to connect to the WebSocket server."));
        });
        this.socket.addEventListener('close', e => {
            if ([1011, 1006].includes(e.code)) {
                this.onConnectError.emit(new SocketConnectError("Failed to connect to the WebSocket server."));
            } else {
                this.onDisconnect.emit(undefined);
            }
        });
        this.socket.addEventListener('message', e => {
            if (typeof e.data === "string") {
                const message = JSON.parse(e.data);

                switch (message.type) {
                    case "World":
                        this.onWorld.emit(message.world as World);
                        break;
                }
            }
        });
    }

    get connected(): boolean {
        return this.socket.readyState == WebSocket.OPEN;
    }

    get disconnected(): boolean {
        return this.socket.readyState != WebSocket.OPEN;
    }

    sendSpawn() {
        if (this.connected) {
            this.socket.send(JSON.stringify({
                type: "Spawn"
            }));
        }
    }

    sendMovingDirections(movingDirections: MovingDirections) {
        if (this.connected) {
            this.socket.send(JSON.stringify({
                type: "MovingDirections",
                ...movingDirections,
            }));
        }
    }

    disconnect() {
        if (this.connected) {
            this.socket.close();
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