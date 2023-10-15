# The endpoints of a level are either a) points that a
# player cannot pass through at the same coordinates
# (if `teleport` is null) or b) points that once the car
# fully passes through cause a teleport
# (if `teleport` is not null).
#
# Endpoints also set limit to the camera.
#
class_name LevelEndpoint

var vector: Vector2 = Vector2.ZERO
var teleport: Teleport = null