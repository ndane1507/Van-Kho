param(
  [Parameter(Mandatory=$true)][string]$InputPath,
  [string]$OutputDirectory = (Join-Path $PSScriptRoot '..\src\content\curriculum')
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
$resolvedInput = (Resolve-Path -LiteralPath $InputPath).Path
[System.IO.Directory]::CreateDirectory([System.IO.Path]::GetFullPath($OutputDirectory)) | Out-Null
$sourceStream = [System.IO.File]::Open($resolvedInput,[System.IO.FileMode]::Open,[System.IO.FileAccess]::Read,[System.IO.FileShare]::ReadWrite)
try {
  $hashEngine = [System.Security.Cryptography.SHA256]::Create()
  $sourceHash = [Convert]::ToHexString($hashEngine.ComputeHash($sourceStream)).ToLowerInvariant()
  $hashEngine.Dispose()
  $sourceStream.Position = 0
  $archive = [System.IO.Compression.ZipArchive]::new($sourceStream,[System.IO.Compression.ZipArchiveMode]::Read,$true)
  try {
    $reader = [System.IO.StreamReader]::new($archive.GetEntry('word/document.xml').Open())
    try { [xml]$document = $reader.ReadToEnd() } finally { $reader.Dispose() }
    $namespaces = [System.Xml.XmlNamespaceManager]::new($document.NameTable)
    $namespaces.AddNamespace('w','http://schemas.openxmlformats.org/wordprocessingml/2006/main')
    $rows = [System.Collections.Generic.List[object]]::new()
    foreach($element in $document.SelectNodes('//w:body/*',$namespaces)) {
      if($element.LocalName -eq 'tbl') {
        foreach($row in $element.SelectNodes('./w:tr',$namespaces)) {
          $cells = @($row.SelectNodes('./w:tc',$namespaces) | ForEach-Object { ($_.SelectNodes('.//w:t',$namespaces) | ForEach-Object { $_.InnerText }) -join ' ' })
          $rows.Add([pscustomobject]@{index=$rows.Count;type='row';cells=$cells})
        }
      } else {
        $text = ($element.SelectNodes('.//w:t',$namespaces) | ForEach-Object { $_.InnerText }) -join ' '
        if($text) { $rows.Add([pscustomobject]@{index=$rows.Count;type='paragraph';cells=@($text)}) }
      }
    }
    $rows | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $OutputDirectory 'ppct-raw.json') -Encoding utf8
    [pscustomobject]@{sourceFile=[System.IO.Path]::GetFileName($resolvedInput);sha256=$sourceHash;rawRows=$rows.Count;extraction='OOXML word/document.xml, full body paragraphs and table rows';pageNumbers='Unverified; use sourceRow indices, not page numbers'} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $OutputDirectory 'provenance.json') -Encoding utf8
    Write-Output "Extracted $($rows.Count) rows. SHA256: $sourceHash"
  } finally { $archive.Dispose() }
} finally { $sourceStream.Dispose() }
