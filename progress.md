# Progress — honest

Branch `agent/playable-session`. Not a release.

Also on this branch:
- Ghost frames carry the race clock. Five seconds into a ten-second recording samples the middle, and playback lasts as long as the recording, not `count * 0.16`.
- Replay uses the same clock. Rewind drops frames newer than the restored time.

Not done: browser `qa:drive`, the 60 contract failures, devices, Alpha through release.
