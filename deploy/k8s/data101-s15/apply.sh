#!/usr/bin/env bash
set -euo pipefail

CTX="${CTX:-vke-5fb6cddb-add1-4671-8b02-23f0495accf7}"
NS="data101-s15"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"

kubectl --context "$CTX" get ns "$NS" >/dev/null 2>&1 || kubectl --context "$CTX" create ns "$NS"

# Large ConfigMap: use server-side apply to avoid the 256KiB last-applied annotation limit.
kubectl --context "$CTX" -n "$NS" create configmap data101-interactive-site \
  --from-file=index.html="$ROOT/public/lab/index.html" \
  --from-file=lab.css="$ROOT/public/lab/lab.css" \
  --from-file=app.js="$ROOT/public/lab/app.js" \
  --from-file=data-task-abstraction-dataset.csv="$ROOT/public/lab/data-task-abstraction-dataset.csv" \
  --from-file=d3.v7.min.js="$ROOT/public/lab/vendor/d3.v7.min.js" \
  --from-file=robots.txt="$ROOT/public/robots.txt" \
  --dry-run=client -o yaml | kubectl --context "$CTX" apply --server-side -f -

kubectl --context "$CTX" -n "$NS" create configmap data101-interactive-nginx \
  --from-file=default.conf="$ROOT/deploy/interactive/default.conf" \
  --dry-run=client -o yaml | kubectl --context "$CTX" apply --server-side -f -

kubectl --context "$CTX" apply -k "$ROOT/deploy/k8s/data101-s15"

