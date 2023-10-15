# Connection and account

## Account creation

- [ ] Creating a new account first requires passing through a third-party service authentication (typically Google) and then an initial password.

## Restrictions

- [ ] A player cannot have more than one session of the same account at the same time.
- [ ] Maintenance mode

## Server connection

- [ ] Servers must execute on demand and a server must finalize once all of its connected peers disconnect by querying on the database. Currently a direct socket connection is occurring. Furthermore, once a server turns off, it has a world serialization phase to keep the last world state once it runs again (this is only done if the level turns off _Reset state on inactivity_).