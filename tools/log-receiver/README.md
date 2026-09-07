# JLR-HU log receiver

This service receives batched application logs from JLR-HU at `POST /logs` and stores them as daily JSONL files under `received-logs/`.

The Docker host must own the LAN address `192.168.0.3`. The container uses Linux host networking, so Docker does not create a bridge network or consume an address pool. Start the receiver with:

```sh
docker compose up -d --build
```

To choose a different listening port, run:

```sh
PORT=5000 docker compose up -d --build
```

The JLR-HU client always uses `http://192.168.0.3:4318/logs`, so run this receiver on port `4318` when collecting logs from the app.

or with Docker directly:

```sh
docker build -t jlr-hu-log-receiver .
docker run -d --name jlr-hu-log-receiver --restart unless-stopped --network host -e LISTEN_ADDRESS=192.168.0.3 -e PORT=4318 -v "$PWD/received-logs:/data" jlr-hu-log-receiver
```

With host networking there is deliberately no `-p` mapping: the process listens directly on `192.168.0.3:$PORT`.

Check it with:

```sh
curl http://192.168.0.3:4318/health
```

Follow the receiver output with:

```sh
docker compose logs -f
```

JLR-HU automatically forwards its enabled class logs only while its current Wi-Fi SSID is exactly `RandB`. No authentication is used, so expose port 4318 only on the trusted vehicle network.
