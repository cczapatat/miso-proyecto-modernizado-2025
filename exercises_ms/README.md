# Exercises Microservice Component

## Commands Utils

### Run App

```bash
flask --app . run --host=0.0.0.0 --port=3006
```

### Run Tests

```bash
python -m pytest -vv
```

### Run Tests with Coverage

```bash
coverage run -m pytest -vv
coverage report -m --fail-under=90
```

## API Endpoints

### Create Exercise
- **POST** `/exercises/`
- **Body:**
  ```json
  {
    "name": "string",
    "description": "string", 
    "youtube": "https://www.youtube.com/watch?v=VIDEO_ID",
    "calories": 5
  }
  ```
- **Validations:**
  - All fields are required
  - `youtube` must be a valid YouTube URL
  - `calories` must be a positive integer
  - Text fields are trimmed of whitespace

### Health Check
- **GET** `/exercises/health`
- Returns service status

### Listar Ejercicios (paginado)
- **GET** `/exercises?page=1&per_page=10`
- **Respuesta:**
```json
{
  "exercises": [
    {
      "id": 1,
      "name": "name",
      "description": "description",
      "calories": 10,
      "youtube": "https://youtube.com"
    }
  ],
  "page": 1,
  "per_page": 10,
  "total": 200,
  "total_pages": 20
}
```

### Obtener ejercicio por ID
- **GET** `/exercises/<id>`
- **Respuesta exitosa:**
```json
{
  "id": 1,
  "name": "Burpees",
  "description": "Full body exercise",
  "calories": 15,
  "youtube": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```
- **404:**
```json
{"message": "exercise not found"}
```

### Actualizar ejercicio
- **PUT** `/exercises/<id>`
- **Body:** igual a creación
- **Respuesta exitosa:** igual a GET por ID
- **404:**
```json
{"message": "exercise not found"}
```

### Eliminar ejercicio
- **DELETE** `/exercises/<id>`
- **Respuesta exitosa:**
```json
{"message": "exercise deleted"}
```
- **404:**
```json
{"message": "exercise not found"}
```