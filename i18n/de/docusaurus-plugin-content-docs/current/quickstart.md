---
sidebar_position: 3
---

# Schnellstart

Mit dieser 15-minütigen Schnellanleitung lernen Sie die Kernfunktionen der ChoreoAtlas CLI: Verträge aus Trace-Daten entdecken, Service-Choreographien validieren und Analyseberichte generieren.

## 🎯 Lernziele

Nach Abschluss dieser Anleitung können Sie:
- Automatisch ServiceSpec + FlowSpec-Verträge aus Trace-Daten generieren
- Die Korrektheit von Microservice-Choreographien validieren
- HTML-Validierungsberichte erstellen und verstehen
- In CI/CD-Pipelines integrieren

## 🚀 Methode 1: Quickstart Demo (Empfohlen)

Der schnellste Weg, das System zu erleben, ist die Nutzung unserer vollständigen Demo:

```bash
# Demo-Repository klonen
git clone https://github.com/choreoatlas2025/quickstart-demo.git
cd quickstart-demo

# Ein-Klick-Demo vollständig ausführen
make demo
```

Dies führt automatisch folgende Schritte aus:
1. 📊 ServiceSpec + FlowSpec-Verträge aus voraufgezeichneten Traces generieren
2. ✅ Erfolgreiche und fehlgeschlagene Szenarien validieren
3. 🌐 Elegante HTML-Validierungsberichte generieren
4. Berichte automatisch öffnen, um Ergebnisse zu betrachten

<div className="callout success">
  <p><strong>🎉 So einfach ist das!</strong></p>
  <p>Wenn Sie den HTML-Bericht sehen, der eine erfolgreiche Validierung anzeigt, läuft ChoreoAtlas erfolgreich. Lassen Sie uns nun die Details jedes Schritts verstehen.</p>
</div>

## 📋 Methode 2: Detaillierte manuelle Schritte

Wenn Sie verstehen möchten, was jeder Befehl bewirkt, können Sie die folgenden Schritte manuell ausführen:

### Schritt 1: Trace-Daten vorbereiten

ChoreoAtlas benötigt Trace-Daten im OpenTelemetry/Jaeger-Format als Eingabe:

```json title="successful-order.json"
{
  "traceID": "1a2b3c4d5e6f7890abcdef1234567890",
  "spans": [
    {
      "spanID": "1234567890abcdef",
      "operationName": "GET /catalogue",
      "startTime": 1694787600000000,
      "duration": 45000,
      "tags": {
        "http.method": "GET",
        "http.status_code": 200
      },
      "process": {
        "serviceName": "catalogue"
      }
    }
    // ... weitere Spans
  ]
}
```

### Schritt 2: Verträge entdecken

Verwenden Sie den `discover`-Befehl, um automatisch Verträge aus Trace-Daten zu generieren:

<div className="cli-example">

```bash
# ServiceSpec + FlowSpec-Verträge aus Traces entdecken
choreoatlas discover \
  --trace traces/successful-order.json \
  --out-servicespec contracts/services/ \
  --out-flowspec contracts/flows/order-flow.flowspec.yaml \
  --format yaml
```

</div>

Ausgabeergebnis:
```
🔍 Trace-Daten analysieren...
✅ 5 Services entdeckt: catalogue, cart, orders, payment, shipping  
✅ ServiceSpec-Verträge generiert in contracts/services/
✅ FlowSpec generiert: contracts/flows/order-flow.flowspec.yaml
📊 Flow-Analyse: 5 Schritte, 280ms Gesamtdauer
```

### Schritt 3: Generierte Verträge überprüfen

Automatisch generierte ServiceSpec-Verträge anzeigen:

```yaml title="contracts/services/catalogue.servicespec.yaml"
apiVersion: servicespec.choreoatlas.io/v1
kind: ServiceSpec
service: "catalogue"

operations:
  - operationId: "getCatalogue"
    description: "Produktkatalog abrufen"
    method: GET
    path: "/catalogue"
    preconditions:
      "service_available": "true"
    postconditions:
      "response_ok": "response.status == 200"
      "has_products": "size(response.body) > 0"
```

Generierte FlowSpec-Choreographie-Verträge anzeigen:

```yaml title="contracts/flows/order-flow.flowspec.yaml"
apiVersion: flowspec.choreoatlas.io/v1
kind: FlowSpec
info:
  title: "Bestellabwicklungsprozess"

services:
  catalogue:
    spec: "../services/catalogue.servicespec.yaml"

flow:
  - step: "Produktkatalog durchsuchen"
    call: "catalogue.getCatalogue"
    output:
      products: "response.body"
    
  - step: "Zum Warenkorb hinzufügen"
    call: "cart.addToCart"
    depends_on: ["Produktkatalog durchsuchen"]
```

### Schritt 4: Choreographie validieren

Verwenden Sie den `validate`-Befehl, um zu überprüfen, ob die tatsächliche Ausführung den Verträgen entspricht:

<div className="cli-example">

```bash
# Übereinstimmung von Traces und Verträgen validieren
choreoatlas validate \
  --servicespec contracts/services/ \
  --flowspec contracts/flows/order-flow.flowspec.yaml \
  --trace traces/successful-order.json \
  --report-html reports/validation-report.html \
  --edition ce
```

</div>

Ausgabeergebnis:
```
✅ ServiceSpec-Validierung: 5/5 Services bestanden
✅ FlowSpec-Validierung: Alle 5 Schritte korrekt ausgeführt
✅ Zeitliche Reihenfolge: Keine Verletzungen erkannt
✅ Abdeckung: 100% der Service-Interaktionen validiert
📊 Bericht generiert: reports/validation-report.html
```

### Schritt 5: Validierungsbericht anzeigen

Öffnen Sie den generierten HTML-Bericht im Browser, Sie sehen:

- **Validierungszusammenfassung**: Gesamtstatus bestanden/fehlgeschlagen
- **Service-Analyse**: Vertragskonformität jedes Services
- **Prozess-Timeline**: Zeitliche Beziehungen der Schrittausführung
- **Abdeckungsmetriken**: Vollständigkeitsstatistiken der Validierung
- **Fehleranalyse**: Detaillierte Informationen zu Vertragsverletzungen

## 🔧 Integration in echte Projekte

### Export aus bestehenden Trace-Systemen

Wenn Sie bereits Jaeger, Zipkin oder andere Trace-Systeme haben:

```bash
# Trace aus Jaeger exportieren
curl "http://jaeger:16686/api/traces/your-trace-id" > your-trace.json

# Trace aus Zipkin exportieren  
curl "http://zipkin:9411/api/v2/trace/your-trace-id" > your-trace.json

# Verträge generieren
choreoatlas discover --trace your-trace.json --out-servicespec ./contracts/services/
```

### CI/CD-Validierung einrichten

In Ihrer `.github/workflows/validate.yml` hinzufügen:

```yaml title=".github/workflows/validate.yml"
name: Service Choreography Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: ChoreoAtlas CLI installieren
      run: |
        curl -L https://github.com/choreoatlas2025/cli/releases/latest/download/choreoatlas-linux-amd64.tar.gz | tar xz
        sudo mv choreoatlas /usr/local/bin/
    
    - name: Choreographie validieren
      run: |
        choreoatlas validate \
          --servicespec contracts/services/ \
          --flowspec contracts/flows/order-flow.flowspec.yaml \
          --trace traces/integration-test.json \
          --report-junit reports/junit.xml \
          --edition ce
    
    - name: Berichte hochladen
      uses: actions/upload-artifact@v4
      with:
        name: validation-reports
        path: reports/
```

## 📊 Validierungsergebnisse verstehen

### Erfolgreiche Validierung

Wenn alle Überprüfungen bestehen, sehen Sie:

<div className="callout success">
  <p><strong>✅ Validierung bestanden</strong></p>
  <ul>
    <li>Alle Services befolgen ServiceSpec-Verträge</li>
    <li>Choreographie-Schritte werden in der durch FlowSpec definierten Reihenfolge ausgeführt</li>
    <li>Keine zeitlichen Verletzungen oder Kausalitätsfehler erkannt</li>
    <li>Service-Interaktionsabdeckung erreicht erwartete Schwellenwerte</li>
  </ul>
</div>

### Validierung fehlgeschlagen

Wenn Vertragsverletzungen erkannt werden, zeigt der Bericht:

<div className="callout warning">
  <p><strong>⚠️ Verletzungen erkannt</strong></p>
  <ul>
    <li><strong>Service-Vertragsverletzungen</strong>: Antworten entsprechen nicht den Postconditions</li>
    <li><strong>Zeitfehler</strong>: Schrittausführungsreihenfolge entspricht nicht FlowSpec</li>
    <li><strong>Fehlende Abhängigkeiten</strong>: Erforderliche Service-Aufrufe fehlen</li>
    <li><strong>Unzureichende Abdeckung</strong>: Einige Service-Interaktionen nicht validiert</li>
  </ul>
</div>

## 💡 Best Practices

### 1. Schrittweise Einführung

```bash
# Beginnen Sie mit der Generierung von Verträgen für Kern-Services
choreoatlas discover --trace critical-path.json --out-servicespec ./core-services/

# Schrittweise auf mehr Services und Prozesse erweitern
choreoatlas discover --trace full-flow.json --out-servicespec ./all-services/
```

### 2. Versionsverwaltung

```bash
# Versionstags für Vertragsdateien setzen
git tag contracts-v1.0.0

# Vertragskompatibilität in CI validieren
choreoatlas validate --baseline contracts-v1.0.0/ --current ./contracts/
```

### 3. Qualitäts-Gates

```bash
# Abdeckungsschwellenwerte festlegen
choreoatlas validate \
  --coverage-threshold 80 \
  --max-duration 5s \
  --success-rate 0.99
```

## 🎓 Nächste Lernschritte

Nun, da Sie die Grundlagen beherrschen, vertiefen Sie Ihr Lernen:

1. **[Dual-Contract-Architektur im Detail](./concepts/dual-contracts)** - Verstehen Sie das ServiceSpec + FlowSpec-Designmuster tiefgreifend

## ❓ Häufig gestellte Fragen

**F: Woher kommen die Trace-Daten?**
A: Aus Jaeger, Zipkin, OpenTelemetry Collector oder jedem Trace-System, das OTLP-Format unterstützt.

**F: Kann ich Teilprozesse validieren?**
A: Ja, ChoreoAtlas unterstützt Teilvalidierung und inkrementelle Abdeckungsanalyse.

**F: Wie gehe ich mit sensiblen Daten um?**
A: Verwenden Sie die Pro Privacy-Version, die null Telemetrie und vollständig offline-Betrieb gewährleistet, oder nutzen Sie Daten-Anonymisierungsfunktionen.

---

<div className="callout info">
  <p><strong>🚀 Bereit?</strong></p>
  <p>Nachdem Sie nun den Schnellstart abgeschlossen haben, können Sie ChoreoAtlas in echten Projekten einsetzen. Denken Sie daran: Der beste Weg zu lernen ist durch praktische Anwendung!</p>
</div>