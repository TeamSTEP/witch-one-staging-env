# Witch One P2P Web Staging Environment

This is a server function that controls the web-based staging environment for Witch One.
Because our game uses a custom web interface at the moment, it is challenging to distribute and test the game on the fly with multiple clients.
This server app acts as a helper that enumerates all the builds that are stored in a remote storage bucket and serves it to a web interface that is recognizable by [React Unity WebGL](https://react-unity-webgl.dev/) or any other Unity WebGL interface.
