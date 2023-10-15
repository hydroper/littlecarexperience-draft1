import { EventEmitter } from "@/app/util/EventEmitter";
import clonePlainObject from "@/app/util/clonePlainObject";
import { InputActionAtom, InputActionKey, InputActionKeyName, navigatorKeyToThis } from "./InputAction";
import assert from "assert";

/**
 * Mechanism for handling user input actions,
 * including map of input actions and listening
 * to input actions.
 * 
 * # Getting started
 * 
 * The following code demonstrates using arrows and WASD keys
 * for entity movement:
 * 
 * ```
 * import { Input } from "com.hydroper.gamesec.client";
 * 
 * // Set the static input map
 * Input.setMap({
 *     "moveLeft": [
 *         { key: "a" },
 *         { key: "leftArrow" },
 *     ],
 *     "moveRight": [
 *         { key: "d" },
 *         { key: "rightArrow" },
 *     ],
 *     "moveUp": [
 *         { key: "w" },
 *         { key: "upArrow" },
 *     ],
 *     "moveDown": [
 *         { key: "s" },
 *         { key: "downArrow" },
 *     ],
 * });
 * 
 * // When any input is pressed
 * Input.onInputPressed.listen(() => {
 *     const shouldMoveRight = Input.isPressed("moveRight");
 * });
 * ```
 * 
 * # Built-in actions
 * 
 * The following actions are pre-defined in every map
 * and can be overriden:
 * 
 * * `uiLeft` — Used for focusing the left neighbor of a UI control.
 * * `uiRight` — Used for focusing the right neighbor of a UI control.
 * * `uiUp` — Used for focusing the top neighbor of a UI control.
 * * `uiDown` — Used for focusing the bottom neighbor of a UI control.
 */
export default class Input {
    /**
     * When the static input map is updated through
     * the static `setMap` method.
     */
    static readonly onMapUpdate = new EventEmitter<void>();

    // Static input map
    private static mMap: Record<string, InputActionAtom[]> = {
        ...Input.builtin(),
    };

    /**
     * Returns the actual input map in read-only mode.
     */
    static getMap(): Record<string, InputActionAtom[]> {
        return clonePlainObject(Input.mMap, true);
    }

    /**
     * Updates the static input map.
     */
    static setMap(map: Record<string, InputActionAtom[]>) {
        // Update static map
        Input.mMap = {
            ...Input.builtin(),
            ...clonePlainObject(map, true),
        };

        // Emit update event
        this.onMapUpdate.emit(undefined);
    }

    private static builtin(): Record<string, InputActionAtom[]> {
        return {
            "uiLeft": [ { key: "leftArrow" } ],
            "uiRight": [ { key: "rightArrow" } ],
            "uiUp": [ { key: "upArrow" } ],
            "uiDown": [ { key: "downArrow" } ],
        };
    }

    // Static pressed state pool
    private static readonly mPressedStatePoolKeys: Map<InputActionKeyName, PressedState> = new Map();

    /**
     * When user input starts being pressed or is continuously
     * pressed.
     */
    static readonly onInputPressed = new EventEmitter<void>();

    /**
     * When an input ends being pressed.
     */
    static readonly onInputUp = new EventEmitter<void>();

    static {
        window.addEventListener("keydown", evt => {
            const keyName = navigatorKeyToThis(evt.key);
            if (keyName !== undefined) {
                // Mutate pressed state
                let state = Input.mPressedStatePoolKeys.get(keyName);
                if (state === undefined) {
                    state = {
                        pressed: false,
                        control: false,
                        shift: false,
                        alt: false,
                    };
                    Input.mPressedStatePoolKeys.set(keyName, state);
                }
                state.pressed = true;
                state.control = evt.ctrlKey;
                state.shift = evt.shiftKey;
                state.alt = evt.altKey;

                // Emit pressed event
                Input.onInputPressed.emit(undefined);
            }
        });

        window.addEventListener("keyup", evt => {
            const keyName = navigatorKeyToThis(evt.key);
            if (keyName !== undefined) {
                // Mutate pressed state
                let state = Input.mPressedStatePoolKeys.get(keyName);
                if (state === undefined) {
                    state = {
                        pressed: false,
                        control: false,
                        shift: false,
                        alt: false,
                    };
                    Input.mPressedStatePoolKeys.set(keyName, state);
                }
                state.pressed = false;
                state.control = false;
                state.shift = false;
                state.alt = false;

                // Emit input up event
                Input.onInputUp.emit(undefined);
            }
        });
    }

    /**
     * Determines whether an action is pressed.
     * @throws Error Thrown if the action does not exist.
     */
    static isPressed(name: string): boolean {
        const action = Input.mMap[name];
        assert(action !== undefined, "The specified action for Input.isPressed(name) does not exist.");
        for (const item of action!) {
            if (item.hasOwnProperty("key")) {
                const inputActionKey = item as InputActionKey;
                const pressedState = Input.mPressedStatePoolKeys.get(inputActionKey.key);
                const pressed = pressedState !== undefined && pressedState.pressed
                    && (inputActionKey.control ? pressedState.control : !pressedState.control)
                    && (inputActionKey.shift ? pressedState.shift : !pressedState.shift)
                    && (inputActionKey.alt ? pressedState.alt : !pressedState.alt);
                if (pressed) {
                    return true;
                }
            }
        }
        return false;
    }
}

type PressedState = {
    pressed: boolean,
    control: boolean,
    shift: boolean,
    alt: boolean,
};