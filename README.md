# Airbnb Clone

## Description

This is an Airbnb clone project that allows users to authenticate, list room locations, add reviews, and perform CRUD (Create, Read, Update, Delete) operations on listings and reviews.

## Features

- **User Authentication**: Signup, login, logout, and user management.
- **Room Listings**: Users can create, update, delete, and view available room locations.
- **Reviews**: Users can add, update, delete, and read reviews for each listing.
- **CRUD Operations**: Applied to both room listings and reviews.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: EJS for templating
- **Database**: MongoDB, Mongoose
- **Authentication**: Session-based authentication
- **Middleware**: Method-override, EJS-Mate

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/airbnb-clone.git
   cd airbnb-clone
   ```
2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```
3. Set up environment variables:
   ```sh
   cp .env.example .env
   ```
4. Start the development server:
   ```sh
   npm start  # or yarn start
   ```

## API Endpoints

| Method | Endpoint                           | Description                     |
| ------ | --------------------------------- | ------------------------------- |
| GET    | `/`                               | Root route                      |
| GET    | `/listings`                       | Get all room listings           |
| GET    | `/listings/new`                   | Render form for new listing     |
| POST   | `/listings`                       | Create a new room listing       |
| GET    | `/listings/:id`                   | View a specific listing         |
| GET    | `/listings/:id/edit`              | Edit a listing                  |
| PUT    | `/listings/:id`                   | Update room details             |
| DELETE | `/listings/:id`                   | Delete a room listing           |
| POST   | `/listings/:id/reviews`           | Add a review to a listing       |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete a review from a listing  |

## Error Handling

- Custom error handler middleware is used to catch and manage errors.
- `ExpressError.js` handles custom errors with status codes and messages.

## Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

## License

This project is licensed under the MIT License. See `LICENSE` for details.

