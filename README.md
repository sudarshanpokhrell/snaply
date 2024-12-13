# Snaply

Snaply is a modern web application designed to provide seamless photo sharing and social networking experience. This README provides an overview of the project structure, setup instructions, and usage guidelines.

## Project Structure

The project is divided into two main parts:
1. **Client**: The front-end part of the application.
2. **Server**: The back-end part of the application.

### Client

The client is built using modern web technologies to ensure a responsive and user-friendly interface.

#### Technologies Used
- React
- Redux
- Axios
- Material-UI

#### Setup Instructions

1. Navigate to the client directory:
    ```bash
    cd client
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm start
    ```

### Server

The server handles the business logic, database interactions, and API endpoints.

#### Technologies Used
- Node.js
- Express
- MongoDB
- Mongoose

#### Setup Instructions

1. Navigate to the server directory:
    ```bash
    cd server
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables by creating a `.env` file in the server directory and adding the following:
    ```
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    ```
4. Start the server:
    ```bash
    npm start
    ```

## Usage

1. Ensure both the client and server are running.
2. Open your browser and navigate to `http://localhost:3000` to access the Snaply application.

## Contributing

We welcome contributions! Please follow these steps to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or feedback, please contact us at [support@snaply.com](mailto:support@snaply.com).
