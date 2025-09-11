#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: push-ecr-public.sh <repoName> <tag> [region]

Examples:
  ./push-ecr-public.sh "stagging/react-node" "1"            # region defaults to us-east-1
  ./push-ecr-public.sh "myapp/web" "v2025-09-11" us-east-1

Notes:
  - Requires: AWS CLI v2, Docker
  - ECR Public APIs live in us-east-1
USAGE
}

if [[ ${1:-} == "-h" || ${1:-} == "--help" || $# -lt 2 ]]; then
  usage; exit 1
fi

REPO_NAME="$1"     # e.g., "stagging/react-node"
IMAGE_TAG="$2"     # e.g., "1"
REGION="${3:-us-east-1}"

command -v aws >/dev/null 2>&1 || { echo "ERROR: aws not found in PATH"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "ERROR: docker not found in PATH"; exit 1; }

# Ensure Docker daemon is running (try to start Docker Desktop on Windows if needed)
ensure_docker() {
  if docker info >/dev/null 2>&1; then return 0; fi
  local UNAME
  UNAME="$(uname -s 2>/dev/null || echo unknown)"
  case "$UNAME" in
    *MINGW*|*MSYS*|*CYGWIN*)
      echo "Docker daemon not detected. Attempting to start Docker Desktop..." >&2
      powershell.exe -NoProfile -Command "Start-Process -FilePath 'C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe'" >/dev/null 2>&1 || true
      for i in {1..60}; do
        if docker info >/dev/null 2>&1; then
          echo "Docker daemon is running." >&2
          return 0
        fi
        sleep 2
      done
      ;;
    *)
      ;;
  esac
  echo "ERROR: Docker daemon not running. Start Docker and retry." >&2
  return 1
}

ensure_docker || exit 1

# Resolve app root (parent of scripts dir)
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

echo "Region      : ${REGION}"
echo "Repository  : ${REPO_NAME}"
echo "Tag         : ${IMAGE_TAG}"

# Discover your ECR Public registry URI: public.ecr.aws/<alias>
REGISTRY_URI="$(aws ecr-public describe-registries \
  --region "${REGION}" \
  --query 'registries[0].registryUri' \
  --output text 2>/dev/null || true)"

if [[ -z "${REGISTRY_URI}" || "${REGISTRY_URI}" == "None" ]]; then
  echo "Initializing (or unable to read) your ECR Public registry..." >&2
  echo "Open AWS Console → ECR Public once if this continues." >&2
  # Attempt a no-op describe to trigger creation on some accounts
  aws ecr-public describe-registries --region "${REGION}" >/dev/null 2>&1 || true
  REGISTRY_URI="$(aws ecr-public describe-registries --region "${REGION}" --query 'registries[0].registryUri' --output text 2>/dev/null || true)"
fi

if [[ -z "${REGISTRY_URI}" || "${REGISTRY_URI}" == "None" ]]; then
  echo "ERROR: Could not determine ECR Public registry URI for your account." >&2
  exit 1
fi

echo "Registry URI: ${REGISTRY_URI}"

# Ensure repository exists
if ! aws ecr-public describe-repositories --repository-names "${REPO_NAME}" --region "${REGION}" >/dev/null 2>&1; then
  echo "Creating ECR Public repo: ${REPO_NAME}"
  aws ecr-public create-repository --repository-name "${REPO_NAME}" --region "${REGION}" >/dev/null
fi

# Login to ECR Public
aws ecr-public get-login-password --region "${REGION}" | docker login --username AWS --password-stdin public.ecr.aws >/dev/null
echo "Docker login: OK"

cd "${APP_ROOT}"

# Build, tag, push
LOCAL_IMAGE="local-${IMAGE_TAG}"
REMOTE_IMAGE="${REGISTRY_URI}/${REPO_NAME}:${IMAGE_TAG}"

echo "Building image: ${LOCAL_IMAGE} (context: ${APP_ROOT})"
docker build -t "${LOCAL_IMAGE}" .

echo "Tagging ${LOCAL_IMAGE} -> ${REMOTE_IMAGE}"
docker tag "${LOCAL_IMAGE}" "${REMOTE_IMAGE}"

echo "Pushing ${REMOTE_IMAGE}"
docker push "${REMOTE_IMAGE}"

echo "Done. Pushed: ${REMOTE_IMAGE}"
echo "Helm values suggestion:"
echo "  image:"
echo "    repository: ${REGISTRY_URI}/${REPO_NAME}"
echo "    tag: ${IMAGE_TAG}"
