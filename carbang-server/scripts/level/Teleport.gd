# Represents a teleport destination.
# Levels can have sublevels, therefore
# they are referred by slash-delimited paths.
class_name Teleport

# Coordinates at which to teleport.
var destination_position: Vector2 = Vector2.ZERO

# Level path delimited by slashes.
var destination_level_path: String = ""

# Server ID. If empty, the teleport occurs at the same server.
var destination_server: String = ""

# If specified and both `destination_level_path`
# and `destination_server` are omitted,
# then this property identifies a game mode
# to lookup for an recommended server to teleport to.
# It could be `"ufc"` or
# `"racing"`, for example.
var destination_mode: String = ""