# Battleship Browser Game

A fully interactive **Battleship game built for the browser**, developed as part of **The Odin Project curriculum**.
This project focuses entirely on **Vanilla JavaScript**, emphasizing game logic, DOM manipulation, and clean architecture rather than relying on frameworks.

---

## Description

The **Battleship Browser Game** is a classic strategy game where a human player competes against the computer using two dynamic game grids. The game was built from scratch with a strong focus on:

- Deep JavaScript logic and state management
- Complete separation between **game logic** and **UI rendering**
- Scalable, maintainable code structure using modern JavaScript patterns
- A responsive and intuitive user experience

The player can **manually place ships**, rotate them, and interact with the board using **drag & drop** mechanics. The computer opponent plays automatically against the human player, creating a complete single-player experience.

This project represents my first **fully complete logical application** that combines both UI behavior and underlying game rules.

---

## Time Spent

I spent **~120 hours** total on this project, including:

- ~60 hours learning and planning JavaScript concepts
- ~60 hours implementing the game, debugging, refactoring, and improving the architecture

The project was paused and revisited after a long break, which helped me learn:

- How to **trace old code**
- The importance of **refactoring**
- Writing code that remains readable and maintainable over time

---

## Features

- Fully playable Battleship game in the browser
- Computer opponent
- Drag & drop ship placement
- Ship rotation support
- Two dynamic game grids (player & computer)
- Game logic fully separated from UI
- Responsive layout (desktop-first, mobile supported)
- Unit tests written with Jest where applicable

---

## Architecture & Approach

- **Factory Functions** for creating game entities
- **ES Modules** for code organization
- Clear separation between:

  - Game rules & state
  - DOM creation & UI updates

- UI components are **created and destroyed dynamically** using JavaScript
- Focus on scalability and reusability rather than hard-coded behavior

AI tools were used **responsibly**:

- To deepen understanding of JavaScript concepts
- To review and enhance code _after_ writing it
- To analyze complex bugs instead of blindly fixing them

---

## Technologies Used

- **JavaScript (ES6+)**
- **Webpack 5**
- **HTML5**
- **CSS3**
- **CSS Grid & Flexbox**
- **Tailwind CSS** (used minimally)
- **Jest** (unit testing)
- **NPM (Node Package Manager)**

---

## Demo

You can view a live demo of the **Battleship Browser Game** here:

**Live Demo:** _(https://battleship-game-three.vercel.app/)_

---

## 📂 Repository Setup

```bash
# install dependencies
npm install

# start development server
npm run dev

# build for production
npm run build

# run tests
npm test
```

---

## Learning Outcomes

Through this project, I:

- Mastered practical JavaScript beyond syntax
- Learned how to plan, structure, and scale an application
- Improved my debugging and problem-solving skills
- Gained confidence building complete browser-based games

---

## Notes

This project is part of **The Odin Project** and was built strictly with Vanilla JavaScript to strengthen core web development skills.
