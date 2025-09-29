# Trace Conversion

Community Edition validation expects traces in a lightweight JSON format. This guide explains the structure and shows how to convert Jaeger/OTLP traces into the CE internal format.

## CE internal trace structure

```json
{
  "spans": [
    {
      "name": "createOrder",
      "service": "orders",
      "startNanos": 1694787600090000000,
      "endNanos": 1694787600215000000,
      "attributes": {
        "http.status_code": 201,
        "response.body": { "id": "ORD-2023-001" }
      }
    }
  ]
}
```

- `name`: operation identifier (matching ServiceSpec operationId)
- `service`: service alias used in FlowSpec
- `startNanos` / `endNanos`: UNIX timestamps in nanoseconds
- `attributes`: key/value metadata (status codes, bodies, custom fields)

## Converting Jaeger traces

Use the conversion script in the quickstart demo:

```bash
# Inside quickstart-demo/
python3 scripts/convert-trace.py \
  traces/successful-order.json \
  -o traces/successful-order.trace.json \
  --map demo
```

The `--map demo` flag applies a sample service/operation mapping so the output matches the demo ServiceSpecs. For real traces, supply your own mapping file via `--map-file`.

## Converting OTLP traces

```bash
python3 scripts/convert-trace.py \
  traces/otlp-sample.json \
  -o traces/otlp-sample.trace.json
```

OTLP spans keep `startTimeUnixNano`/`endTimeUnixNano` values and are mapped directly into the CE format.

## Mapping notes

- Operation names: ensure the converted `name` and `service` align with your FlowSpec/ServiceSpec.
- Response bodies: Jaeger/OTLP traces may not include full payloads. Conditions relying on `response.body.*` might be marked SKIP/FAIL; prefer status codes when payloads are absent.
- Custom attributes: they are preserved under `attributes` and can be referenced in FlowSpec expressions.

## Validation after conversion

Always run convert (if DAG) → lint → validate to confirm the trace matches your FlowSpec. CE defaults to flow format:

```bash
choreoatlas spec convert --in contracts/flows/order-flow.graph.flowspec.yaml --to flow --out contracts/flows/order-flow.flowspec.yaml
choreoatlas spec lint --flow contracts/flows/order-flow.flowspec.yaml
choreoatlas run validate \
  --flow contracts/flows/order-flow.flowspec.yaml \
  --trace traces/successful-order.trace.json
```

If you encounter mismatches, revisit the mapping (service aliases, operation IDs) or update the FlowSpec accordingly.
