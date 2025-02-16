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

### Get Queue Status

**Endpoint:** `/api/queue/status`

**Method:** `GET`

**Description:** Get the current status of the queue.

**Headers:**
- `Authorization` (string): Bearer token.

**Response:**
- `200 OK`: Returns the current queue status.
- `500 Internal Server Error`: If there is an error getting the queue status.

**Example:**
```json
{
  "Authorization": "Bearer <token>"
}
```

### Get Queue List (Drivers Only)

**Endpoint:** `/api/queue/list`

**Method:** `GET`

**Description:** Get the full list of the queue (drivers only).

**Headers:**
- `Authorization` (string): Bearer token.

**Response:**
- `200 OK`: Returns the full queue list.
- `403 Forbidden`: If the user is not a driver.
- `500 Internal Server Error`: If there is an error getting the queue list.

**Example:**
```json
{
  "Authorization": "Bearer <token>"
}
```

## Socket.IO Events

### Connect

**Event:** `connect`

**Description:** Establish a connection to the server.

### Join Queue

**Event:** `queue_join`

**Description:** Join the queue.

**Payload:**
- `token` (string): JWT token.

**Response:**
- `queueUpdate`: Emits the updated queue status.

### Leave Queue

**Event:** `queue_leave`

**Description:** Leave the queue.

**Payload:**
- `token` (string): JWT token.

**Response:**
- `queueUpdate`: Emits the updated queue status.

### Cancel Queue

**Event:** `queue_cancel`

**Description:** Move to the end of the queue.

**Payload:**
- `token` (string): JWT token.

**Response:**
- `queueUpdate`: Emits the updated queue status.

### Queue Update

**Event:** `queueUpdate`

**Description:** Receive updates about the queue status.

**Payload:**
- `queue` (array): The current queue.
- `length` (number): The length of the queue.
- `queueDetails` (array): Detailed information about the queue.

## Error Responses

All endpoints and events may return the following error responses:
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

### Testing with Socket.IO

You can use tools like Socket.IO Client or a custom frontend to test the Socket.IO events. Make sure to include the `token` in the payload for authentication.

### Notes

- Ensure to replace `your_jwt_secret` with a strong secret key.
- You can change the `PORT` and `MONGODB_URI` values as per your setup.
