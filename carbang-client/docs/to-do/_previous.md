# To-do

## Current mind

The gameplay avoids UI intensively; it's straight to play. The game starts in the index level with direct teleport to game modes leading to actual servers.

- [ ] The initial index level features a text in the floor recommending to type `/setup`. The UI should prompt to enter an unique username.
- [ ] The index level isn't multiplayer.

Other tasks:

- [ ] Update the entry point to load the player and their index level.
- [ ] Cleanup entities from the game scene (just remove the walls there)

## Logon

The logon will be implemented as a separate app that launches the game in-cloud. It'll ask for a form of signing into the account and require a purchase license.

The game is launched with a session token as first command line argument. If it's empty, a simple log on screen for debugging should appear.

## Environment variables

Any server settings should stay in the `Env` singleton.

## Settings

All game settings are attached to the player account, not the computer running the game, considering the game is cloud-exclusive.

## Database

- Player
  - No password? Then, it's randomized and a column `no_password` is set to true. This is the case for accounts coming from gaming stores. The password can be set later in these cases.

## Chat

- [x] The chat button at the top-right of the game screen should open the chat.
- [x] Pressing enter should open the chat, focusing the input.
- [ ] Commands
  - [ ] `/setup`: initial setup.
  - [ ] `/index`: exits to the index level.
  - [ ] `/<mode>`: connects to a recommended server of the specified mode (like `/ufc` or `/racing`).
- [ ] Command suggestions while typing
- [ ] Escape any chat message sent by the player due to BBCode

## Car

- [ ] Clicking someone could open a simple context to access profile.
- [ ] Improve drift radius
  - https://math.stackexchange.com/a/4760966/1187968
- [x] Camera offset tweening

## Text area

- [ ] All text areas are subtype of `CloudTextArea`.

## Text input

- [ ] All texts inputs are subtype of either `CloudTextInput` or the single-line version.
  - [ ] If the game is running in the cloud, delegate input to the player's device until the input is unfocused. Just use a singleton for this.
    - If the player's device is in touch-only mode, the frontend should show a text over the on-screen keyboard.

## Level designer

Accessibility tasks:

- [ ] Level boundaries
- [ ] Establish limit of number of objects
- [ ] Establish limit of number of text characters per text property
- [ ] View
  - [ ] Entities, floors, hit test areas, teleport areas, buildings
  - [ ] Checkbox to turn on or off all of these checkboxes
- [ ] Undo/redo
- [ ] Drag-n-drop
- [ ] Delete

Other tasks:

- [ ] Teleport characteristic: invisible, portal, linear.
- [ ] Entities
- [ ] Floors
- [ ] Buildings
  - [ ] Signs
- [ ] Hit test areas
- [ ] Teleport areas
  - [ ] A teleport area teleports to either another level, a specific server or random competition server (UFC, racing etc.).
- [ ] Manage multiple levels
- [ ] Specify script

## Level state

Serialization of the current level state is needed due to players entering or exiting a level. Levels retain state and can also choose to optionally reset state on inactivity.

When a player enters a level, one of the following happens:

- If the level is being visited for the first time, its initial state from the level designer is constructed and a script event `onFirstVisit` runs. A level may inclusively empty the number of visits once all visitors leave by turning on _Reset when inactive_, which also allows the `onFirstVisit` event to run again.
- If the level has at least one visitor, the state from any of the visitors is serialized and sent to the other player.
- If the level has no visitor, but has already been visited, the last state is deserialized.

Level state is serialized by iterating all floors and entities and serializing each of them.

## Level

- Floors are placed freely similiar to objects and do not affect any entity. Level interactions can remove a floor. There are large and smaller floors. Large floors are preferred to minimize the map. Floors have an optional label such that a script can manipulate such floor.
- Hit test areas are level elements.

## Maintenance mode

- [ ] Implement maintenance mode and server warnings for shutdown.

## Issues to solve

- [ ] HUD over the other UI