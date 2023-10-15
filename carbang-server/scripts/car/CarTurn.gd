class_name CarTurn

# Turn radius in degrees
var turn_radius: float

var _rigid_body: RigidBody2D = null
var _running: bool = false
var _target_angle: float = 0

# Result from RotationUtil.goes_clockwise_and_delta()
var _rotation_route := RotationGoesClockwiseAndDelta.new()

var _current_rotation: float:
    get:
        return fmod(RotationUtil.zero_to_360(self._rigid_body.rotation_degrees), 360)

func _init(rigid_body: RigidBody2D, turn_radius: float):
    self._rigid_body = rigid_body
    self.turn_radius = turn_radius

func turn_start(direction: CarDirection) -> void:
    self._target_angle = direction.angle
    self._running = true

func integrate_forces(state: PhysicsDirectBodyState2D) -> void:
    if not self._running:
        return

    var current_rotation = self._current_rotation
    if current_rotation == self._target_angle:
        self._running = false
        state.angular_velocity = 0
        return

    RotationUtil.goes_clockwise_and_delta(self._target_angle, current_rotation, self._rotation_route)

    var route_delta = self._rotation_route.minimum_delta
    state.angular_velocity = (1.0 if (route_delta <= 3 and self.turn_radius > 1.0) else self.turn_radius) * self._rotation_route.increment_scale
