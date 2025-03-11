# FILE: /tabletop-playtester/tabletop-playtester/README.md

# Tabletop Playtester

This app helps game designers playtest their tabletop games remotely, as quickly and easily as possible.

## Features

- Fast and intuitive interface
- Real-time updates for all players
- No account required
- Minimal setup
- In-game chatbox

Game pieces:
- Cards (drag and drop images to add cards)
- Dice (click to roll dice)
- Counters (click to add or subtract from a counter)
- Markers (click to add a marker with a preset symbol or upload your own)
- Backgrounds (click to change the background, default is a grid)
- Turn tracker
- Deck holder (drag and drop cards onto the deck holder to form a deck)
- Hand (drag and drop cards from the deck holder to the hand - must choose assigned player when creating hand)
- Save client ID in local storage to keep the same player name and color when rejoining the game

## How To Use

1. Create a new game session by clicking the "Start New Session" button.
2. Share the link with your playtesters.
3. Add game pieces to the board by clicking the buttons on the left side of the screen, or by dragging and dropping images onto the board.
4. Playtest your game!

## Development

The app is built with a client-server architecture. The server is built with Express.js and Socket.io, and the client is built with React and Vite. They are able to be run independently of each other, so they can be deployed separately. The client can be built as a static site and hosted on a CDN, and the server can be hosted on a cloud provider.

### Prerequisites

- Node.js

### Setup

1. Clone the repository.
2. Run `npm install` in the root directory of both the client and server.
3. Run `npm run dev` in the client directory to start the development server.

### Server

- Express.js - for serving the client and handling API requests
- Socket.io - for real-time updates of game state
- TypeScript - for static type checking
- Jest - for testing

### Client

- React - for the UI and non-game pages
- Vite - for fast development and build performance
- TypeScript - for static type checking
- Vanilla CSS - no frameworks
- Pixi.js - for rendering the game board