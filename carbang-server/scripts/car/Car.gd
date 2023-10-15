class_name Car
extends RigidBody2D

const MOVE_SPEED: float = 1500

# Player ID
var player_id: PlayerId = null

# Whether to move the car
var should_move: bool = false

# Turn direction
var turn: CarTurn = null
var _direction: CarDirection = CarDirection.DOWN
var direction: CarDirection:
    get:
        return self._direction
    set(value):
        if self._direction == value:
            return
        self._direction = value
        self.turn.turn_start(self._direction)
func set_immediate_direction(direction: CarDirection) -> void:
    self.direction = CarDirection.RIGHT
    self.rotation_degrees = self.direction.angle

func _init():
    self.turn = CarTurn.new(self, 5)
    self.lock_rotation = true
    self._build_shape()

# Determine movement force
var movement_force: Vector2:
    get:
        if not self.should_move:
            return Vector2.ZERO
        var dir: CarDirection = self._direction
        var vx: float = MOVE_SPEED
        var vy: float = MOVE_SPEED
        if dir == CarDirection.LEFT or dir == CarDirection.RIGHT:
            vy /= 2
        elif dir == CarDirection.UP or dir == CarDirection.DOWN:
            vx /= 2
        var rotation_radians: float = deg_to_rad(self.rotation_degrees)
        return Vector2(-sin(rotation_radians) * vx, cos(rotation_radians) * vy)

func _build_shape():
    var collision_shape := CollisionShape2D.new()
    var rectangle := RectangleShape2D.new()
    rectangle.size = Vector2(80, 160)
    collision_shape.shape = rectangle
    # collision_shape.position = -(rectangle.size / 2)
    self.add_child(collision_shape)

func _integrate_forces(state: PhysicsDirectBodyState2D):
    self._turn_car(state)
    self._apply_max_speed()

func _process(_delta: float):
    self._move_forward()
    self._default_direction_on_idle()

func _default_direction_on_idle():
    if self.should_move:
        return
    if self._direction == CarDirection.UP_LEFT or self._direction == CarDirection.DOWN_LEFT:
        self.direction = CarDirection.LEFT
    elif self._direction == CarDirection.UP_RIGHT or self._direction == CarDirection.DOWN_RIGHT:
        self.direction = CarDirection.RIGHT

func _turn_car(state: PhysicsDirectBodyState2D) -> void:
    self.turn.integrate_forces(state)

# Deceleration of inactive direction
const DECEL: float = 12

# Deceleration of the opposite side in the same axis
const OPPOSITE_DECEL: float = DECEL - DECEL / 3

# Deceleration used when car does not move
const IMMEDIATE_DECEL: float = DECEL - DECEL / 6

func _apply_max_speed() -> void:
    # state.linear_velocity.x = clampf(state.linear_velocity.x, -MAX_SPEED, MAX_SPEED)
    # state.linear_velocity.y = clampf(state.linear_velocity.y, -MAX_SPEED, MAX_SPEED)

    # If not moving, deaccelerate immediately
    if not self.should_move:
        self.linear_velocity -= self.linear_velocity / IMMEDIATE_DECEL
        return

    var v := self.linear_velocity
    match self._direction:
        CarDirection.LEFT:
            self.linear_velocity.x -= v.x / OPPOSITE_DECEL if v.x > 0 else 0.0
            self.linear_velocity.y -= v.y / DECEL
        CarDirection.RIGHT:
            self.linear_velocity.x -= v.x / OPPOSITE_DECEL if v.x < 0 else 0.0
            self.linear_velocity.y -= v.y / DECEL
        CarDirection.UP:
            self.linear_velocity.x -= v.x / DECEL
            self.linear_velocity.y -= v.y / OPPOSITE_DECEL if v.y > 0 else 0.0
        CarDirection.DOWN:
            self.linear_velocity.x -= v.x / DECEL
            self.linear_velocity.y -= v.y / OPPOSITE_DECEL if v.y < 0 else 0.0

func _move_forward() -> void:
    self.apply_central_force(self.movement_force)
