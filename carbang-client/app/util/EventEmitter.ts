/**
 * An event emitter. Every listener of the event
 * is invoked by insertion order.
 */
export class EventEmitter<T> {
    private readonly _listeners: ((event: T) => void)[] = [];

    listen(listenerFn: (event: T) => void) {
        if (this._listeners.indexOf(listenerFn) == -1) {
            this._listeners.push(listenerFn);
        }
        return new EventListener(this, listenerFn);
    }

    stop(listener: (event: T) => void) {
        const i = this._listeners.indexOf(listener);
        if (i != -1) {
            this._listeners.splice(i, 1);
        }
    }

    emit(event: T) {
        for (const listener of this._listeners) {
            listener(event);
        }
    }
}

/**
 * An event listener obtained from an `EventEmitter`.
 */
export class EventListener<T> {
    constructor(private readonly base: EventEmitter<T>, private readonly listener: (event: T) => void) {}

    remove() {
        this.base.stop(this.listener);
    }
}