# 🧠 Memory Game - Django + Docker

Proyecto desarrollado para la asignatura de Arquitectura de Computadoras.

Memory Game es una aplicación web interactiva desarrollada con Django que permite a los usuarios poner a prueba su memoria mediante un tablero de cartas.

El proyecto utiliza Docker para ejecutar la aplicación dentro de un entorno aislado y portable.

---

## 🚀 Tecnologías utilizadas

- Python
- Django
- HTML5
- CSS3
- Bootstrap
- JavaScript
- SQLite
- Docker
- Docker Compose
- Git
- GitHub

---

## 🎮 Funcionalidades

- Registro de usuarios.
- Inicio y cierre de sesión.
- Selección de nivel de dificultad.
- Tablero de Memory Game 4x4.
- 16 cartas y 8 parejas.
- Cartas mezcladas aleatoriamente.
- Contador de intentos.
- Temporizador.
- Tres niveles de dificultad:
  - Básico: 6 intentos y 60 segundos.
  - Medio: 4 intentos y 45 segundos.
  - Avanzado: 2 intentos y 30 segundos.
- Detección de victoria y derrota.
- Efectos de sonido.
- Música diferenciada según la dificultad.
- Registro de partidas.
- Estadísticas del jugador.
- Historial de partidas.
- Persistencia de información mediante SQLite.
- Ejecución mediante contenedores Docker.

---

## 📊 Estadísticas del jugador

El perfil permite consultar:

- Total de partidas jugadas.
- Victorias.
- Derrotas.
- Promedio de tiempo por partida.
- Nivel más jugado.
- Historial completo de partidas.

---

## 🐳 Ejecución con Docker

### 1. Clonar el repositorio

```bash
git clone https://github.com/ViankaGamez/memory-game-django-docker.git
```

---

### ⚠️ Importante: configurar el archivo `.env`

Antes de ejecutar el proyecto con Docker es necesario crear un archivo llamado `.env` en la carpeta principal del proyecto.

Puede copiar el archivo `.env.example` y renombrarlo a `.env`.

Luego, genere una nueva clave secreta para Django ejecutando el siguiente comando en PowerShell:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

Copie la clave generada y colóquela dentro del archivo `.env` de la siguiente manera:

```env
DJANGO_SECRET_KEY=PEGA_AQUI_LA_CLAVE_GENERADA
DJANGO_DEBUG=True
```

Reemplace `PEGA_AQUI_LA_CLAVE_GENERADA` por la clave obtenida con el comando anterior.

> **Nota:** El archivo `.env` no se incluye en GitHub por motivos de seguridad, por lo que debe crearse localmente antes de ejecutar Docker.
