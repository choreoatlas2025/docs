---
sidebar_position: 2
---

# Installationsanleitung

Diese Seite bietet verschiedene Installationsmethoden für die ChoreoAtlas CLI. Wählen Sie die für Ihre Umgebung am besten geeignete Installationsmethode.

## 🍺 Homebrew (Empfohlen)

Die bequemste Installationsmethode für macOS- und Linux-Benutzer:

```bash
# ChoreoAtlas Homebrew Tap hinzufügen
brew tap choreoatlas2025/tap

# ChoreoAtlas CLI installieren
brew install choreoatlas

# Installation verifizieren
choreoatlas version
```

### Version aktualisieren

```bash
brew upgrade choreoatlas
```

## 🐳 Docker

Keine lokale Installation erforderlich, geeignet für containerisierte Umgebungen oder temporäre Nutzung:

```bash
# Neueste Version ausführen
docker run --rm choreoatlas/cli:latest version

# Praktischen Alias erstellen
echo 'alias choreoatlas="docker run --rm -v \$(pwd):/workspace choreoatlas/cli:latest"' >> ~/.bashrc
source ~/.bashrc

# Alias verwenden
choreoatlas validate --help
```

### Docker Image-Versionen

- `choreoatlas/cli:latest` - Neueste stabile Version
- `choreoatlas/cli:v0.1.2` - Spezifische Version
- `ghcr.io/choreoatlas2025/cli:latest` - GitHub Container Registry

## 📦 Vorkompilierte Binärdateien

Vorkompilierte Binärdateien direkt von GitHub Releases herunterladen:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="linux" label="Linux" default>

```bash
# Architektur automatisch erkennen und herunterladen
curl -L "https://github.com/choreoatlas2025/cli/releases/latest/download/choreoatlas-linux-$(uname -m).tar.gz" | tar xz

# In PATH verschieben
sudo mv choreoatlas /usr/local/bin/
chmod +x /usr/local/bin/choreoatlas

# Installation verifizieren
choreoatlas version
```

  </TabItem>
  <TabItem value="macos" label="macOS">

```bash
# Intel Mac
curl -L "https://github.com/choreoatlas2025/cli/releases/latest/download/choreoatlas-darwin-amd64.tar.gz" | tar xz

# Apple Silicon Mac
curl -L "https://github.com/choreoatlas2025/cli/releases/latest/download/choreoatlas-darwin-arm64.tar.gz" | tar xz

# In PATH verschieben
sudo mv choreoatlas /usr/local/bin/
chmod +x /usr/local/bin/choreoatlas

# Installation verifizieren
choreoatlas version
```

  </TabItem>
  <TabItem value="windows" label="Windows">

1. Besuchen Sie [GitHub Releases](https://github.com/choreoatlas2025/cli/releases/latest)
2. Laden Sie `choreoatlas-windows-amd64.zip` herunter
3. Entpacken Sie und fügen Sie `choreoatlas.exe` zu PATH hinzu

Oder verwenden Sie PowerShell:

```powershell
# In aktuelles Verzeichnis herunterladen und entpacken
Invoke-WebRequest -Uri "https://github.com/choreoatlas2025/cli/releases/latest/download/choreoatlas-windows-amd64.zip" -OutFile "choreoatlas.zip"
Expand-Archive -Path "choreoatlas.zip" -DestinationPath "."

# Installation verifizieren
.\choreoatlas.exe version
```

  </TabItem>
</Tabs>

## 📋 Systemanforderungen

### Mindestanforderungen
- **Betriebssystem**: Linux, macOS, Windows
- **Architektur**: amd64, arm64
- **Arbeitsspeicher**: 64MB RAM
- **Speicher**: 20MB verfügbarer Speicherplatz

### Empfohlene Konfiguration
- **Arbeitsspeicher**: 256MB+ RAM (für die Verarbeitung großer Trace-Dateien)
- **CPU**: 2+ Kerne (parallele Validierung)
- **Speicher**: 100MB+ (Cache und Berichte)

## 🔧 Konfiguration verifizieren

Nach der Installation, verifizieren Sie, ob die CLI korrekt konfiguriert ist:

```bash
# Versionsinformationen prüfen
choreoatlas version

# Verfügbare Befehle prüfen
choreoatlas --help

# Docker-Integration verifizieren (falls Docker verwendet wird)
docker run --rm choreoatlas/cli:latest --help
```

Erwartete Ausgabe:
```
ChoreoAtlas CLI v0.1.2
Built with Go 1.21, commit abc1234
Edition: ce
Platform: darwin/arm64
```

## 🏢 Unternehmensinstallation

### Private Image-Registry

Für Unternehmensumgebungen können Sie Docker-Images in eine private Registry pushen:

```bash
# Öffentliches Image pullen
docker pull choreoatlas/cli:latest

# Für private Registry neu taggen
docker tag choreoatlas/cli:latest your-registry.com/choreoatlas/cli:latest

# In private Registry pushen
docker push your-registry.com/choreoatlas/cli:latest
```

### Offline-Installationspakete

Die Pro Privacy Version bietet vollständig offline Installationspakete, die enthalten:
- Vorkompilierte Binärdateien
- Alle Abhängigkeiten und Ressourcen
- Offline-Verifizierung und Lizenzdateien
- SBOM und Signaturverifizierung

Kontaktieren Sie [enterprise@choreoatlas.com](mailto:enterprise@choreoatlas.com) für Offline-Installationspakete.

## 🔒 Sicherheitsverifizierung

Alle von ChoreoAtlas veröffentlichten Binärdateien sind digital signiert, Sie können die Integrität verifizieren:

```bash
# Checksummen-Datei herunterladen
curl -L "https://github.com/choreoatlas2025/cli/releases/latest/download/checksums.txt" -o checksums.txt

# Heruntergeladene Datei verifizieren (Linux/macOS)
sha256sum -c checksums.txt

# SBOM (Software Bill of Materials) anzeigen
curl -L "https://github.com/choreoatlas2025/cli/releases/latest/download/choreoatlas.spdx.json"
```

### Cosign Signaturverifizierung

```bash
# Cosign installieren
go install github.com/sigstore/cosign/v2/cmd/cosign@latest

# Container-Image-Signatur verifizieren
cosign verify choreoatlas/cli:latest --certificate-identity-regexp=".*" --certificate-oidc-issuer-regexp=".*"
```

## ❓ Fehlerbehebung

### Häufige Probleme

**Problem**: `command not found: choreoatlas`
**Lösung**: Stellen Sie sicher, dass die Binärdatei im PATH ist, oder führen Sie sie mit vollständigem Pfad aus

**Problem**: Docker Zugriff verweigert
**Lösung**: Stellen Sie sicher, dass der Benutzer in der `docker`-Gruppe ist, oder verwenden Sie `sudo`

**Problem**: macOS Sicherheitswarnung
**Lösung**: Führen Sie `sudo xattr -d com.apple.quarantine /usr/local/bin/choreoatlas` aus

### Hilfe erhalten

Falls Sie Installationsprobleme haben:

1. Durchsuchen Sie [GitHub Issues](https://github.com/choreoatlas2025/cli/issues)
2. Besuchen Sie [GitHub Discussions](https://github.com/choreoatlas2025/cli/discussions)
3. Kontaktieren Sie den technischen Support: [support@choreoatlas.com](mailto:support@choreoatlas.com)

## 🚀 Nächste Schritte

Nach der Installation, fahren Sie fort mit:
- [Schnellstart](./quickstart.md) - Führen Sie Ihre erste Validierung durch
- [Kernkonzepte](./concepts/dual-contracts.md) - Erfahren Sie mehr über die Dual-Contract-Architektur

---

<div className="callout success">
  <p><strong>✅ Installation erfolgreich!</strong></p>
  <p>Sie haben nun die ChoreoAtlas CLI installiert und können mit der Contract-as-Code-Microservice-Governance beginnen. Es wird empfohlen, zuerst die <a href="https://github.com/choreoatlas2025/quickstart-demo">Quickstart Demo</a> auszuführen, um ein direktes Verständnis zu erhalten.</p>
</div>