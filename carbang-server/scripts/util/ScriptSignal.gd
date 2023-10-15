class_name ScriptSignal

static func define_signal(script_arg: GDScript, name) -> Signal:
    (script_arg as Object).add_user_signal(name)
    return Signal(script_arg, name)