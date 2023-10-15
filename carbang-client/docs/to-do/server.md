# Server

- The server runs one simulation per level.
- https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking
  - [ ] The game tracks coordinates from the single physics reference frame from the server at a high frequency. The level is only effectively displayed while connection to the server is stable.
- [ ] A server runs a single level, however a server in the server manager covers multiple levels to teleport to. In other words, a server consists of subservers.