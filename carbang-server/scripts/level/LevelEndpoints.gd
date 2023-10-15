# The endpoints of a level are either a) points that a
# player cannot pass through at the same coordinates
# or b) points that once the car fully passes through
# cause a teleport.
#
# Endpoints also set limit to the camera.
#
class_name LevelEndpoints

var left: Teleport = null
var right: Teleport = null
var top: Teleport = null
var bottom: Teleport = null