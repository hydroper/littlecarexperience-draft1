import Socket, { SocketConnectError } from '@/app/socket/Socket';
import { Car, World } from '@/app/world/World';
import LevelView from './LevelView';

// The level frame original size
const frameWidth = 1140;
const frameHeight = 518;

type PlayProperties = {
    backToServers: () => void,
    setConnecting: (value: boolean) => void,
    setConnectionFailed: (value: boolean) => void,
};

export default class Level {
    /**
     * The single `Level` instance used throughout
     * the codebase. This property is lazily-initialized.
     */
    static get level(): Level {
        Level._level ??= new Level();
        return Level._level;
    }
    private static _level: Level | undefined = undefined;

    private playing: boolean = false;
    private playProps: PlayProperties | undefined = undefined;

    /**
     * The 2D view.
     */
    private readonly view = new LevelView();

    /**
     * Client WebSocket for the server connection.
     */
    public socket: Socket | undefined = undefined;

    public get connected() {
        return this.socket !== undefined && this.socket.connected;
    }

    /**
     * Displays the level and connects to the server.
     */
    async play(props: PlayProperties) {
        if (this.playing) {
            return;
        }
        this.playing = true;
        this.playProps = props;

        // Attach the view
        this.view.attach();

        await this.connect();
    }

    stop() {
        if (!this.playing) {
            return;
        }

        // Detach view
        this.view.detach();

        // Disconnect from server
        this.socket?.disconnect();
        this.socket = undefined;

        // Wipe `play()` properties
        this.playProps = undefined;
        this.playing = false;
    }

    private async connect() {
        this.playProps!.setConnecting(true);
        this.socket = new Socket();

        // Once connected
        this.socket.onConnect.listen(() => {
            this.playProps!.setConnecting(false);
            this.socket!.sendSpawn();
        });

        // If connection fails
        this.socket.onConnectError.listen(() => {
            this.playProps!.setConnecting(false);
            this.playProps!.setConnectionFailed(true);
        });

        // Update world
        this.socket.onWorld.listen(world => {
            this.view.renderLevel(world);
        });
    }
}