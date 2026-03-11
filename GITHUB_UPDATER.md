# GitHub Theme Updater - Documentación

Este tema incluye un sistema de actualización automática desde GitHub Releases.

## 🚀 Cómo publicar una actualización

### 1. Actualizar la versión del tema

Edita el archivo `style.css` y actualiza el número de versión:

```css
/*
Theme Name: ileben-landing-v2
Version: 0.1.12  <-- Aumentar este número
*/
```

### 2. Commit y push a GitHub

```bash
git add .
git commit -m "Bump version to 0.1.11"
git push origin main
```

### 3. Crear un Release en GitHub

1. Ve a tu repositorio: `https://github.com/scooller/ileben-landing-v2`
2. Click en "Releases" → "Draft a new release"
3. **Tag version:** `v0.1.12` (debe coincidir con la versión de style.css)
4. **Release title:** `Version 0.1.11`
5. **Description:** Describe los cambios
6. Click en "Publish release"

### 4. WordPress detectará la actualización

- Espera hasta 12 horas (hay un caché)
- O fuerza la verificación usando las herramientas de debug (ver abajo)

## 🔧 Herramientas de Debug

### Ver estado del updater

Visita esta URL en tu admin de WordPress:
```
https://tu-sitio.com/wp-admin/themes.php?ileben_debug_updater=1
```

Esto mostrará:
- ✓ Versión actual del tema
- ✓ Última versión disponible en GitHub
- ✓ Si hay actualización disponible
- ✓ Estado del caché
- ✓ URLs y configuración

### Forzar verificación de actualizaciones

Si acabas de publicar un release y no aparece, fuerza la verificación:

```
https://tu-sitio.com/wp-admin/themes.php?ileben_force_update=1
```

Esto:
- Limpia el caché
- Fuerza a WordPress a verificar actualizaciones inmediatamente
- Te redirige a la pantalla de Temas

## 📝 Ver logs (debug)

Los logs se guardan en `wp-content/debug.log` si tienes WP_DEBUG activado.

Para activar debug, añade esto a `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

Luego busca líneas que empiecen con `GitHub Updater:` en el archivo `debug.log`.

## ⚙️ Configuración

La configuración está en [`inc/github-updater.php`](inc/github-updater.php):

```php
private $github_user = 'scooller';          // usuario de GitHub
private $github_repo = 'ileben-landing-v2'; // nombre del repositorio
private $github_token = null;                // dejar null si es público
private $theme_slug = 'ileben-landing-v2';  // slug del tema
private $cache_hours = 12;                   // horas de caché
```

## 🔐 Repositorios privados

Si tu repositorio es privado, necesitas configurar un token:

1. Ve a: https://github.com/settings/tokens
2. Genera un "Personal Access Token" (classic) con el scope `repo`
3. Copia el token
4. Edita `inc/github-updater.php`:

```php
private $github_token = 'ghp_tuTokenAqui';
```

**⚠️ IMPORTANTE:** No subas el token a GitHub. Usa variables de entorno o un archivo `.env` que esté en `.gitignore`.

## ❓ Problemas comunes

### No aparece la actualización

1. Ve a `?ileben_debug_updater=1` para ver el estado
2. Verifica que el tag del release empiece con `v` (ej: `v0.1.11`)
3. Verifica que la versión en `style.css` sea menor que la del release
4. Fuerza la verificación con `?ileben_force_update=1`

### Error al descargar

- Verifica que el repositorio sea público, o que tengas un token válido
- Revisa `debug.log` para ver el error exacto
- GitHub limita API calls sin autenticación (60 por hora)

### Folder con nombre incorrecto después de actualizar

El sistema debería renombrar automáticamente el folder de GitHub (`ileben-landing-v2-abc123`) a `ileben-landing-v2`. Si no funciona:

1. Revisa `debug.log` para ver errores de renombrado
2. Verifica que `upgrader_source_selection` se esté ejecutando

## 📊 Cómo funciona

1. WordPress verifica actualizaciones cada 12 horas (configurable)
2. El sistema consulta la API de GitHub: `https://api.github.com/repos/scooller/ileben-landing-v2/releases/latest`
3. Compara la versión del release con la versión en `style.css`
4. Si hay una versión nueva, muestra "Actualizar ahora" en Apariencia → Temas
5. Al actualizar:
   - Descarga el ZIP del release (zipball)
   - Lo descomprime
   - Renombra el folder al slug correcto
   - Reemplaza los archivos del tema
   - Limpia el caché

## 🔗 Referencias

Basado en:
- https://gist.github.com/slfrsn/a75b2b9ef7074e22ce3b
- Mejoras de TonyIngall y eduardo-marcolino

## 💡 Tips

- Usa versionado semántico: `MAJOR.MINOR.PATCH` (ej: `1.2.3`)
- Los tags deben empezar con `v`: `v1.2.3`
- Documenta bien los cambios en cada release
- Prueba las actualizaciones en un ambiente de desarrollo primero
