class_name Level
extends Node2D

var _server: WebSocketServer

# _peers: Dictionary[int, Peer]
var _peers: Dictionary = {}

func _init(server: WebSocketServer, peers: Dictionary):
    self._server = server
    self._peers = peers

func _process(_delta: float):
    # Send the world to every peer
    var world_json := JSON.stringify({
        type = "World",
        world = self._get_world_json(self._peers),
    })
    for peer_id in self._peers:
        self._server.send(peer_id, world_json)

# Returns a serializable form of the worldd
func _get_world_json(peers: Dictionary) -> Dictionary:
    var entities = []
    for peer_id in peers:
        var peer = peers[peer_id] as Peer
        if peer.car == null:
            continue
        var position = peer.car.position
        entities.append({
            type = "Car",
            x = position.x,
            y = position.y,
            rotationRadians = peer.car.rotation,
        })
    return {
        entities = entities
    }
