import Snake from "./Snake.js";

window.addEventListener("load", function(evt) {
  let lastTime = Date.now();
  let current = 0;
  let elapsed = 0;

  let snake = new Snake();

  (function gameLoop() {
    current = Date.now();
    elapsed = (current - lastTime) / 1000;

    snake.processInput();
    snake.update(elapsed);
    snake.render();

    lastTime = current;

    window.requestAnimationFrame(gameLoop);
  })();

});
