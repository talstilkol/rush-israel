# Progress — honest

Branch `agent/playable-session`. Not a release.

Also on this branch:
- Driving input is sampled once per physics tick, with that tick's dt. The picture and the QA hook read the snapshot instead of sampling again.
- A frame that cannot catch up marks the run void, drops the leftover time, and the HUD says the record will not be saved.

Not done: browser `qa:drive`, the 60 contract failures, devices, Alpha through release.
