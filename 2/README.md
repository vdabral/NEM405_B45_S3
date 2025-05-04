# Simple Express User App

## Description
This is a basic Express.js app that serves user-related routes.

## Setup Instructions

1. Clone the repository
2. Run `npm install` to install dependencies
3. Start the server: `node server.js`

## Routes

- `GET /users/get` → Returns a single dummy user
- `GET /users/list` → Returns a list of 3 dummy users
- All other routes return `{ "error": "404 Not Found" }`

## Example

Visit `http://localhost:3000/users/get` to test the single user route.
