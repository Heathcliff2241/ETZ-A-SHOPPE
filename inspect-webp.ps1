$root = 'C:\Users\Cesar\Desktop\Work\ETZ-A-SHOPPE\public\images'
$files = @('hero2.webp','hero2-overlay.webp','hero2mobile.webp','hero2mobile-overlay.webp','hero_fullbleed.webp')
foreach ($file in $files) {
    $path = Join-Path $root $file
    if (-not (Test-Path $path)) {
        Write-Host "$file MISSING"
        continue
    }
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $riff = [System.Text.Encoding]::ASCII.GetString($bytes, 0, 4)
    if ($riff -ne 'RIFF') {
        Write-Host "$file NOT RIFF"
        continue
    }
    $form = [System.Text.Encoding]::ASCII.GetString($bytes, 8, 4)
    if ($form -ne 'WEBP') {
        Write-Host "$file NOT WEBP"
        continue
    }
    $chunk = [System.Text.Encoding]::ASCII.GetString($bytes, 12, 4)
    switch ($chunk) {
        'VP8 ' {
            $width = $bytes[26] -bor (($bytes[27] -band 0x3f) -shl 8)
            $height = $bytes[28] -bor (($bytes[29] -band 0x3f) -shl 8)
            Write-Host "$file VP8 $width x $height"
        }
        'VP8L' {
            $b = [BitConverter]::ToUInt32($bytes, 21)
            $width = ($b -band 0x3fff) + 1
            $height = (($b -shr 14) -band 0x3fff) + 1
            Write-Host "$file VP8L $width x $height"
        }
        'VP8X' {
            $width = 1 + [BitConverter]::ToUInt32(@($bytes[24], $bytes[25], $bytes[26], 0), 0)
            $height = 1 + [BitConverter]::ToUInt32(@($bytes[27], $bytes[28], $bytes[29], 0), 0)
            Write-Host "$file VP8X $width x $height"
        }
        default {
            Write-Host "$file UNKNOWN CHUNK $chunk"
        }
    }
}
