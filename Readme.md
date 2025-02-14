# AutoMate API

## Authentication Routes

### Signup

**Endpoint:** `/api/auth/signup`

**Method:** `POST`

**Description:** Create a new user account.

**Request Body:**
- `email` (string): The email address of the user.
- `password` (string): The password for the user account.
- `role` (string): The role of the user, either `student` or `driver`.

**Response:**
- `201 Created`: Returns a JSON object with a JWT token.
- `400 Bad Request`: If the user already exists.
- `500 Internal Server Error`: If there is an error creating the user.

**Example:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "student"
}
```

### Login

**Endpoint:** `/api/auth/login`

**Method:** `POST`

**Description:** Log in an existing user.

**Request Body:**
- `email` (string): The email address of the user.
- `password` (string): The password for the user account.

**Response:**
- `200 OK`: Returns a JSON object with a JWT token.
- `401 Unauthorized`: If the credentials are invalid.
- `500 Internal Server Error`: If there is an error logging in.

**Example:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

## Queue Routes

### Join Queue

**Endpoint:** `/api/queue/join`

**Method:** `POST`

**Description:** Join the queue.

**Headers:**
- `Authorization` (string): Bearer token.

**Response:**
- `200 OK`: Returns the position in the queue.
- `400 Bad Request`: If the user is already in the queue.
- `500 Internal Server Error`: If there is an error joining the queue.

**Example:**
```json
{
  "Authorization": "Bearer <token>"
}
```

### Leave Queue

**Endpoint:** `/api/queue/leave`

**Method:** `POST`

**Description:** Leave the queue.

**Headers:**
- `Authorization` (string): Bearer token.

**Response:**
- `200 OK`: Returns a message indicating removal from the queue.
- `404 Not Found`: If the queue is not found.
- `500 Internal Server Error`: If there is an error leaving the queue.

**Example:**
```json
{
  "Authorization": "Bearer <token>"
}
```

### Cancel (Move to End of Queue)

**Endpoint:** `/api/queue/cancel`

**Method:** `POST`

**Description:** Move to the end of the queue.

**Headers:**
- `Authorization` (string): Bearer token.

**Response:**
- `200 OK`: Returns the new position in the queue.
- `404 Not Found`: If the queue is not found.
- `500 Internal Server Error`: If there is an error updating the queue position.

**Example:**
```json
{
  "Authorization": "Bearer <token>"
}
```

## Error Responses

All endpoints may return the following error responses:
- `401 Unauthorized`: If the user is not authenticated.
- `500 Internal Server Error`: If there is an internal server error.

## Notes

- Ensure to replace `<token>` with the actual JWT token received from the login or signup response.
- All requests and responses are in JSON format.

## Running the App Locally

To run this app on your own device, follow these steps:

### Prerequisites

- Node.js (version 14.x or higher)
- npm (version 6.x or higher)
- MongoDB (running locally or a connection string to a MongoDB instance)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/afloatwont/AutoMate.git
   cd AutoMate
   ```

2. Install the dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   PORT=3000
   MONGODB_URI=<mongo_db_uri>
   JWT_SECRET=your_jwt_secret
   ```

### Running the App

1. Start the application:
   ```sh
   npm start
   ```

2. The app should now be running on `http://localhost:3000`.

### Testing the Endpoints

You can use tools like Postman or curl to test the API endpoints. Make sure to include the `Authorization` header with the JWT token for protected routes.

### Notes

- Ensure to replace `your_jwt_secret` with a strong secret key.
- You can change the `PORT` and `MONGODB_URI` values as per your setup.
