## End points

Users:

POST /users - Create a new user

GET /users - Get all users

GET /users/:id - Get a specific user

PUT /users/:id - Update a user

DELETE /users/:id - Delete a user

Posts:

POST /posts - Create a new post

GET /posts - Get all posts (includes username)

GET /posts/:id - Get a specific post

PUT /posts/:id - Update a post

DELETE /posts/:id - Delete a post

GET /users/:id/posts - Get all posts by a specific user

### Example usage:

Create a user:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"username":"john","email":"john@example.com"}' http://localhost:3000/users
