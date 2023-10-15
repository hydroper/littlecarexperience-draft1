class_name Main
extends Node2D

const DEFAULT_PORT: int = 8080

# Server
var server := WebSocketServer.new()

# peers: Dictionary[int, Peer]
var peers: Dictionary = {}

# Level
var level: Level

# Used for scheduling a stop of the server at a given time.
var stop_scheduled: StopScheduled = null

func _ready():
    # Catch command-line arguments
    var arguments := OS.get_cmdline_user_args()
    var argument_count := arguments.size()

    # Initialize level
    level = Level.new(self.server, self.peers)
    self.add_child(level)

    # Initialize server
    var port := DEFAULT_PORT if argument_count == 0 or arguments[0].is_empty() else int(arguments[0])
    self.server.listen(port)
    self.add_child(self.server)
    print("Listening in ws://127.0.0.1:" + str(port))

    # When a client connects to the server
    self.server.client_connected.connect(func(peer_id: int):
        var peer := Peer.new(peer_id)
        self.peers[peer_id] = peer)
    
    # When a client disconnects from the server
    self.server.client_disconnected.connect(func(peer_id: int):
        var peer := self.peers[peer_id] as Peer
        peer.car.get_parent().remove_child(peer.car)
        self.peers.erase(peer_id)
        if self.peers.is_empty():
            self.stop_scheduled = StopScheduled.now())

    # For every message
    self.server.message_received.connect(func(peer_id: int, message_1):
        if typeof(message_1) != TYPE_STRING:
            return

        # Parse JSON message
        var message = JSON.parse_string(str(message_1))

        # Get peer
        var peer := self.peers[peer_id] as Peer

        # Handle it
        self.handle_client_message(peer, message))

func handle_client_message(peer: Peer, message: Variant):
    match message.type:
        # Spawn car
        "Spawn":
            if peer.car == null:
                peer.car = Car.new()
                peer.car.position = Vector2(0, 0)
                self.level.add_child(peer.car)

        # Update moving directions
        "MovingDirections":
            peer.car.should_move = message.up or message.down or message.left or message.right

            var next_direction := CarDirection.from_arrows(message.left, message.right, message.up, message.down)
            if next_direction != null and peer.car.direction != next_direction:
                peer.car.direction = next_direction
                peer.car.turn.turn_start(next_direction)

func _process(_delta: float):
    # Stop server. This is mainly used for maintenance mode and
    # stopping server on inactivity.
    if self.stop_scheduled != null and self.stop_scheduled.should_stop():
        self.server.stop()
        self.get_tree().quit()

## Use `StopScheduled` to stop the server at a given time ahead. 
class StopScheduled:
    var epoch_seconds: float

    func _init(epoch_seconds: float):
        self.epoch_seconds = epoch_seconds
    
    static func now() -> Main.StopScheduled:
        return Main.StopScheduled.new(Time.get_unix_time_from_system())

    func should_stop() -> bool:
        return Time.get_unix_time_from_system() >= self.epoch_seconds
