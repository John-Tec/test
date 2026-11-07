// Simulación de Base de Datos (JSON) con temáticas de ADSO
const lessonsData = [
    {
        id: 1,
        title: "¿Qué es una API REST?",
        category: "Backend",
        time: "3 min",
        summary: "Comprende cómo se comunican el Frontend y el Backend mediante HTTP.",
        content: "<p>Una <b>API REST</b> es una interfaz que permite que dos sistemas se comuniquen entre sí usando el protocolo HTTP (como la web).</p><br><p>Utiliza métodos estándar como:</p><ul><li><b>GET:</b> Para obtener datos.</li><li><b>POST:</b> Para crear datos.</li><li><b>PUT:</b> Para actualizar.</li><li><b>DELETE:</b> Para borrar.</li></ul><p>Los datos suelen enviarse en formato <code>JSON</code>.</p>",
        question: "¿Qué método HTTP se usa generalmente para OBTENER datos?",
        options: ["POST", "GET", "DELETE"],
        correct: 1, // Índice de la respuesta correcta (GET)
        completed: false
    },
    {
        id: 2,
        title: "Los 3 pilares de Scrum",
        category: "Metodologías",
        time: "2 min",
        summary: "Transparencia, Inspección y Adaptación explicados rápidamente.",
        content: "<p>Scrum es un marco de trabajo ágil basado en el empirismo. Sus tres pilares son:</p><br><p>1. <b>Transparencia:</b> Todos saben qué está pasando.<br>2. <b>Inspección:</b> Revisar constantemente el progreso hacia la meta.<br>3. <b>Adaptación:</b> Ajustar el proceso si algo sale mal.</p>",
        question: "¿Cuál NO es un pilar de Scrum?",
        options: ["Transparencia", "Documentación Extensa", "Adaptación"],
        correct: 1,
        completed: false
    },
    {
        id: 3,
        title: "Flexbox: Centrar un Div",
        category: "Frontend",
        time: "2 min",
        summary: "El truco definitivo de CSS para centrar elementos vertical y horizontalmente.",
        content: "<p>Olvídate de sufrir centrando elementos. Con <b>Flexbox</b> solo necesitas aplicar estas 3 líneas al contenedor padre:</p><br><pre style='background:#000; padding:10px; border-radius:5px;'>.padre {\n  display: flex;\n  justify-content: center; /* Horizontal */\n  align-items: center; /* Vertical */\n}</pre>",
        question: "¿Qué propiedad alinea los elementos verticalmente en Flexbox (dirección por defecto)?",
        options: ["justify-content", "align-items", "display-flex"],
        correct: 1,
        completed: false
    },
    {
        id: 4,
        title: "Sentencia INNER JOIN",
        category: "Bases de Datos",
        time: "4 min",
        summary: "Aprende a unir dos tablas relacionales en SQL fácilmente.",
        content: "<p>El <code>INNER JOIN</code> busca coincidencias entre dos tablas. Si tienes una tabla <b>Usuarios</b> y otra <b>Pedidos</b>, puedes unirlas así:</p><br><pre style='background:#000; padding:10px; border-radius:5px;'>SELECT Usuarios.nombre, Pedidos.fecha\nFROM Usuarios\nINNER JOIN Pedidos ON Usuarios.id = Pedidos.usuario_id;</pre>",
        question: "¿Qué palabra clave especifica la condición de unión en un JOIN?",
        options: ["WHERE", "ON", "WITH"],
        correct: 1,
        completed: false
    },
    {
        id: 5,
        title: "Comandos básicos de Git",
        category: "Backend",
        time: "3 min",
        summary: "El flujo básico para guardar tus cambios en el repositorio.",
        content: "<p>Para guardar tu código usando Git, recuerda siempre esta secuencia de 3 pasos:</p><br><p>1. <code>git add .</code> (Prepara los archivos)<br>2. <code>git commit -m 'mensaje'</code> (Guarda una instantánea)<br>3. <code>git push</code> (Sube los cambios a GitHub/GitLab)</p>",
        question: "¿Qué comando sube tus commits locales a la nube (GitHub)?",
        options: ["git commit", "git upload", "git push"],
        correct: 2,
        completed: false
    }
];

// Variables globales
const grid = document.getElementById('lessons-grid');
const modal = document.getElementById('lesson-modal');
const closeModal = document.getElementById('close-modal');
const btnComplete = document.getElementById('btn-complete');
const progressBar = document.getElementById('daily-progress');
let currentLessonId = null;
let progress = 0;

// 1. Renderizar Tarjetas
function renderLessons(filter = 'all') {
    grid.innerHTML = '';
    
    const filteredLessons = filter === 'all' 
        ? lessonsData 
        : lessonsData.filter(lesson => lesson.category === filter);

    filteredLessons.forEach(lesson => {
        const card = document.createElement('div');
        card.className = `card ${lesson.completed ? 'completed' : ''}`;
        
        card.innerHTML = `
            <div>
                <div class="card-header">
                    <span class="badge">${lesson.category}</span>
                    <span class="time"><i class="fa-regular fa-clock"></i> ${lesson.time}</span>
                </div>
                <h3>${lesson.title}</h3>
                <p>${lesson.summary}</p>
            </div>
            <button class="btn-start" onclick="openLesson(${lesson.id})">
                ${lesson.completed ? '<i class="fa-solid fa-check"></i> Completado' : 'Iniciar Cápsula'}
            </button>
        `;
        grid.appendChild(card);
    });
}

// 2. Filtrado por categorías
document.querySelectorAll('.cat-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        renderLessons(e.target.dataset.category);
    });
});

// 3. Abrir Modal con la lección
function openLesson(id) {
    const lesson = lessonsData.find(l => l.id === id);
    currentLessonId = id;

    document.getElementById('modal-category').innerText = lesson.category;
    document.getElementById('modal-title').innerText = lesson.title;
    document.getElementById('modal-body').innerHTML = lesson.content;
    document.getElementById('modal-question').innerText = lesson.question;
    
    const optionsContainer = document.getElementById('modal-options');
    optionsContainer.innerHTML = '';
    
    btnComplete.disabled = true; // Deshabilitar hasta que responda bien

    lesson.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(btn, index, lesson.correct);
        optionsContainer.appendChild(btn);
    });

    modal.style.display = 'flex';
}

// 4. Validar respuesta del Quiz
function checkAnswer(selectedBtn, selectedIndex, correctIndex) {
    const allOptions = document.querySelectorAll('.option-btn');
    allOptions.forEach(btn => btn.disabled = true); // Bloquear botones

    if (selectedIndex === correctIndex) {
        selectedBtn.classList.add('correct');
        btnComplete.disabled = false; // Habilitar botón de completar
    } else {
        selectedBtn.classList.add('wrong');
        allOptions[correctIndex].classList.add('correct'); // Mostrar la correcta
        setTimeout(() => {
            // Permitir reintentar después de 1.5 seg
            allOptions.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('wrong', 'correct');
            });
        }, 1500);
    }
}

// 5. Completar lección y actualizar progreso
btnComplete.addEventListener('click', () => {
    const lesson = lessonsData.find(l => l.id === currentLessonId);
    if (!lesson.completed) {
        lesson.completed = true;
        updateProgress();
    }
    modal.style.display = 'none';
    
    // Obtener filtro actual para re-renderizar correctamente
    const activeCategory = document.querySelector('.cat-btn.active').dataset.category;
    renderLessons(activeCategory);
});

function updateProgress() {
    const completedCount = lessonsData.filter(l => l.completed).length;
    const total = lessonsData.length;
    const percentage = (completedCount / total) * 100;
    progressBar.style.width = `${percentage}%`;
}

// Cerrar modal
closeModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// Inicializar la app
renderLessons();