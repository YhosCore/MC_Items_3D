param(
  [Parameter(Mandatory = $true)]
  [string] $Version
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$Root = Split-Path -Parent $PSScriptRoot
$AddonPath = Join-Path $Root "Addon_Items_3D_v$Version.mcaddon"

if (Test-Path $AddonPath) {
  Remove-Item -LiteralPath $AddonPath -Force
}

function Add-DirectoryEntry {
  param(
    [System.IO.Compression.ZipArchive] $Zip,
    [string] $EntryName
  )

  if (-not $EntryName.EndsWith("/")) {
    $EntryName += "/"
  }

  foreach ($Entry in $Zip.Entries) {
    if ($Entry.FullName -eq $EntryName) {
      return
    }
  }

  [void] $Zip.CreateEntry($EntryName)
}

function Add-Pack {
  param(
    [System.IO.Compression.ZipArchive] $Zip,
    [string] $SourceDir,
    [string] $PackName
  )

  Add-DirectoryEntry -Zip $Zip -EntryName $PackName

  Get-ChildItem -LiteralPath $SourceDir -Recurse -Directory | ForEach-Object {
    $Relative = $_.FullName.Substring($SourceDir.Length).TrimStart("\")
    Add-DirectoryEntry -Zip $Zip -EntryName ($PackName + "/" + $Relative.Replace("\", "/"))
  }

  Get-ChildItem -LiteralPath $SourceDir -Recurse -File | ForEach-Object {
    $Relative = $_.FullName.Substring($SourceDir.Length).TrimStart("\")
    $EntryName = $PackName + "/" + $Relative.Replace("\", "/")
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
      $Zip,
      $_.FullName,
      $EntryName,
      [System.IO.Compression.CompressionLevel]::Optimal
    ) | Out-Null
  }
}

$Zip = $null
try {
  $Zip = [System.IO.Compression.ZipFile]::Open($AddonPath, [System.IO.Compression.ZipArchiveMode]::Create)
  Add-Pack -Zip $Zip -SourceDir (Join-Path $Root "Items3D_BP") -PackName "Items3D Behavior"
  Add-Pack -Zip $Zip -SourceDir (Join-Path $Root "Items3D_RP") -PackName "Items3D Resources"
} finally {
  if ($Zip) {
    $Zip.Dispose()
  }
}

Get-ChildItem -Path $Root -Filter "Addon_Items_3D_v*.mcaddon" |
  Where-Object { $_.FullName -ne $AddonPath } |
  Remove-Item -Force

Write-Host "Created $AddonPath"
