# Result from RotationUtil.goes_clockwise_and_delta
class_name RotationGoesClockwiseAndDelta

var goes_clockwise: bool = false
var minimum_delta: float = 0

var increment_scale: float:
    get:
        return 1.0 if self.goes_clockwise else -1.0
