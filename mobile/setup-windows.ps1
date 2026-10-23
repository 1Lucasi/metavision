$ErrorActionPreference = 'Stop'

Write-Host '=== WL02 Spatial AR - React Native / ViroReact ===' -ForegroundColor Cyan

function Require-Command($name, $help) {
    if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
        throw "Comando '$name' nao encontrado. $help"
    }
}

Require-Command node 'Instale Node.js 20 LTS ou 22 LTS.'
Require-Command npm  'O npm deve ser instalado junto com o Node.js.'
Require-Command adb  'Instale Android SDK Platform-Tools pelo Android Studio e adicione adb ao PATH.'

Write-Host "Node: $(node -v)"
Write-Host "npm : $(npm -v)"
Write-Host "ADB : $(adb version | Select-Object -First 1)"

Write-Host '\n[1/5] Instalando dependencias...' -ForegroundColor Yellow
npm install

Write-Host '\n[2/5] Verificando estrutura e configuracao...' -ForegroundColor Yellow
npm run verify

Write-Host '\n[3/5] Executando Expo Doctor...' -ForegroundColor Yellow
npm run doctor

Write-Host '\n[4/5] Gerando projeto Android nativo...' -ForegroundColor Yellow
npm run prebuild

Write-Host '\n[5/5] Verificando dispositivo Android...' -ForegroundColor Yellow
adb devices

Write-Host '\nAmbiente preparado.' -ForegroundColor Green
Write-Host 'Com o telefone listado como device, execute: npm run android' -ForegroundColor Green
