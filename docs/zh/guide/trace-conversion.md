# 追踪格式转换

社区版校验使用简洁的 JSON 追踪格式。本页说明目标结构，并演示如何将 Jaeger / OTLP 数据转换为 CE 内部格式。

## CE 内部追踪结构

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

- `name`：操作标识，对应 ServiceSpec 的 operationId
- `service`：服务别名，对应 FlowSpec 中的引用
- `startNanos` / `endNanos`：UNIX 纳秒时间戳
- `attributes`：状态码、响应体、自定义字段等元数据

## 转换 Jaeger 追踪

在 quickstart 演示仓库中使用转换脚本：

```bash
# 位置：quickstart-demo/
python3 scripts/convert-trace.py \
  traces/successful-order.json \
  -o traces/successful-order.trace.json \
  --map demo
```

`--map demo` 提供示例映射，使输出与演示中的 ServiceSpec 对齐。实际项目请使用 `--map-file` 指定自己的映射文件。

## 转换 OTLP 追踪

```bash
python3 scripts/convert-trace.py \
  traces/otlp-sample.json \
  -o traces/otlp-sample.trace.json
```

OTLP 的 `startTimeUnixNano` / `endTimeUnixNano` 会直接映射为 CE 格式的 `startNanos` / `endNanos`。

## 映射注意事项

- 操作名称：确保输出中的 `name` 和 `service` 与 FlowSpec / ServiceSpec 一致。
- 响应体：Jaeger / OTLP 追踪常缺少完整响应体；若契约依赖 `response.body.*`，可能出现 SKIP/FAIL。可优先使用状态码等稳健字段。
- 自定义属性：会保留在 `attributes` 中，可在 FlowSpec 表达式里引用。

## 转换后的校验

完成转换后，建议立刻执行 lint + validate，确认追踪与 FlowSpec 匹配：

```bash
choreoatlas lint --flow contracts/flows/order-flow.graph.flowspec.yaml
choreoatlas validate \
  --flow contracts/flows/order-flow.graph.flowspec.yaml \
  --trace traces/successful-order.trace.json
```

一旦出现不匹配，请检查映射（服务别名、操作 ID）或相应调整 FlowSpec。
