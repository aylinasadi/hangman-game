# Hangman Game

A horror-themed Hangman game built with React. Guess randomly generated words, use limited hints, and try to survive before running out of lives.

**[Play the Game](https://aylinasadi.github.io/hangman-game/)**

## Overview

This project is a browser-based Hangman game featuring a dark, horror-inspired interface. Players choose a difficulty level, receive a randomly selected word through the Datamuse API, and attempt to guess it using individual letters.

The game combines traditional Hangman mechanics with sound effects, visual danger indicators, limited hints, and word definitions displayed at the end of each round.

## Features

* **Three difficulty levels:** Easy, Medium, and Hard, each with different word lengths, number of lives, and available hints.
* **Dynamic word selection:** Words are retrieved from the Datamuse REST API based on the selected difficulty.
* **Interactive keyboard:** Guess letters using either the on-screen keyboard or your physical keyboard.
* **Hint system:** Reveal randomly selected unguessed letters using a limited number of hints.
* **Sound effects:** Locally stored audio for correct guesses, incorrect guesses, hints, heartbeat, and game results.
* **Sound controls:** Toggle sound effects on or off. The preference is saved between sessions.
* **Game results:** View whether you won or lost, the secret word, the definition of the secret word, remaining lives, and hints used.
* **Responsive design:** Layout adapts to different screen sizes, including mobile devices.
* **Accessibility:** Includes keyboard interaction, screen-reader announcements, focus management, and reduced-motion support.

## Difficulty Levels

| Difficulty | Word Length | Available Lives |
| ---------- | ----------: | --------------: |
| Easy       |   5 letters |               8 |
| Medium     |   7 letters |               6 |
| Hard       |  10 letters |               4 |

Players can also use hints to reveal randomly selected letters. The number of available hints depends on the length of the selected word.

## Screens

The application consists of three screens:

1. **Home:** Select a difficulty level and start a new game.
![Home Screen](./screenshots/home.png)

2. **Game:** Guess letters, monitor remaining lives, use hints, and manage sound settings.
![Game Screen](./screenshots/game.png)

3. **Game Over:** View the result, reveal the secret word, and see its definition when available.
![Game Over Screen](./screenshots/game-over.png)


## Technologies Used

| Technology        | Purpose                                           |
| ----------------- | ------------------------------------------------- |
| React             | Component-based UI and application state          |
| React Router      | Navigation between application screens            |
| Bootstrap 5       | Responsive layout and styling utilities           |
| CSS3              | Custom styling, animations, and responsive design |
| JavaScript (ES6+) | Game logic and application functionality          |
| Vite              | Development server and production build           |
| Datamuse API      | Word selection and word definitions               |
| HTML Audio API    | Playback of local sound effects                   |

## API Integration

The application uses the [Datamuse API](https://www.datamuse.com/api/), a public REST API that provides word-related data in JSON format.

Two API requests are used:

**1. Word selection**

The `/words` endpoint uses the `sp` parameter with a wildcard pattern to retrieve words matching the required length.

```text
https://api.datamuse.com/words?sp=?????&max=100
```

The application filters the returned results to include single alphabetic words and randomly selects one for the game.

**2. Word definitions**

After a game ends, another request retrieves definition metadata for the secret word.

```text
https://api.datamuse.com/words?sp=example&md=d&max=1
```

Both requests use JavaScript's `fetch()` API with `async/await`.

## Running Locally

### Prerequisites

* Node.js 22 or a compatible version
* npm

### Installation

Clone the repository:

```bash
git clone https://github.com/aylinasadi/hangman-game.git
```

Navigate to the project directory:

```bash
cd hangman-game
```

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

### Available Scripts

| Command           | Description                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Starts the development server         |
| `npm run build`   | Creates a production build            |
| `npm run preview` | Previews the production build locally |
| `npm run lint`    | Runs ESLint to check the code         |

## Deployment

The application is deployed using **GitHub Pages**.

Deployment is automated through GitHub Actions. Every push to the `main` branch triggers a workflow that installs dependencies, builds the application, and deploys the production files to GitHub Pages.

**Live application:** https://aylinasadi.github.io/hangman-game/

## Future Improvements

- Implement an animated 3D hangman figure that reacts to incorrect guesses.
- Add personal gameplay statistics, including win rate, games played, and winning streaks.
- Introduce a global leaderboard to compare player scores.
