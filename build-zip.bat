@echo off
setlocal enabledelayedexpansion

:: ============================================================================
:: Script de empaquetado para WordPress: ileben-landing-v2
:: Genera un archivo .zip limpio y listo para produccion con solo lo esencial.
:: ============================================================================

chcp 65001 >nul 2>&1

:: Cambiar al directorio raiz del tema
cd /d "%~dp0"

if "%~1"=="--help" goto :show_help
if "%~1"=="-h" goto :show_help
if "%~1"=="/?" goto :show_help

set "THEME_SLUG=ileben-landing-v2"
set "THEME_NAME=Leben"
set "THEME_VERSION=unknown"
set "OUTPUT_ZIP=%~dp0%THEME_SLUG%.zip"
set "STAGING_BASE=%TEMP%\wp_theme_pkg_%RANDOM%"
set "STAGING_DIR=%STAGING_BASE%\%THEME_SLUG%"
set "SKIP_BUILD=0"
set "NO_PAUSE=0"

:: Analizar parametros
for %%a in (%*) do (
    if /i "%%a"=="--no-build" set "SKIP_BUILD=1"
    if /i "%%a"=="--skip-build" set "SKIP_BUILD=1"
    if /i "%%a"=="--no-pause" set "NO_PAUSE=1"
)

echo ============================================================================
echo   Empaquetador de Tema WordPress - %THEME_SLUG%
echo ============================================================================

:: 1. Extraer version desde style.css
if exist "style.css" (
    for /f "tokens=2 delims=: " %%a in ('findstr /i "Version:" style.css') do (
        set "THEME_VERSION=%%a"
    )
)
echo [*] Version detectada: %THEME_VERSION%

:: 2. Compilar assets si no se indico --no-build
if "%SKIP_BUILD%"=="1" (
    echo [*] Omitiendo compilacion [--no-build detectado].
    goto :check_manifest
)

echo [*] Compilando assets de produccion [npm run build:all]...
where npm >nul 2>&1
if errorlevel 1 (
    echo [!] ADVERTENCIA: 'npm' no encontrado en el PATH. Omitiendo compilacion.
    goto :check_manifest
)

call npm run build:all
if errorlevel 1 (
    echo.
    echo [X] ERROR: Fallo la compilacion de assets [npm run build:all].
    echo     Por favor revisa los errores de Vite/Sass antes de empaquetar.
    goto :cleanup_and_exit
)
echo [OK] Assets compilados correctamente.

:check_manifest
:: Verificar que exista la carpeta dist con su manifest
if not exist "dist\.vite\manifest.json" (
    echo.
    echo [X] ERROR: No se encontro dist\.vite\manifest.json.
    echo     Los assets deben compilarse antes de empaquetar.
    echo     Ejecuta 'npm run build:all' y vuelve a intentar.
    goto :cleanup_and_exit
)

:: 3. Preparar directorio temporal de staging
echo [*] Preparando entorno temporal en: %STAGING_DIR%
if exist "%STAGING_BASE%" rmdir /s /q "%STAGING_BASE%" >nul 2>&1
mkdir "%STAGING_DIR%" >nul 2>&1

:: 4. Copiar archivos esenciales de la raiz
echo [*] Copiando archivos raiz esenciales...
for %%f in (style.css index.php functions.php header.php footer.php front-page.php screenshot.png README.md LICENSE) do (
    if exist "%%f" (
        copy /y "%%f" "%STAGING_DIR%\" >nul
    )
)

:: 5. Copiar carpetas esenciales usando robocopy (excluyendo archivos dev)
echo [*] Copiando modulos y assets requeridos...

:: acf-json
if exist "acf-json" (
    robocopy "acf-json" "%STAGING_DIR%\acf-json" /E /NFL /NDL /NJH /NJS >nul
    if errorlevel 8 goto :copy_error
)

:: inc
if exist "inc" (
    robocopy "inc" "%STAGING_DIR%\inc" /E /NFL /NDL /NJH /NJS >nul
    if errorlevel 8 goto :copy_error
)

:: template-parts
if exist "template-parts" (
    robocopy "template-parts" "%STAGING_DIR%\template-parts" /E /NFL /NDL /NJH /NJS >nul
    if errorlevel 8 goto :copy_error
)

:: languages
if exist "languages" (
    robocopy "languages" "%STAGING_DIR%\languages" /E /NFL /NDL /NJH /NJS >nul
    if errorlevel 8 goto :copy_error
)

:: dist (excluyendo source maps *.map)
if exist "dist" (
    robocopy "dist" "%STAGING_DIR%\dist" /E /XF *.map /NFL /NDL /NJH /NJS >nul
    if errorlevel 8 goto :copy_error
)

:: assets\images
if exist "assets\images" (
    robocopy "assets\images" "%STAGING_DIR%\assets\images" /E /NFL /NDL /NJH /NJS >nul
    if errorlevel 8 goto :copy_error
)

:: blocks (excluyendo *.scss)
if exist "blocks" (
    robocopy "blocks" "%STAGING_DIR%\blocks" /E /XF *.scss /NFL /NDL /NJH /NJS >nul
    if errorlevel 8 goto :copy_error
)

:: 6. Crear el archivo .zip
echo [*] Creando archivo comprimido: %OUTPUT_ZIP%
if exist "%OUTPUT_ZIP%" del /f /q "%OUTPUT_ZIP%" >nul 2>&1

where tar.exe >nul 2>&1
if not errorlevel 1 (
    tar.exe -a -c -f "%OUTPUT_ZIP%" -C "%STAGING_BASE%" "%THEME_SLUG%"
) else (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Compress-Archive -Path '%STAGING_DIR%' -DestinationPath '%OUTPUT_ZIP%' -Force"
)

if not exist "%OUTPUT_ZIP%" (
    echo.
    echo [X] ERROR: No se pudo generar el archivo .zip.
    goto :cleanup_and_exit
)

:: 7. Copia con numero de version (util para GitHub Releases)
set "VERSIONED_ZIP=%~dp0%THEME_SLUG%-v%THEME_VERSION%.zip"
copy /y "%OUTPUT_ZIP%" "%VERSIONED_ZIP%" >nul 2>&1
goto :cleanup_and_exit

:copy_error
echo.
echo [X] ERROR durante la copia de archivos con robocopy.
goto :cleanup_and_exit

:cleanup_and_exit
if exist "%STAGING_BASE%" (
    echo [*] Limpiando archivos temporales...
    rmdir /s /q "%STAGING_BASE%" >nul 2>&1
)

:: Comprobar si se genero el zip
if not exist "%OUTPUT_ZIP%" (
    echo.
    echo ============================================================================
    echo   [ERROR] El proceso termino sin generar el archivo .zip
    echo ============================================================================
    goto :handle_pause
)

echo.
echo ============================================================================
echo   [EXITO] Paquete generado correctamente
echo ============================================================================
echo   Tema:       %THEME_NAME% ^(%THEME_SLUG%^)
echo   Version:    %THEME_VERSION%
echo   Archivo:    %OUTPUT_ZIP%
echo   Copia v:    %VERSIONED_ZIP%
powershell -NoProfile -ExecutionPolicy Bypass -Command "$f = Get-Item '%OUTPUT_ZIP%'; Write-Host ('   Tamano:     {0:N2} KB ({1:N2} MB)' -f ($f.Length / 1KB), ($f.Length / 1MB))"
echo.
echo   Listo para subir en WordPress:
echo   Panel Admin ^> Apariencia ^> Temas ^> Anadir nuevo ^> Subir tema
echo ============================================================================

:handle_pause
if "%NO_PAUSE%"=="1" exit /b 0
if defined npm_lifecycle_event exit /b 0

:: Pausar si se hizo doble clic desde el Explorador de Windows
echo %CMDCMDLINE% | findstr /i /c:"%~nx0" >nul
if not errorlevel 1 (
    echo.
    pause
)

exit /b 0

:show_help
echo ============================================================================
echo   Uso de build-zip.bat:
echo ============================================================================
echo   build-zip.bat              Compila assets (npm run build:all) y genera el .zip
echo   build-zip.bat --no-build   Genera el .zip usando los assets ya compilados en dist/
echo   build-zip.bat --no-pause   No pausa al finalizar (ideal para terminal o scripts)
echo.
exit /b 0
