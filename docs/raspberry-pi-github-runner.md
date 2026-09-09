# Raspberry Pi GitHub Actions release runner

The ARM Linux release workflow runs only on a self-hosted ARM64 Linux runner carrying the custom label `jlr-hu-builder`. It creates an ARM64 AppImage and attaches it to a GitHub release.

## Raspberry Pi prerequisites

Use a 64-bit Raspberry Pi OS installation. On the Pi, install the build and release dependencies:

```bash
sudo apt update
sudo apt install -y build-essential python3 make g++ git curl gh libudev-dev libusb-1.0-0-dev libgpiod-dev
```

Confirm that the operating system is ARM64:

```bash
uname -m
```

The result must be `aarch64`. Do not run the GitHub runner as root.

## Register the runner

1. Open the JLR-HU repository on GitHub.
2. Go to **Settings → Actions → Runners**.
3. Select **New self-hosted runner**, then choose **Linux** and **ARM64**.
4. Run the download and extraction commands GitHub displays. They contain the current runner version and should be used instead of a hard-coded download URL.
5. When GitHub tells you to run `config.sh`, add the dedicated label:

```bash
./config.sh --url https://github.com/rhysmorgan134/JLR-HU --token YOUR_TEMPORARY_REGISTRATION_TOKEN --labels jlr-hu-builder --name jlr-hu-pi-builder --work _work
```

The registration token is short-lived. Generate it from the **New self-hosted runner** page immediately before running the command.

Test the runner interactively:

```bash
./run.sh
```

Stop it with Ctrl+C after GitHub shows the runner as **Idle**. Install it as a system service so it survives reboots:

```bash
sudo ./svc.sh install
sudo ./svc.sh start
sudo ./svc.sh status
```

## SocketMost repository access

The workflow checks out `rhysmorgan134/SocketMost` and packages it locally because JLR-HU currently uses a local `../os8104New` SocketMost checkout during development.

If SocketMost is public, no additional configuration is required. If it is private, create a fine-grained personal access token with read-only **Contents** access to SocketMost, then add it to the JLR-HU repository under **Settings → Secrets and variables → Actions** as:

```text
SOCKETMOST_REPO_TOKEN
```

Do not place that token in the repository or in the runner's shell profile.

## Create a release

Push a version tag:

```bash
git tag v0.0.1-alpha.6
git push origin v0.0.1-alpha.6
```

The workflow checks out that exact tag, temporarily applies its version to `package.json`, builds the ARM64 AppImage, calculates its SHA-256 checksum, and publishes both files on the matching GitHub release.

You can rerun an existing tag from **Actions → Release ARM Linux AppImage → Run workflow**. Enter the existing tag; the workflow replaces the release assets with the newly built files.

## Runner security

Keep the Pi runner dedicated to repositories you control. The release workflow deliberately does not run for pull requests, so untrusted pull-request code cannot automatically execute on the Pi.
