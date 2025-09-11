Param(
  [string]$Tag = "1",
  [string]$Region = "us-east-1"
)

$RepoName = "stagging/react-node"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$helper = Join-Path $scriptDir 'push-ecr-public.ps1'

if (-not (Test-Path $helper)) {
  Write-Error "Helper not found: $helper" -ErrorAction Stop
}

& $helper -RepoName $RepoName -ImageTag $Tag -Region $Region
