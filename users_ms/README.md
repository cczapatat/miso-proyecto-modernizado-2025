

# Users Microservice Component

## Commands Utils

### Run App

#### **Option 1: Run with Docker Compose (Recommended)**

This is the easiest and most consistent way to get the project running, as Docker manages both the database and the service for you without needing to install PostgreSQL or Python on your host machine.

1.  **Start the services:**
    From the project's root directory, run:
    ```bash
    docker compose up --build
    ```
    This command will:
    - Build the Docker image for the users microservice.
    - Start the PostgreSQL database container.
    - Start the users service, making it available on port 3006.

2.  **Access the API:**
    You can now access the API at: `http://localhost:3006/users`

3.  **Stop the services:**
    To stop and remove the containers, press `Ctrl + C` in the terminal and then run:
    ```bash
    docker compose down
    ```

---

#### **Option 2: Running Locally (Manual Setup)**

This method is quick for development but requires you to have PostgreSQL installed and to set up the database manually.

1.  **Create the Database:**
    Connect to your local PostgreSQL instance (e.g., by running `psql -U postgres` in your terminal) and execute the following SQL command:
    ```sql
    CREATE DATABASE project_modernization_users;
    ```

2.  **Run the Flask Server:**
    From the project's root directory (and with your Python virtual environment activated), run:
    ```bash
    flask --app . run --host=0.0.0.0 --port=3006
    ```

---

### Running Tests

> **Important!**
> Before running the test suite, the application needs to connect to a **separate, dedicated test database** to avoid wiping your development data. Assuming your test configuration (`.env.test`) points to a database named `project_modernization_users`, make sure to create it first.
>
> Connect to `psql` and run:
> ```sql
> CREATE DATABASE project_modernization_users;
> ```

#### **Run Basic Tests**
```bash
python -m pytest -vv
```
#### Run Tests with Coverage

```bash
coverage run -m pytest -vv
coverage report -m --fail-under=90
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
- **Description:** Retrieves a list of all users. Supports optional pagination.
- **Query Parameters (Optional):**

    | Parameter | Type | Description |
    | --- | --- | --- |
    | page | Integer | The page number to retrieve. |
    | per_page| Integer | The number of users to return per page. |

- **Responses:**
  - `200 OK` – Users retrieved successfully.
    - **Response Body (when not paginated):** An array of user objects.
  
      ```json
      [
      { "id": 1, "name": "John Doe", "...": "..." },
      { "id": 2, "name": "Jane Smith", "...": "..." }
      ]
      ```

    - **Response Body (when paginated, e.g., /users/?page=1&per_page=2):** A pagination object.
  
      ```json
      {
        "users": [
          { "id": 1, "name": "John Doe", "...": "..." },
          { "id": 2, "name": "Jane Smith", "...": "..." }
        ],
        "total": 25,
        "pages": 13,
        "page": 1,
        "per_page": 2,
        "has_next": true,
        "has_prev": false
      }
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
