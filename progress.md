# Progress — honest

Branch `agent/playable-session`. Not a release.

Also on this branch:
- Cars more than 4 m apart in height do not collide. Checked: a car 40 m up is ignored; a car beside you is still pushed.
- Overtake cash and speed-camera fines sit in a race ledger. Rewind restores that ledger. The wallet is written once at the result, and a void result keeps only fines.
- The player's saved damage is not wiped when the grid is placed.

Not done: browser `qa:drive`, the 60 contract failures, devices, Alpha through release.
