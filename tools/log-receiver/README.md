# JLR-HU log receiver

This service receives batched application logs from JLR-HU at `POST /logs` and stores them as daily JSONL files under `received-logs/`.

The Docker host must own the LAN address `192.168.0.3`. Start the receiver with:

```sh
docker compose up -d --build
```

Check it with:

```sh
curl http://192.168.0.3:4318/health
```

Follow the receiver output with:

```sh
docker compose logs -f
```

JLR-HU automatically forwards its enabled class logs only while its current Wi-Fi SSID is exactly `RandB`. No authentication is used, so expose port 4318 only on the trusted vehicle network.
