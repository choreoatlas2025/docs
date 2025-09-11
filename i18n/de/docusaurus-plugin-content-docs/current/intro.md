---
sidebar_position: 1
slug: /
---

# ChoreoAtlas CLI Einführung

Willkommen bei **ChoreoAtlas CLI** - der Contract-as-Code Governance-Plattform für serviceübergreifende Orchestrierung.

## Was ist ChoreoAtlas?

ChoreoAtlas implementiert eine Dual-Contract-Architektur und bietet semantische und temporale Validierung für Microservice-Orchestrierung:

- **ServiceSpec Contract**: Definiert Operationsspezifikationen, Vorbedingungen und Nachbedingungen für jeden Service
- **FlowSpec Contract**: Definiert Schrittsequenzen und Datenfluss für serviceübergreifende Orchestrierung

## Kernfunktionen

### 🔍 Atlas Scout (Erkundung)
Automatische Generierung von Initial-Contracts aus echten Ausführungstraces zur schnellen Etablierung von Service-Spezifikationen.

### ✅ Atlas Proof (Verifikation)  
Validierung der Übereinstimmung zwischen FlowSpec-Orchestrierung und tatsächlichen Ausführungstraces zur Sicherstellung der Konsistenz zwischen Design und Implementierung.

### 🧭 Atlas Pilot (Leitfaden)
Statische Validierung der Contract-Konsistenz zur Erkennung von Service-Referenzfehlern und Variablenabhängigkeitsproblemen.

## Schnellstart

```bash
# ChoreoAtlas CLI installieren
curl -sSL https://choreoatlas.io/install.sh | bash

# Installation verifizieren
ca version

# Beispiel ausführen
ca validate --flow examples/order.flowspec.yaml \
           --trace examples/order.trace.json
```

## Unterstützte Versionen

- **Community Edition (CE)**: Vollständig kostenlos für einzelne Entwickler und kleine Teams
- **Professional Edition (Pro)**: Enterprise-Funktionen mit erweiterten Baselines und Team-Kollaboration
- **Cloud Edition**: Verwalteter Service mit Web-Konsole und kontinuierlicher Überwachung