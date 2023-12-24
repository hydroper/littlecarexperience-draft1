# Little Car Experience (draft 1)

A failure by @hydroper on trying to develop a massive multiplayer game with the following technologies:

* Front-end
  * Next.js
  * Two.js
* Backend
  * Godot Engine

There are certain troubles to handle with this technology combination:

* WebSocket — something strange to do with the peer dictionary is going on in the Godot Engine backend.
* The Two.js rendering library's API is not rich in options.
* The Godot Engine's physics simulation is not coherent to the goal physics.

Alternative technologies considered:

* Front-end
  * Pixi.js rendering library — it had a bug that cutted the player off the stage, thus discarded.

## License

Apache License 2.0
