class_name ArrayUtil

static func remove_by_predicate(array: Array, predicate_fn: Callable):
    var i: int = 0
    var m := false
    for w in array:
        if predicate_fn.call(w):
            m = true
            break
        i += 1
    if m:
        array.remove_at(i)
