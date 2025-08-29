// ---------- TODO LIST DEMO ----------
const todoInput = document.getElementById('todo-input');
const todoAdd = document.getElementById('todo-add');
const todoList = document.getElementById('todo-list');
const todoClear = document.getElementById('todo-clear');

function readTodos(){
  return JSON.parse(localStorage.getItem('cet138_todos') || '[]');
}
function saveTodos(todos){
  localStorage.setItem('cet138_todos', JSON.stringify(todos));
}
function renderTodos(){
  const todos = readTodos();
  todoList.innerHTML = '';
  todos.forEach((t, i) =>{
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `<span>${escapeHtml(t)}</span><button class="btn btn-sm btn-outline-danger" title="Delete this task">Delete</button>`;
    li.querySelector('button').addEventListener('click', ()=>{
      todos.splice(i,1); saveTodos(todos); renderTodos();
    });
    todoList.appendChild(li);
  });
}
function escapeHtml(str){
  return str.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}
todoAdd.addEventListener('click', ()=>{
  const text = todoInput.value.trim();
  if(!text) return todoInput.focus();
  const todos = readTodos(); todos.push(text); saveTodos(todos); todoInput.value=''; renderTodos();
});
todoInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') todoAdd.click(); });
todoClear.addEventListener('click', ()=>{ if(confirm('Clear all todos?')){ saveTodos([]); renderTodos(); } });
renderTodos();

// ---------- FORM VALIDATOR DEMO ----------
const demoForm = document.getElementById('demo-form');
const formResult = document.getElementById('form-result');
demoForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  let valid = true;
  if(!name.value.trim()){ name.classList.add('is-invalid'); valid=false; } else { name.classList.remove('is-invalid'); }
  if(!email.checkValidity()){ email.classList.add('is-invalid'); valid=false; } else { email.classList.remove('is-invalid'); }
  if(valid){
    formResult.innerHTML = `<div class="alert alert-success">Thanks, ${escapeHtml(name.value)} — your email (${escapeHtml(email.value)}) looks good.</div>`;
    demoForm.reset();
  } else {
    formResult.innerHTML = `<div class="alert alert-danger">Please fix the errors and try again.</div>`;
  }
});

// ===== Snake Game =====
const snakeStartBtn = document.getElementById('snake-start');
const snakeContainer = document.getElementById('snake-container');
let gameInterval = null;

snakeStartBtn.addEventListener('click', startSnakeGame);

function startSnakeGame() {
    if (gameInterval) clearInterval(gameInterval);
    snakeContainer.innerHTML = '';

    const gridSize = 20; // number of tiles per row/col
    const tileSize = snakeContainer.offsetWidth / gridSize; // dynamic size
    let snake = [{ x: 10, y: 10 }];
    let direction = { x: 1, y: 0 }; // initial right
    let food = spawnFood();

    document.onkeydown = (e) => {
        switch (e.key) {
            case 'ArrowUp': if (direction.y === 0) direction = { x: 0, y: -1 }; break;
            case 'ArrowDown': if (direction.y === 0) direction = { x: 0, y: 1 }; break;
            case 'ArrowLeft': if (direction.x === 0) direction = { x: -1, y: 0 }; break;
            case 'ArrowRight': if (direction.x === 0) direction = { x: 1, y: 0 }; break;
        }
    };

    gameInterval = setInterval(() => {
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        // Collision with walls or self
        if (head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize || snake.some(s => s.x === head.x && s.y === head.y)) {
            clearInterval(gameInterval);
            alert('Game Over! Press Start to play again.');
            return;
        }

        snake.unshift(head);

        // Eat food
        if (head.x === food.x && head.y === food.y) {
            food = spawnFood();
        } else {
            snake.pop();
        }

        draw();
    }, 150);

    function spawnFood() {
        let x, y;
        do {
            x = Math.floor(Math.random() * gridSize);
            y = Math.floor(Math.random() * gridSize);
        } while (snake.some(s => s.x === x && s.y === y));
        return { x, y };
    }

    function draw() {
        snakeContainer.innerHTML = '';

        // Draw snake
        snake.forEach(seg => {
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.width = div.style.height = `${tileSize}px`;
            div.style.left = `${seg.x * tileSize}px`;
            div.style.top = `${seg.y * tileSize}px`;
            div.style.background = 'green';
            div.style.borderRadius = '4px';
            snakeContainer.appendChild(div);
        });

        // Draw food
        const foodDiv = document.createElement('div');
        foodDiv.style.position = 'absolute';
        foodDiv.style.width = foodDiv.style.height = `${tileSize}px`;
        foodDiv.style.left = `${food.x * tileSize}px`;
        foodDiv.style.top = `${food.y * tileSize}px`;
        foodDiv.style.background = 'red';
        foodDiv.style.borderRadius = '50%';
        snakeContainer.appendChild(foodDiv);
    }

    draw(); // initial draw
}


