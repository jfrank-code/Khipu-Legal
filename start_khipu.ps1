$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host "" 
Write-Host "  KHIPU LEGAL · TEAM SUPERNOVA" -ForegroundColor Yellow
Write-Host "  ----------------------------------------------------" -ForegroundColor DarkGray
Write-Host "  Antes de empezar, configura backend\.env con tu OPENAI_API_KEY." -ForegroundColor Gray
Write-Host "  Tu clave se queda en el backend; nunca la pegues en React." -ForegroundColor Gray
Write-Host ""

$backendDir = Join-Path $root "backend"
$envPath = Join-Path $backendDir ".env"
$envExample = Join-Path $backendDir ".env.example"
if (-not (Test-Path $envPath)) {
    Copy-Item $envExample $envPath
    Write-Host "Se creó backend\.env desde el ejemplo. Edita ese archivo y añade OPENAI_API_KEY antes de usar las funciones de IA." -ForegroundColor Yellow
    notepad $envPath
    Read-Host "Guarda backend\.env y pulsa ENTER para continuar"
}

$venvPython = Join-Path $backendDir ".venv\Scripts\python.exe"
if (-not (Test-Path $venvPython)) {
    Write-Host "Creando entorno Python aislado..." -ForegroundColor Cyan
    py -3.10 -m venv (Join-Path $backendDir ".venv")
    if ($LASTEXITCODE -ne 0) { throw "No se pudo crear el entorno. Comprueba que Python 3.10 esté instalado (py -3.10 --version)." }
}

Write-Host "Instalando/verificando dependencias Python..." -ForegroundColor Cyan
& $venvPython -m pip install -r (Join-Path $backendDir "requirements.txt")
if ($LASTEXITCODE -ne 0) { throw "Falló la instalación de dependencias Python. Revisa el error mostrado." }

Write-Host "Instalando/verificando dependencias React..." -ForegroundColor Cyan
Push-Location (Join-Path $root "frontend")
try {
    npm install
    if ($LASTEXITCODE -ne 0) { throw "Falló npm install. Comprueba Node.js y la conexión." }
} finally { Pop-Location }

$backendCommand = "Set-Location '$backendDir'; & '.\.venv\Scripts\python.exe' -m uvicorn app.main:app --app-dir . --reload --host 127.0.0.1 --port 8000"
Start-Process -FilePath "powershell.exe" -ArgumentList @("-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $backendCommand) -WorkingDirectory $backendDir | Out-Null
Start-Sleep -Seconds 2

Write-Host "" 
Write-Host "API:      http://127.0.0.1:8000/api/health" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host ""
$frontendDir = Join-Path $root "frontend"
$frontendCommand = "Set-Location '$frontendDir'; npm run dev -- --host 127.0.0.1"
Start-Process -FilePath "powershell.exe" -ArgumentList @("-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $frontendCommand) -WorkingDirectory $frontendDir | Out-Null
Start-Sleep -Seconds 4
Start-Process "http://localhost:5173"
Write-Host "Frontend y API arrancados en ventanas separadas. Cierra esas ventanas para detenerlos." -ForegroundColor Gray
Write-Host "Puedes volver a esta ventana cuando termines." -ForegroundColor Gray
Read-Host "Pulsa ENTER para cerrar este lanzador" | Out-Null
