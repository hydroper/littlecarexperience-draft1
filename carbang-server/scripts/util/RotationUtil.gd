class_name RotationUtil

# Places rotation angle into the range 0-360.
static func zero_to_360(angle: float) -> float:
    return 360 - fmod(-angle, 360.0) if angle < 0 else fmod(angle, 360.0)

static func delta(a: float, b: float) -> float:
    var ab := a - b
    ab = ab + 360 if ab < 0 else ab
    return ab

static func goes_clockwise_and_delta(target_rotation: float, current_rotation: float, output: RotationGoesClockwiseAndDelta) -> void:
    var a := target_rotation
    var b := current_rotation
    var ab := delta(a, b)
    var ba := delta(b, a)
    var goes_clockwise := ab < ba

    # return [goes_clockwise, ab if goes_clockwise else ba]
    output.goes_clockwise = goes_clockwise
    output.minimum_delta = roundf(ab if goes_clockwise else ba)
