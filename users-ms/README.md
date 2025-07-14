# Users Microservice Component

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

### Run with Docker Compose (Recommended)
To ensure PostgreSQL and the service run properly together:

```bash
docker compose up --build
```

This will:

- Build the image for the users microservice.
- Start the PostgreSQL database container.
- Start the users service on port 3006.
#### _You can now access the API at: http://localhost:3006/users_

To stop everything:
```bash
docker compose down
```

## API Endpoints

### Create User
- **POST** `/users/`
- **Body:**
  ```json
  {
  "name": "John",
  "last_name": "Doe",
  "age": 25,
  "height": 1.75,
  "weight": 70.5,
  "arm": 30,
  "chest": 90,
  "waist": 80,
  "leg": 50,
  "withdrawal_date": "",
  "withdrawal_reason": ""
  }
  ```
- **Validations:**
  - All fields (except `withdrawal_date` & `withdrawal_reason`) are required
  - `age`, `height`, and `weight` must be positive
  - `arm`, `chest`, `waist`, and `leg` must be non-negative
  - Text fields are trimmed of whitespace

- **Responses:**
  - `201 Created` –  User successfully created.
  - `400 Bad Request` – Missing fields or invalid values.
  - `500 Internal Server Error` – Unexpected server error.


### List Users
- **GET** `/users`
- **Responses:**
  - `201 OK` – Users retrieved successfully.
  ```json
  [
  {
    "id": 1,
    "name": "John",
    "last_name": "Doe",
    "age": 25,
    "height": 1.75,
    "weight": 70.5,
    "arm": 30,
    "chest": 90,
    "waist": 80,
    "leg": 50,
    "withdrawal_date": "",
    "withdrawal_reason": "",
    "created_at": "2025-07-14T10:00:00",
    "updated_at": "2025-07-14T10:00:00"
  }
  ]

  ```

### Get User by ID
- **GET** `/users/<id>`
- **Responses:**
  - `200 OK` – User found.
  ```json
  {
    "id": 1,
    "name": "John",
    "last_name": "Doe",
    "age": 25,
    "height": 1.75,
    "weight": 70.5,
    "arm": 30,
    "chest": 90,
    "waist": 80,
    "leg": 50,
    "withdrawal_date": "",
    "withdrawal_reason": "",
    "created_at": "2025-07-14T10:00:00",
    "updated_at": "2025-07-14T10:00:00"
  }

  ```
  - `404 Not Found` – User not found.
  ```json
  {"message": "user not found"}
  ```

### Update User
- **PUT** `/users/<id>`
- **Body:**
  ```json
    {
    "name": "John",
    "last_name": "Doe",
    "age": 25,
    "height": 1.75,
    "weight": 70.5,
    "arm": 30,
    "chest": 90,
    "waist": 80,
    "leg": 50,
    "withdrawal_date": "",
    "withdrawal_reason": ""
    }
    ```
- **Validations:**
  - All fields (except withdrawal_date and withdrawal_reason) are required.
  - `age` must be a positive integer.
  - `height`, `weight` must be positive numbers.
  - `arm`, `chest`, `waist`, and `leg` must be integers ≥ 0.
- **Responses:**
  - `200 OK` – User updated successfully.
  - `400 Bad Request` – Invalid or missing fields.
  - `404 Not Found` – User not found.
    ```json
    {"message": "user not found"}
    ```

### Withdraw User (Dejar de entrenar)
- **PUT** `/users/<id>/withdraw`
- **Body:**
  ```json
    {
    "withdrawal_date": "2025-07-14",
    "withdrawal_reason": "No time to continue"
    }
    ```
- **Validations:**
  - Both fields are required.
  - A user can only be withdrawn once.

- **Responses:**
  - `200 OK` – User successfully withdrawn.
  - `400 Bad Request` – Missing fields or already withdrawn.
    ```json
    {"message": "withdrawal_date and withdrawal_reason are required"},
    {"message": "user is already withdrawn"}
    ```
  - `404 Not Found` – User not found.
    ```json
    {"message": "user not found"}
    ```

### Delete User
- **DELETE** `/users/<id>`
- **Responses:**
  - `200 OK` – User successfully deleted.
    ```json
    {"message": "user deleted"}
    ```
  - `404 Not Found` – User not found.
    ```json
    {"message": "user not found"}
    ```

### Health Check
- **GET** `/users/health`:
Returns service status
