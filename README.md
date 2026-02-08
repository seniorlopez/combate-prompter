# Combate Prompter

WebApp de Prompter sincronizado para la grabación del podcast **Combate**.
Diseñada para separar la vista del **Host** (Narrativa completa + Cues) y del **Co-Host** (Contexto reducido + Fichas de Combate).

## 🚀 Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

1.  **Node.js** (v18 o superior): [Descargar aquí](https://nodejs.org/)
2.  **Python** (v3.8 o superior): [Descargar aquí](https://www.python.org/)

## 🛠 Instalación (Primera Vez)

### Paso 1: Clonar el Repositorio
```bash
git clone <URL_DEL_REPO>
cd combate-prompter
```

### Paso 2: Instalar Dependencias de Frontend
```bash
npm install
```

### Paso 3: Configurar Entorno de Python (Para procesar guiones)

#### En Mac / Linux:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install python-docx
```

#### En Windows:
```bash
python -m venv .venv
.venv\Scripts\activate
pip install python-docx
```

---

## ✍️ Flujo de Trabajo (Actualizar el Guion)

El sistema lee los guiones directamente de archivos **Word (.docx)** ubicados en la carpeta `/docs`.

**IMPORTANTE:** La carpeta `/docs` debe estar **al mismo nivel** que la carpeta del proyecto (`combate-prompter`), o dentro de ella si decides moverla. Actualmente el script busca `../docs`.

### 1. Editar los Documentos
Coloca tus archivos en la carpeta `/docs` siguiendo estrictamente esta nomenclatura:

*   **Narrativa (Host):** `s11e03-...-seg01.docx`
*   **Fichas (Co-Host):** `s11e03-...-seg01-fichascombate.docx`

*La palabra clave es `segXX` para el orden y `fichascombate` para las inserciones.*

### 2. Regenerar la Data
Cada vez que modifiques un Word, debes correr el script para que el Prompter se actualice:

**En Mac:**
```bash
source .venv/bin/activate
python3 scripts/parse_docx.py
```

**En Windows:**
```bash
.venv\Scripts\activate
python scripts/parse_docx.py
```

*Si ves el mensaje `SUCCESS: Generated ... fullData.json`, todo salió bien.*

### 3. Correr el Prompter Localmente
```bash
npm run dev
```
Abre el link que aparece (ej. `http://localhost:5173`) y selecciona tu rol.

---

## 🌍 Deployment (Cómo ponerlo en internet)

Para que tú y tu Co-Host lo vean desde distintos países, recomendamos **Vercel** o **Netlify**.

### Opción Rápida: Vercel
1.  Sube este código a tu GitHub.
2.  Ve a [Vercel.com](https://vercel.com) y conecta tu cuenta de GitHub.
3.  Importa el proyecto `combate-prompter`.
4.  En "Framework Preset", elige **Vite**.
5.  Dale a **Deploy**.

**OJO:**
El sitio en internet es **estático**. Si cambias el guion en Word:
1.  Corres el script de Python en tu compu.
2.  Haces `git commit` y `git push` de los cambios (incluyendo el `src/data/fullData.json` actualizado).
3.  Vercel se actualiza solo automáticamente.

---

## 📂 Estructura del Proyecto

*   `/docs`: Archivos Word originales (Fuente de la verdad).
*   `/scripts`:
    *   `parse_docx.py`: El cerebro que convierte Word a JSON.
    *   `standardize_data.py`: Utilidad interna.
*   `/src`: Código de la App React.
    *   `/data/fullData.json`: El guion compilado que usa la App.
    *   `/components`: `Prompter.jsx` (Lógica de vistas).
