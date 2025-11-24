# Hidden Hands

Hidden Hands is a card-guessing game inspired by Higher or Lower. Players place cards on the table and try to guess the total value of all cards placed so far. The project includes two modes: a single-player mode and a 1v1 mode against an AI opponent.

Each player starts with 13 cards, numbered from 1 to 13, in four colours (red, green, blue, yellow).



## Gameplay

### Single Player Mode

* The player has a hidden hand and a hidden table.
* Each turn, the player chooses a card from their hand to place on the table (without seeing its value).
* After placing a card, the player guesses the total value of all cards currently on the table.

  * If the guess is too high, the game replies “Lower!”.
  * If the guess is too low, the game replies “Higher!”.
* The game ends when the player guesses the correct total or after 12 cards have been placed (since the last card makes the total obvious).

### 1v1 Mode Against AI

* The human player has a visible hand and table, while the AI’s hand is hidden.
* Turns alternate as follows:

  1. The player places a card.
  2. The AI guesses the total of the player’s table and receives feedback.
  3. The AI places a card.
  4. The player guesses the total of the AI’s table and receives feedback.
* The game ends when either (or both) players guess correctly or when both reach 12 guesses (if the limit was 13 it would be very easy to work out the sum of values of 13 cards, numbered 1 to 13).
* Both players can win if they both guess correctly on the same turn.



## AI Design

The AI currently uses a very simple strategy:

* When guessing, it looks at its previous guess (Higher/Lower) and picks a number at random within a reasonable range.
* When choosing a card to place, it simply picks one randomly from its hand.

Why I chose this approach:

* It was quick to implement and worked well enough to demonstrate the idea.
* It keeps the focus on the game logic rather than advanced AI techniques.

Future improvements I would like to explore:

* Smarter strategies such as Monte Carlo simulations or probability-based reasoning.
* Tracking which card values are likely or unlikely based on earlier turns.
* Making the AI adapt its guesses over time instead of relying on random choices.



## Technical Decisions

* Node.js & TypeScript:
  I chose TypeScript so the game engine could be written with clear types and classes. It also allows the same logic to be reused later in a frontend version (which I didn’t have time to implement).

* Game Engine Structure:
  The Game folder (including enigne and objects) is separated from the interface so that the logic is independent of how the game is displayed. Objects include `Card`, `Deck`, `Player`, and `Game` classes, and the engine includes AI logic and files that track the state of the current game (some states, for example: `PLAYER_TURN`, `AI_GUESSING`, and `VICTORY`).

* CLI Interface:
  The command-line version uses a small async input system to let the player interact with the game. This made testing and running the game straightforward.



## Ideas for Future Development

* Build a web interface (e.g., with React + TailwindCSS).
* Replace the random AI with a more strategic or data-driven model.
* Add different game modes, difficulty levels, or special cards.



## Installation & Usage

1. Clone the repository:

   git clone https://github.com/yusefzzz/hidden-hands-hawkeye
   cd hidden-hands

2. Install dependencies:

   npm install

3. Run the game:

   npx ts-node src/cli/main.ts
