Param(
  [string]$RepoName = "example-react-main",
  [string]$ImageTag = "",
  [string]$Region = "us-east-1"
)

function Assert-Cli($name, $check, $installHint) {
  try {
    Invoke-Expression $check | Out-Null
  } catch {
    Write-Error "'$name' not found. $installHint" -ErrorAction Stop
  }
}

Assert-Cli -name 'AWS CLI v2' -check 'aws --version' -installHint 'Install from https://aws.amazon.com/cli/'
Assert-Cli -name 'Docker' -check 'docker version --format "{{.Server.Version}}"' -installHint 'Install Docker Desktop: winget install -e --id Docker.DockerDesktop'
Assert-Cli -name 'Git' -check 'git --version' -installHint 'Install Git: winget install -e --id Git.Git'

# Ensure Docker Desktop is running
try { docker info | Out-Null } catch { Write-Error 'Docker daemon not running. Start Docker Desktop and retry.' -ErrorAction Stop }

# Default tag to git short sha if not provided
if ([string]::IsNullOrWhiteSpace($ImageTag)) {
  try { $ImageTag = (git rev-parse --short HEAD).Trim() } catch { $ImageTag = 'latest' }
}

$ErrorActionPreference = 'Stop'

Write-Host "Region: $Region" -ForegroundColor Cyan
Write-Host "RepoName: $RepoName" -ForegroundColor Cyan
Write-Host "ImageTag: $ImageTag" -ForegroundColor Cyan

# ECR Public uses us-east-1 API endpoint; keep Region overridable for future-proofing
if ($Region -ne 'us-east-1') {
  Write-Warning 'ECR Public endpoints are in us-east-1. Using specified region but login still targets public.ecr.aws.'
}

# Fetch registry URI (e.g., public.ecr.aws/<alias>)
$registryUri = (aws ecr-public describe-registries --region $Region --query 'registries[0].registryUri' --output text 2>$null)
if (-not $registryUri -or $registryUri -eq 'None') {
  throw 'Unable to determine ECR Public registry URI for your account. Ensure your account has an ECR Public registry (open ECR Public in the console once).'
}
Write-Host "Registry URI: $registryUri" -ForegroundColor Green

# Ensure repository exists
$repoExists = $true
try {
  aws ecr-public describe-repositories --repository-names $RepoName --region $Region | Out-Null
} catch {
  $repoExists = $false
}
if (-not $repoExists) {
  Write-Host "Creating ECR Public repository '$RepoName'..." -ForegroundColor Yellow
  aws ecr-public create-repository --repository-name $RepoName --region $Region | Out-Null
}

# Login to ECR Public
aws ecr-public get-login-password --region $Region | docker login --username AWS --password-stdin public.ecr.aws | Out-Null
Write-Host 'Docker login to ECR Public succeeded.' -ForegroundColor Green

# Build
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$appRoot = Resolve-Path (Join-Path $scriptDir '..')
Push-Location $appRoot

$localImage = "$RepoName:local-$ImageTag"
$remoteImage = "$registryUri/$RepoName:$ImageTag"

Write-Host "Building local image: $localImage" -ForegroundColor Cyan
docker build -t $localImage .

# Tag and push
docker tag $localImage $remoteImage
Write-Host "Pushing image: $remoteImage" -ForegroundColor Cyan
docker push $remoteImage

Pop-Location

Write-Host "Done. Image pushed: $remoteImage" -ForegroundColor Green
Write-Host "Update charts/react-app/values.yaml with:" -ForegroundColor Green
Write-Host "image.repository: $($registryUri)/$($RepoName)" -ForegroundColor Yellow
Write-Host "image.tag: $ImageTag" -ForegroundColor Yellow
