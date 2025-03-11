# FILE: /tabletop-playtester/tabletop-playtester/client/README.md

## Client Documentation

This document provides information specific to the client-side of the Tabletop Playtester application.

### Overview

The client is built using React and Vite, providing an interactive interface for playtesting tabletop games. It communicates with the server via WebSocket for real-time updates.

### Features

- Fast and intuitive interface built with React
- Real-time game state updates using socket.io
- Vanilla CSS for styling
- Supports drag-and-drop functionality for game pieces

### Getting Started

1. Ensure you have Node.js installed on your machine.
2. Navigate to the `client` directory.
3. Install the dependencies by running:
   ```
   npm install
   ```
4. Start the development server with:
   ```
   npm run dev
   ```
5. Open your browser and go to `http://localhost:3000` to view the application.

### Project Structure

- `public/index.html`: Main HTML file for the client application.
- `src/components/App.tsx`: Root component of the React application.
- `src/styles/main.css`: Global styles for the application.
- `src/types/index.ts`: TypeScript interfaces and types for static type checking.
- `src/index.tsx`: Entry point for the React application.

### Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

### License

This project is licensed under the MIT License. See the LICENSE file for details.