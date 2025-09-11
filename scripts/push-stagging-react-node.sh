#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
HELPER="${SCRIPT_DIR}/push-ecr-public.sh"

if [[ ! -f "${HELPER}" ]]; then
  echo "Helper not found: ${HELPER}" >&2
  exit 1
fi

TAG="${1:-1}"
REGION="${2:-us-east-1}"

"${HELPER}" "stagging/react-node" "${TAG}" "${REGION}"
