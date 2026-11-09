// =================================================================
// ==      MOTOR JAVASCRIPT MAESTRO: SIDEBAR, PRISM & DATOS        ==
// =================================================================

// 1. TOGGLE DE MENÚ LATERAL (HAMBURGUESA)
function toggleSidebar() {
    const sidebar = document.getElementById('master-sidebar');
    if (!sidebar) return;
    
    if (window.innerWidth < 1200) {
        sidebar.classList.toggle('show-mobile');
    } else {
        sidebar.classList.toggle('collapsed');
    }
}

// 2. EXPANDIR TODOS LOS CONTENIDOS PERMANENTEMENTE (CERO CONTENIDO OCULTO)
function ensureAllContentExpanded() {
    document.querySelectorAll('.collapse, .accordion-collapse').forEach(el => {
        el.classList.remove('collapse');
        el.classList.add('content-expanded-visible');
        el.style.display = 'block';
    });
}

// 3. INYECCIÓN AUTOMÁTICA Y BINDING DE BOTONES DE COPIAR CÓDIGO
async function copyTextToClipboard(text, btn) {
    const raw = text.trim();
    try {
        await navigator.clipboard.writeText(raw);
        showCopiedState(btn);
    } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = raw;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showCopiedState(btn);
    }
}

function showCopiedState(btn) {
    const origHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check text-success me-1"></i> ¡Copiado!';
    btn.classList.add('copied');
    setTimeout(() => {
        btn.innerHTML = origHTML;
        btn.classList.remove('copied');
    }, 2000);
}

function initGlobalCopyButtons() {
    // 1. Botones dentro de .code-box-header
    document.querySelectorAll('.code-box-header .btn-copy-code').forEach(btn => {
        if (btn.dataset.initialized) return;
        btn.dataset.initialized = 'true';
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const container = btn.closest('.code-box-container');
            const code = container ? container.querySelector('code') : null;
            const textToCopy = code ? code.innerText : '';
            await copyTextToClipboard(textToCopy, btn);
        });
    });

    // 2. Botones flotantes en <pre> si no estuvieran en un header
    document.querySelectorAll('pre').forEach(pre => {
        if (pre.closest('.code-box-container')) return;
        if (pre.querySelector('.btn-copy-code')) return;
        pre.style.position = 'relative';

        const btn = document.createElement('button');
        btn.className = 'btn-copy-code';
        btn.type = 'button';
        btn.innerHTML = '<i class="fa-regular fa-copy me-1"></i> Copiar';
        btn.title = 'Copiar código al portapapeles';

        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const code = pre.querySelector('code');
            const rawText = code ? code.innerText : pre.innerText;
            await copyTextToClipboard(rawText, btn);
        });
        pre.appendChild(btn);
    });
}

function triggerPrismHighlight() {
    if (window.Prism) {
        try {
            window.Prism.highlightAll();
        } catch (e) {
            console.warn("Prism highlight error:", e);
        }
    }
}

// 5. BANCO DE PREGUNTAS Y EVALUACIÓN
const questionBank = [
    // ... (el banco de preguntas completo va aquí, no lo repito para brevedad) ...
    // Introducción y Fundamentos
    { question: "¿Quién es el creador de Python?", options: ["Dennis Ritchie", "Guido van Rossum", "James Gosling", "Bjarne Stroustrup"], answer: 1 },
    { question: "¿Qué tipo de dato se usa para almacenar texto en Python?", options: ["integer", "float", "string", "boolean"], answer: 2 },
    { question: "¿Cuál es el operador para la exponenciación en Python?", options: ["^", "**", "!", "pow()"], answer: 1 },
    { question: "El tipo de dato `None` en Python es similar a...", options: ["0", "False", "null en otros lenguajes", "una cadena vacía"], answer: 2 },
    { question: "¿Qué imprimirá `print(10 // 3)`?", options: ["3.333", "3", "1", "Error"], answer: 1 },
    { question: "¿Qué estructura de control se usa para tomar decisiones?", options: ["for", "while", "if/elif/else", "def"], answer: 2 },
    { question: "Un bucle `for` en Python itera sobre...", options: ["un contador numérico", "una condición booleana", "una secuencia de elementos", "una clase"], answer: 2 },
    { question: "¿Qué palabra clave se usa para salir de un bucle prematuramente?", options: ["continue", "exit", "break", "return"], answer: 2 },
    { question: "Una función `lambda` es una función...", options: ["anónima y de una sola línea", "que no devuelve nada", "recursiva", "privada"], answer: 0 },
    { question: "¿Cuál es la forma correcta de definir una función en Python?", options: ["function miFuncion():", "def miFuncion():", "define miFuncion():", "function = miFuncion():"], answer: 1 },

    // Estructuras de Datos
    { question: "¿Cuál de estas estructuras de datos es inmutable?", options: ["Lista", "Diccionario", "Set", "Tupla"], answer: 3 },
    { question: "¿Qué método se usa para añadir un elemento al final de una lista?", options: [".add()", ".push()", ".append()", ".insert()"], answer: 2 },
    { question: "Los diccionarios en Python almacenan datos en pares de...", options: ["índice-valor", "clave-valor", "nombre-tipo", "objeto-atributo"], answer: 1 },
    { question: "¿Qué estructura de datos NO permite elementos duplicados?", options: ["Lista", "Tupla", "Set", "Diccionario"], answer: 2 },
    { question: "¿Cómo se accede al valor asociado a la clave 'edad' en un diccionario llamado `d`?", options: ["d.edad", "d('edad')", "d['edad']", "d.get_edad()"], answer: 2 },
    { question: "La 'List Comprehension' es una forma de...", options: ["comprimir archivos de lista", "crear listas de forma concisa", "una librería para listas", "un tipo especial de lista"], answer: 1 },
    { question: "¿Qué librería es fundamental para el cálculo numérico y el trabajo con arrays?", options: ["Pandas", "Matplotlib", "NumPy", "SciPy"], answer: 2 },
    { question: "¿Qué devuelve `mi_lista[-1]`?", options: ["El primer elemento", "El último elemento", "El segundo elemento", "Error"], answer: 1 },
    { question: "¿Qué método de diccionario se usa para obtener un valor de forma segura, evitando un error si la clave no existe?", options: [".get()", ".find()", ".safe_get()", ".value()"], answer: 0 },
    { question: "Las tuplas se definen usando...", options: ["[]", "{}", "()", "<>"], answer: 2 },

    // POO
    { question: "El plano para crear objetos en POO se llama...", options: ["Método", "Atributo", "Clase", "Instancia"], answer: 2 },
    { question: "¿Qué método se llama automáticamente al crear una instancia de una clase?", options: ["__main__", "__init__", "__start__", "__new__"], answer: 1 },
    { question: "El pilar de la POO que consiste en ocultar la complejidad interna se llama...", options: ["Herencia", "Polimorfismo", "Abstracción", "Encapsulamiento"], answer: 3 },
    { question: "La capacidad de un objeto para tomar muchas formas se conoce como...", options: ["Herencia", "Polimorfismo", "Abstracción", "Encapsulamiento"], answer: 1 },
    { question: "La palabra clave `super()` se usa para...", options: ["llamar a un método de la clase hija", "llamar a un método de la clase padre", "crear una superclase", "terminar la ejecución"], answer: 1 },
    { question: "Un atributo precedido por un guion bajo (ej. `_mi_atributo`) es una convención para indicar que es...", options: ["público", "privado/protegido", "una constante", "un método"], answer: 1 },
    { question: "¿Qué es una instancia?", options: ["Una función dentro de una clase", "Un objeto concreto creado a partir de una clase", "Una variable global", "El constructor de la clase"], answer: 1 },
    { question: "El pilar de la POO que permite a una clase adquirir propiedades de otra se llama...", options: ["Herencia", "Polimorfismo", "Abstracción", "Encapsulamiento"], answer: 0 },
    { question: "Los métodos `getter` y `setter` se usan para...", options: ["controlar el acceso a los atributos de un objeto", "eliminar un objeto", "crear un objeto", "heredar de otra clase"], answer: 0 },
    { question: "¿Qué representa `self` como primer argumento de un método de instancia?", options: ["La clase misma", "El método mismo", "La instancia del objeto que llama al método", "Una variable global"], answer: 2 },

    // APIs y Bases de Datos
    { question: "¿Qué librería de Python es el estándar para hacer peticiones HTTP?", options: ["http.client", "urllib3", "requests", "httplib2"], answer: 2 },
    { question: "El código de estado HTTP `200 OK` significa que la petición...", options: ["fue exitosa", "no fue encontrada", "tuvo un error en el servidor", "requiere autenticación"], answer: 0 },
    { question: "¿Qué es CRUD en el contexto de bases de datos?", options: ["Un tipo de base de datos", "Un lenguaje de consulta", "Las operaciones básicas: Create, Read, Update, Delete", "Una librería de Python"], answer: 2 },
    { question: "¿Qué módulo viene incorporado en Python para trabajar con bases de datos SQLite?", options: ["pysqlite", "sqlite3", "sql.py", "db_sqlite"], answer: 1 },
    { question: "Una API RESTful utiliza verbos HTTP. ¿Cuál se usa comúnmente para obtener datos?", options: ["POST", "GET", "DELETE", "PUT"], answer: 1 },
    { question: "¿Qué es JSON?", options: ["Una base de datos", "Un formato ligero de intercambio de datos", "Un lenguaje de programación", "Una librería de Python"], answer: 1 },
    { question: "En SQL, ¿qué cláusula se usa para filtrar resultados?", options: ["FILTER BY", "WHERE", "SELECT", "GROUP BY"], answer: 1 },
    { question: "¿Qué es una clave foránea (Foreign Key) en una base de datos relacional?", options: ["La clave principal de la tabla", "Una clave que enlaza a una clave primaria en otra tabla", "Una clave encriptada", "Un índice de la tabla"], answer: 1 },
    { question: "El método `response.raise_for_status()` de la librería `requests`...", options: ["lanza un error si el código de estado es de error (4xx o 5xx)", "siempre lanza un error", "devuelve el contenido de la respuesta", "imprime el código de estado"], answer: 0 },
    { question: "Para enviar datos en el cuerpo de una petición POST con `requests`, se suele usar el argumento...", options: ["data", "body", "json", "payload"], answer: 2 },

    // Análisis de Datos y Dashboards
    { question: "¿Qué librería es la más usada para la manipulación de datos tabulares en Python?", options: ["NumPy", "Matplotlib", "Pandas", "Streamlit"], answer: 2 },
    { question: "La estructura de datos principal en Pandas es el...", options: ["Array", "DataFrame", "Matrix", "Series"], answer: 1 },
    { question: "¿Qué librería se usa para crear dashboards interactivos a partir de scripts de Python?", options: ["Flask", "Django", "Streamlit", "Pygame"], answer: 2 },
    { question: "¿Qué función de Pandas se usa para leer un archivo CSV?", options: ["read_csv()", "open_csv()", "load_csv()", "get_csv()"], answer: 0 },
    { question: "Seaborn es una librería de visualización de datos basada en...", options: ["NumPy", "Pandas", "Plotly", "Matplotlib"], answer: 3 },
    { question: "¿Qué hace `df.dropna()` en Pandas?", options: ["Elimina columnas con valores nulos", "Rellena valores nulos con cero", "Elimina filas con valores nulos", "Devuelve los valores nulos"], answer: 2 },
    { question: "Para ejecutar una aplicación de Streamlit, usas el comando...", options: ["python app.py", "streamlit run app.py", "run streamlit app.py", "start app.py"], answer: 1 },
    { question: "El método `.groupby()` en Pandas se usa para...", options: ["ordenar los datos", "agrupar filas basadas en valores de columnas", "obtener el primer grupo de filas", "eliminar grupos"], answer: 1 },
    { question: "¿Qué es un widget en Streamlit?", options: ["Un tipo de gráfico", "Un elemento interactivo como un slider o un botón", "Un script de Python", "Un tema de CSS"], answer: 1 },
    { question: "¿Qué hace `df.describe()` en Pandas?", options: ["Describe la estructura del DataFrame", "Muestra las primeras 5 filas", "Calcula estadísticas descriptivas (media, std, etc.)", "No existe tal función"], answer: 2 }
];




// =================================================================
// ==      MOTOR MAESTRO DE GRÁFICOS INTERACTIVOS (CHART.JS & APEX) ==
// =================================================================
function initInteractiveDataScienceCharts() {
    // 1. Gráfico de Salarios Tech (#salariesChart en #intro)
    const elSalarios = document.getElementById('salariesChart');
    if (elSalarios && !elSalarios.dataset.initialized) {
        elSalarios.dataset.initialized = 'true';
        new Chart(elSalarios.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Trainee / Entry', 'Junior Developer', 'Mid-Level (Semi-Sr)', 'Senior / Lead'],
                datasets: [
                    {
                        label: 'LATAM (USD/año)',
                        data: [15000, 30000, 55000, 95000],
                        backgroundColor: 'rgba(2, 132, 199, 0.85)',
                        borderColor: '#0284c7',
                        borderWidth: 1.5,
                        borderRadius: 6
                    },
                    {
                        label: 'NA / EU (USD/año)',
                        data: [62500, 87500, 120000, 180000],
                        backgroundColor: 'rgba(16, 185, 129, 0.85)',
                        borderColor: '#10b981',
                        borderWidth: 1.5,
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { font: { weight: 700 } } },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` ${ctx.dataset.label}: $${ctx.raw.toLocaleString()} USD`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (val) => '$' + (val / 1000) + 'k'
                        }
                    }
                }
            }
        });
    }

    // 2. Gráfico de Ingresos por Producto (#chart-pandas-ingresos en #analisis-datos)
    const elPandas = document.getElementById('chart-pandas-ingresos');
    if (elPandas && !elPandas.dataset.initialized) {
        elPandas.dataset.initialized = 'true';
        new Chart(elPandas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Laptop', 'Monitor', 'Teclado', 'Mouse', 'Camiseta'],
                datasets: [{
                    label: 'Ingresos Totales ($ USD)',
                    data: [2400, 300, 160, 50, 40],
                    backgroundColor: [
                        '#0284c7',
                        '#38bdf8',
                        '#818cf8',
                        '#10b981',
                        '#f59e0b'
                    ],
                    borderColor: '#0f172a',
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` Ingresos: $${ctx.raw.toLocaleString()} USD`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (val) => '$' + val
                        }
                    }
                }
            }
        });
    }

    // 3. Gráfico de Supervivencia Titanic (#chart-seaborn-titanic en #analisis-datos)
    const elTitanic = document.getElementById('chart-seaborn-titanic');
    if (elTitanic && !elTitanic.dataset.initialized) {
        elTitanic.dataset.initialized = 'true';
        new Chart(elTitanic.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Mujeres (Female)', 'Hombres (Male)', 'Tasa General'],
                datasets: [{
                    label: 'Tasa de Supervivencia (%)',
                    data: [74.2, 18.9, 38.4],
                    backgroundColor: [
                        'rgba(236, 72, 153, 0.85)',
                        'rgba(2, 132, 199, 0.85)',
                        'rgba(100, 116, 139, 0.85)'
                    ],
                    borderColor: [
                        '#ec4899',
                        '#0284c7',
                        '#64748b'
                    ],
                    borderWidth: 1.5,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` Supervivencia: ${ctx.raw}%`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: (val) => val + '%'
                        }
                    }
                }
            }
        });
    }

    // 4. Gráfico de Búsqueda Interpolación vs Binaria (#chart-algo-3 en #algo-3)
    const elAlgo3 = document.getElementById('chart-algo-3');
    if (elAlgo3 && !elAlgo3.dataset.initialized) {
        elAlgo3.dataset.initialized = 'true';
        new Chart(elAlgo3.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Búsqueda Lineal O(N)', 'Búsqueda Binaria O(log N)', 'Búsqueda Interpolación O(log log N)'],
                datasets: [{
                    label: 'Operaciones para N = 1,000,000 elementos',
                    data: [1000000, 20, 4],
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'logarithmic',
                        title: { display: true, text: 'Comprobaciones (Escala Logarítmica)' }
                    }
                }
            }
        });
        const story3 = document.getElementById('story-algo-3');
        if (story3) {
            story3.innerText = "⚡ Búsqueda por Interpolación: Al predecir probabilísticamente la posición del elemento basada en su valor (como buscar un apellido en el directorio telefónico), la matemática redujo las 20 operaciones de la búsqueda binaria a solo 4 comprobaciones atómicas.";
        }
    }

    // 5. Soporte para m3InteractiveChart / m3TrendChart
    const elM3 = document.getElementById('m3InteractiveChart') || document.getElementById('m3TrendChart');
    if (elM3 && !elM3.dataset.initialized) {
        elM3.dataset.initialized = 'true';
        new Chart(elM3.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Trimestre 1', 'Trimestre 2', 'Trimestre 3', 'Trimestre 4', 'Periodo Actual Cierre'],
                datasets: [{
                    label: 'Clicks de Campañas Digitales Depuradas',
                    data: [12450, 18900, 24100, 31800, 42500],
                    borderColor: '#0284c7',
                    backgroundColor: 'rgba(2, 132, 199, 0.15)',
                    tension: 0.35,
                    fill: true,
                    pointBackgroundColor: '#0284c7',
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    ensureAllContentExpanded();
    initGlobalCopyButtons();
    triggerPrismHighlight();
    initInteractiveDataScienceCharts();

    const sidebarToggleBtn = document.getElementById('btn-sidebar-toggle');
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', toggleSidebar);
    }
});

window.addEventListener('load', () => {
    ensureAllContentExpanded();
    initGlobalCopyButtons();
    triggerPrismHighlight();
    initInteractiveDataScienceCharts();
});

setTimeout(() => {
    initGlobalCopyButtons();
    triggerPrismHighlight();
    initInteractiveDataScienceCharts();
}, 800);

// =========================================================================
// ROTADOR DE FRASES MOTIVACIONALES ANIMADAS (HERO & CONCLUSIÓN)
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Frases de Inicio (Hero) - Punto de partida del curso
    const heroPhrases = [
        "LA ABSTRACCIÓN ES PODER",
        "DEL DATO AL IMPACTO REAL",
        "CONVIÉRTETE EN ARQUITECTO DIGITAL",
        "CÓDIGO LIMPIO, SISTEMAS ESCALABLES",
        "PYTHON: LA NAVAJA SUIZA DE LA IA"
    ];
    let heroIdx = 0;
    const heroEl = document.getElementById('hero-glitch-text');
    if (heroEl) {
        setInterval(() => {
            heroEl.classList.add('glitch-fade-out');
            setTimeout(() => {
                heroIdx = (heroIdx + 1) % heroPhrases.length;
                heroEl.innerText = heroPhrases[heroIdx];
                heroEl.setAttribute('data-text', heroPhrases[heroIdx]);
                heroEl.classList.remove('glitch-fade-out');
                heroEl.classList.add('glitch-fade-in');
                setTimeout(() => heroEl.classList.remove('glitch-fade-in'), 300);
            }, 300);
        }, 3400);
    }

    // 2. Frases de Conclusión (#12) - Cierre épico y motivación continua
    const conclusionPhrases = [
        "CÓDIGO > MIEDO",
        "HAS DESBLOQUEADO EL SIGUIENTE NIVEL",
        "DE USUARIO A CREADOR DE REALIDADES",
        "CADA ERROR ES EXPERIENCIA GANADA",
        "EL VIAJE DEL DESARROLLADOR NUNCA TERMINA"
    ];
    let concIdx = 0;
    const concEls = document.querySelectorAll('.glitch-phrase-conclusion, #conclusion-glitch-text');
    if (concEls.length > 0) {
        setInterval(() => {
            concEls.forEach(el => el.classList.add('glitch-fade-out'));
            setTimeout(() => {
                concIdx = (concIdx + 1) % conclusionPhrases.length;
                concEls.forEach(el => {
                    el.innerText = conclusionPhrases[concIdx];
                    el.setAttribute('data-text', conclusionPhrases[concIdx]);
                    el.classList.remove('glitch-fade-out');
                    el.classList.add('glitch-fade-in');
                    setTimeout(() => el.classList.remove('glitch-fade-in'), 300);
                });
            }, 300);
        }, 3800);
    }
});



// =========================================================================
// ROTADOR MAESTRO DE FRASES CYBERPUNK GLITCH (HERO & CONCLUSIÓN)
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Frases de Inicio (Hero) - Formato Grande con Glitch
        const heroGlitchPhrases = [
        "LA ABSTRACCIÓN ES PODER",
        "DEL DATO CRUDO AL DASHBOARD C-LEVEL",
        "PIPELINES ETL QUE NUNCA DUERMEN",
        "ENTRENA EL MODELO, DOMINA LA INFERENCIA",
        "MACHINE LEARNING EN PRODUCCIÓN REAL",
        "STREAMLIT: DATOS QUE COBRAN VIDA",
        "DEL DATO AL IMPACTO REAL",
        "ARQUITECTURA DE SOFTWARE & IA",
        "CONVIÉRTETE EN CREADOR DIGITAL",
        "PYTHON: LA NAVAJA SUIZA DE LA TECNOLOGÍA"
    ];
    let heroIdx = 0;
    const heroTitle = document.getElementById('hero-glitch-title');
    if (heroTitle) {
        setInterval(() => {
            heroIdx = (heroIdx + 1) % heroGlitchPhrases.length;
            const newText = heroGlitchPhrases[heroIdx];
            heroTitle.classList.add('glitch-flash-surge');
            heroTitle.innerText = newText;
            heroTitle.setAttribute('data-text', newText);
            setTimeout(() => {
                heroTitle.classList.remove('glitch-flash-surge');
            }, 400);
        }, 3600);
    }

    // 2. Frases de Conclusión (Final) - Formato Grande con Glitch
        const conclusionGlitchPhrases = [
        "CÓDIGO > MIEDO",
        "SIGUIENTE NIVEL DESBLOQUEADO",
        "DATA PIPELINES A PRUEBA DE BALAS",
        "ZERO DOWNTIME EN INFERENCIA ML",
        "DASHBOARDS QUE DECIDEN EL FUTURO",
        "DE USUARIO A ARQUITECTO DIGITAL",
        "CONVERGENCIA Y PRECISIÓN TOTAL",
        "CADA ERROR ES EXPERIENCIA GANADA",
        "DEL NOTEBOOK AL CLÚSTER DE PRODUCCIÓN",
        "EL VIAJE DEL DESARROLLADOR NUNCA TERMINA"
    ];
    let concIdx = 0;
    const concTitle = document.getElementById('conclusion-glitch-title');
    if (concTitle) {
        setInterval(() => {
            concIdx = (concIdx + 1) % conclusionGlitchPhrases.length;
            const newText = conclusionGlitchPhrases[concIdx];
            concTitle.classList.add('glitch-flash-surge');
            concTitle.innerText = newText;
            concTitle.setAttribute('data-text', newText);
            setTimeout(() => {
                concTitle.classList.remove('glitch-flash-surge');
            }, 400);
        }, 4000);
    }
});

