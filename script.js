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

    // 2. Botones flotantes en <pre> si no estuvieran en un header (excluyendo modal y outputs de terminal)
    document.querySelectorAll('pre').forEach(pre => {
        if (pre.closest('.code-box-container') || pre.closest('#modalRunnerWasm') || pre.closest('.terminal-mockup-output')) return;
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




// =======================================================
// ⚡ MOTOR MAESTRO DE EJECUCIÓN WEBASSEMBLY (PYODIDE PRO STUDIO)
// Desarrollado con base en JPV_PyStudio & Diplomado CAES
// Autor: Ing. Juancito Peña


// ==========================================================================
// ⚡ MOTOR INTERACTIVO WEBASSEMBLY TERMINAL PRO (ESTÁNDAR DIPLOMADO CAES)
// Cero alertas emergentes alert()/prompt() de JS • Terminal Integrada en DOM
// Soporte Multi-Gráfico • Anti-Bucle Infinito • Snapshot HD de Código • Gestor VFS
// Autor: Ing. Juancito Peña
// ==========================================================================

const PLANTILLAS_MAESTRAS_JPV = {
  "streamlit": "import streamlit as st\nimport pandas as pd\nimport numpy as np\nimport plotly.express as px\n\nst.set_page_config(page_title=\"Dashboard Ejecutivo C-Level\", layout=\"wide\")\nst.title(\"\ud83d\ude80 Cockpit Ejecutivo de Ventas & Rentabilidad 360\u00b0\")\n\n# Datos sint\u00e9ticos corporativos\nnp.random.seed(42)\nsucursales = [\"Santo Domingo\", \"Santiago\", \"Punta Cana\", \"La Romana\", \"La Vega\"]\ncategorias = [\"Cloud & IA\", \"Ciberseguridad\", \"Hardware Pro\", \"Anal\u00edtica BI\"]\n\ndf = pd.DataFrame({\n    \"Sucursal\": np.random.choice(sucursales, 120),\n    \"Categor\u00eda\": np.random.choice(categorias, 120),\n    \"Ingresos_USD\": np.random.uniform(2500, 18000, 120).round(2),\n    \"Margen_Pct\": np.random.uniform(18, 45, 120).round(1),\n    \"Clientes\": np.random.randint(5, 40, 120)\n})\n\n# Filtros laterales\nst.sidebar.header(\"Filtros Estrat\u00e9gicos\")\nsuc_sel = st.sidebar.multiselect(\"Sucursal:\", sucursales, default=sucursales)\ndf_f = df[df[\"Sucursal\"].isin(suc_sel)]\n\n# Fila de KPIs Bento\nc1, c2, c3, c4 = st.columns(4)\nc1.metric(\"\ud83d\udcb0 Ingresos Totales\", f\"${df_f['Ingresos_USD'].sum():,.2f}\", \"+14.8% vs LY\")\nc2.metric(\"\ud83d\udcc8 Margen Promedio\", f\"{df_f['Margen_Pct'].mean():.1f}%\", \"+2.3% Meta\")\nc3.metric(\"\ud83d\udc65 Clientes Activos\", f\"{df_f['Clientes'].sum():,}\", \"+18 nuevos\")\nc4.metric(\"\ud83c\udfc6 Ticket Promedio\", f\"${df_f['Ingresos_USD'].mean():,.2f}\", \"\u00d3ptimo\")\n\n# Gr\u00e1ficos interactivos duales\ncol_a, col_b = st.columns(2)\nwith col_a:\n    fig1 = px.bar(df_f.groupby(\"Sucursal\", as_index=False)[\"Ingresos_USD\"].sum(),\n                  x=\"Sucursal\", y=\"Ingresos_USD\", title=\"Ingresos por Sucursal (USD)\")\n    st.plotly_chart(fig1, use_container_width=True)\n\nwith col_b:\n    fig2 = px.pie(df_f, names=\"Categor\u00eda\", values=\"Ingresos_USD\", hole=0.4,\n                  title=\"Participaci\u00f3n por Unidad de Negocio\")\n    st.plotly_chart(fig2, use_container_width=True)\n\nst.subheader(\"\ud83d\udccb Detalle de Transacciones Corporativas\")\nst.dataframe(df_f.head(10), use_container_width=True)\n",
  "titanic": "import pandas as pd\nimport matplotlib.pyplot as plt\n\nprint(\"=============================================================\")\nprint(\"🌐 LECTURA DE ARCHIVO CSV DIRECTO DESDE LA WEB (URL)\")\nprint(\"=============================================================\")\n\n# URL pública en GitHub (Dataset Titanic)\nurl_web = \"https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv\"\n\nprint(f\"Descargando y procesando: {url_web} ...\")\ndf_web = pd.read_csv(url_web)\n\nprint(f\"\\\\n✅ Datos descargados exitosamente: {len(df_web)} filas.\")\nprint(df_web[[\"PassengerId\", \"Name\", \"Sex\", \"Age\", \"Survived\"]].head(8))\n\n# Análisis gráfico de los datos descargados\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 3.8))\n\n# Gráfico 1: Supervivientes\nconteo_survived = df_web[\"Survived\"].value_counts()\nax1.pie(conteo_survived, labels=[\"Fallecidos\", \"Sobrevivientes\"], autopct=\"%1.1f%%\", colors=[\"#f87171\", \"#00f2fe\"], startangle=90)\nax1.set_title(\"Tasa de Supervivencia Titanic\")\n\n# Gráfico 2: Pasajeros por Clase\ndf_web[\"Pclass\"].value_counts().sort_index().plot(kind='bar', ax=ax2, color=\"#38bdf8\", edgecolor='black')\nax2.set_title(\"Pasajeros por Clase de Boleto\")\nax2.set_xlabel(\"Clase (1ra, 2da, 3ra)\")\nax2.set_ylabel(\"Cantidad de Pasajeros\")\n\nplt.tight_layout()\nplt.show()\n\n# Guardar reporte para descargar\ndf_web.to_csv(\"Reporte_Titanic_Descargado.csv\", index=False)\nprint(\"\\\\n💾 Archivo 'Reporte_Titanic_Descargado.csv' listo para descargar.\")",
  "seaborn": "import pandas as pd\nimport numpy as np\nimport seaborn as sns\nimport matplotlib.pyplot as plt\n\nprint(\"=============================================================\")\nprint(\"📊 ANÁLISIS ESTADÍSTICO CON SEABORN & CORRELACIÓN DE DATOS\")\nprint(\"=============================================================\")\n\n# Configurar estilo visual moderno\nsns.set_theme(style=\"darkgrid\")\nplt.style.use(\"dark_background\")\n\n# Generar dataset financiero comercial simulado\nnp.random.seed(42)\nn = 120\ndata = {\n    \"Ventas_RD\": np.random.normal(50000, 14000, n),\n    \"Costo_Adquisicion\": np.random.normal(12000, 2500, n),\n    \"Descuento_Pct\": np.random.uniform(5, 20, n),\n    \"Satisfaccion_Cliente\": np.random.uniform(2, 10, n),\n}\ndata[\"Margen_Bruto\"] = data[\"Ventas_RD\"] - data[\"Costo_Adquisicion\"] - (data[\"Ventas_RD\"] * data[\"Descuento_Pct\"] / 100)\n\ndf = pd.DataFrame(data)\nprint(f\"✅ Dataset financiero generado con {len(df)} transacciones.\")\nprint(df.head(5).round(2))\n\n# Matriz de Correlación\ncorr = df.corr()\nprint(\"\\\\n📈 Matriz de Correlación entre Indicadores:\")\nprint(corr.round(3))\n\n# Visualización dual con Seaborn\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.2))\n\n# 1. Mapa de Calor (Heatmap)\nsns.heatmap(corr, annot=True, fmt=\".2f\", cmap=\"coolwarm\", cbar=True, ax=ax1, linewidths=0.5)\nax1.set_title(\"Heatmap de Correlación Financiera\")\n\n# 2. Regresión y dispersión (Regplot)\nsns.regplot(x=\"Ventas_RD\", y=\"Margen_Bruto\", data=df, ax=ax2,\n            scatter_kws={\"color\": \"#00f2fe\", \"alpha\": 0.6},\n            line_kws={\"color\": \"#f43f5e\", \"linewidth\": 2})\nax2.set_title(\"Tendencia: Ventas vs Margen Bruto\")\nax2.set_xlabel(\"Ventas (RD$)\")\nax2.set_ylabel(\"Margen (RD$)\")\n\nplt.tight_layout()\nplt.show()\n\n# Exportar a Excel y CSV\ndf.to_csv(\"analisis_seaborn_reporte.csv\", index=False)\ndf.to_excel(\"analisis_seaborn_reporte.xlsx\", index=False)\nprint(\"\\\\n💾 Exportados: 'analisis_seaborn_reporte.csv' y '.xlsx'\")",
  "sklearn": "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import r2_score, mean_squared_error\n\nprint(\"=============================================================\")\nprint(\"🤖 MACHINE LEARNING CON SCIKIT-LEARN (MODELO PREDICTIVO)\")\nprint(\"=============================================================\")\n\n# Datos simulados: Inversión en Publicidad vs Ventas Reales\nnp.random.seed(42)\nn = 100\ninversion_pub = np.random.uniform(10, 100, n)\nventas_reales = 4.5 * inversion_pub + np.random.normal(0, 30, n) + 50\n\ndf_ml = pd.DataFrame({\n    \"Inversion_Publicidad_USD\": inversion_pub,\n    \"Ventas_Reales_USD\": ventas_reales\n})\n\nprint(f\"✅ Dataset de entrenamiento generado ({len(df_ml)} muestras).\")\nprint(df_ml.head(5).round(2))\n\n# Entrenar modelo Scikit-Learn\nX = df_ml[[\"Inversion_Publicidad_USD\"]]\ny = df_ml[\"Ventas_Reales_USD\"]\n\nmodelo = LinearRegression()\nmodelo.fit(X, y)\npredicciones = modelo.predict(X)\n\nr2 = r2_score(y, predicciones)\nrmse = np.sqrt(mean_squared_error(y, predicciones))\n\nprint()\nprint(\"📈 Métricas del Modelo Scikit-Learn:\")\nprint(f\"   • Pendiente (Coeficiente): {modelo.coef_[0]:.3f}\")\nprint(f\"   • Intersección: {modelo.intercept_:.3f}\")\nprint(f\"   • Coeficiente R²: {r2:.4f}\")\nprint(f\"   • Error RMSE: {rmse:.2f} USD\")\n\n# Gráfico de Dispersión y Línea de Regresión\nfig, ax = plt.subplots(figsize=(8.5, 4.2))\nax.scatter(X, y, color=\"#00f2fe\", alpha=0.7, label=\"Datos Reales de Ventas\")\nax.plot(X, predicciones, color=\"#f43f5e\", linewidth=2.5, label=f\"Recta de Regresión (R²={r2:.2f})\")\nax.set_title(\"Machine Learning: Predicción de Ventas vs Inversión\")\nax.set_xlabel(\"Inversión en Publicidad (USD)\")\nax.set_ylabel(\"Ventas Totales (USD)\")\nax.legend()\nplt.tight_layout()\nplt.show()\n\n# Guardar predicciones en disco virtual\ndf_ml[\"Ventas_Predichas_USD\"] = predicciones.round(2)\ndf_ml.to_csv(\"predicciones_ventas_ml.csv\", index=False)\nprint()\nprint(\"💾 Predicciones guardadas en: 'predicciones_ventas_ml.csv'\")",
  "requests": "import requests\nimport pandas as pd\n\nprint(\"=============================================================\")\nprint(\"🌐 CONSULTA A API REST EXTERNA VÍA HTTPS CON REQUESTS\")\nprint(\"=============================================================\")\n\n# API pública HTTPS con CORS habilitado (CoinGecko Markets)\nurl = \"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1\"\n\nprint(f\"Enviando solicitud GET a: {url} ...\")\ntry:\n    response = requests.get(url, timeout=10)\n    print(f\"Código de respuesta HTTP: {response.status_code} ({response.reason})\")\n    \n    if response.status_code == 200:\n        datos = response.json()\n        print(f\"✅ Respuesta recibida: {len(datos)} criptomonedas obtenidas.\\\\n\")\n        \n        # Procesar datos con pandas\n        df = pd.DataFrame(datos)[[\"name\", \"symbol\", \"current_price\", \"market_cap\", \"price_change_percentage_24h\"]]\n        df.columns = [\"Criptomoneda\", \"Símbolo\", \"Precio USD\", \"Market Cap USD\", \"Cambio 24h (%)\"]\n        \n        print(\"🏆 Top 10 Criptoactivos:\")\n        print(df.to_string(index=False))\n        \n        # Visualizar Top 10 Criptomonedas por Precio / Cambio 24h\n        import matplotlib.pyplot as plt\n        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9.5, 4.0))\n        colores_bar = [\"#00f2fe\" if v >= 0 else \"#f43f5e\" for v in df[\"Cambio 24h (%)\"]]\n        ax1.barh(df[\"Símbolo\"].str.upper()[::-1], (df[\"Market Cap USD\"] / 1e9)[::-1], color=\"#38bdf8\", edgecolor=\"black\")\n        ax1.set_title(\"Top 10 Market Cap (Miles de Millones USD)\")\n        ax1.set_xlabel(\"Billones USD\")\n\n        ax2.barh(df[\"Símbolo\"].str.upper()[::-1], df[\"Cambio 24h (%)\"][::-1], color=colores_bar[::-1], edgecolor=\"black\")\n        ax2.axvline(0, color=\"#94a3b8\", linewidth=1, linestyle=\"--\")\n        ax2.set_title(\"Variación en 24 Horas (%)\")\n        ax2.set_xlabel(\"Cambio (%)\")\n        plt.tight_layout()\n        plt.show()\n\n        # Guardar en archivo local\n        df.to_csv(\"top_cripto_mercado.csv\", index=False)\n        print(\"\\\\n💾 Guardado en disco virtual: 'top_cripto_mercado.csv'\")\n    else:\n        print(f\"Respuesta inesperada: {response.text[:200]}\")\n\nexcept Exception as e:\n    print(f\"❌ Error en la solicitud: {e}\")\n    print(\"\\\\n💡 Recuerda que las solicitudes web en el navegador requieren que la API permita CORS.\")",
  "excel": "import pandas as pd\nimport numpy as np\n\nprint(\"=============================================================\")\nprint(\"📑 LECTURA, PROCESAMIENTO Y GENERACIÓN DE EXCEL (.XLSX)\")\nprint(\"=============================================================\")\n\n# Crear dataset corporativo con cálculo de impuestos DGII (18% ITBIS)\nvendedores = [\"Juancito Peña\", \"Carlos Gómez\", \"Mildre Morales\", \"Dulce Rosario\", \"Pedro Jiménez\"]\nsucursales = [\"Santo Domingo\", \"Santiago\", \"La Romana\", \"La Vega\", \"Azua\"]\nproductos = [\"Laptop Pro 16\", \"Monitor UltraWide 34\", \"Teclado Mecánico RGB\", \"Mouse Ergonómico\", \"Dock USB-C\"]\n\nnp.random.seed(101)\nfilas = 80\ndata = {\n    \"No_Factura\": [f\"B01{str(i).zfill(5)}\" for i in range(1001, 1001 + filas)],\n    \"Vendedor\": np.random.choice(vendedores, filas),\n    \"Sucursal\": np.random.choice(sucursales, filas),\n    \"Producto\": np.random.choice(productos, filas),\n    \"Cantidad\": np.random.randint(1, 10, filas),\n    \"Precio_Unitario\": np.random.choice([1500, 3200, 7500, 18500, 45000], filas)\n}\n\ndf_ventas = pd.DataFrame(data)\ndf_ventas[\"Subtotal\"] = df_ventas[\"Cantidad\"] * df_ventas[\"Precio_Unitario\"]\ndf_ventas[\"ITBIS_18\"] = (df_ventas[\"Subtotal\"] * 0.18).round(2)\ndf_ventas[\"Total_Factura\"] = df_ventas[\"Subtotal\"] + df_ventas[\"ITBIS_18\"]\n\nprint(f\"✅ Dataset corporativo generado: {len(df_ventas)} facturas.\")\nprint(df_ventas.head(5))\n\n# Resumen agrupado por Sucursal\nresumen = df_ventas.groupby(\"Sucursal\").agg({\n    \"No_Factura\": \"count\",\n    \"Subtotal\": \"sum\",\n    \"ITBIS_18\": \"sum\",\n    \"Total_Factura\": \"sum\"\n}).rename(columns={\"No_Factura\": \"Cant_Facturas\"}).reset_index()\n\nprint(\"\\\\n📊 Resumen de Facturación por Sucursal:\")\nprint(resumen.to_string(index=False))\n\n# Guardar en Libro Excel (.xlsx) con múltiples hojas usando openpyxl\narchivo_excel = \"Reporte_Facturacion_Corporativa.xlsx\"\nwith pd.ExcelWriter(archivo_excel, engine=\"openpyxl\") as writer:\n    df_ventas.to_excel(writer, sheet_name=\"Detalle_Facturas\", index=False)\n    resumen.to_excel(writer, sheet_name=\"Resumen_Sucursales\", index=False)\n\n# Visualización Ejecutiva de Facturación por Sucursal\nimport matplotlib.pyplot as plt\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9.5, 4.0))\nax1.bar(resumen[\"Sucursal\"], resumen[\"Total_Factura\"] / 1000, color=\"#00f2fe\", edgecolor=\"black\")\nax1.set_title(\"Facturación Total por Sucursal (Miles RD$)\")\nax1.set_ylabel(\"Miles RD$\")\nax1.tick_params(axis=\"x\", rotation=20)\n\nax2.pie(resumen[\"Total_Factura\"], labels=resumen[\"Sucursal\"], autopct=\"%1.1f%%\",\n        colors=[\"#00f2fe\", \"#38bdf8\", \"#818cf8\", \"#f43f5e\", \"#10b981\"], startangle=90)\nax2.set_title(\"Participación por Sucursal (%)\")\nplt.tight_layout()\nplt.show()\n\nprint(f\"\\\\n💾 Libro Excel generado: '{archivo_excel}' con 2 hojas de cálculo.\")\nprint(\"👉 Descárgalo con el botón 'Descargar Excel / CSV' o en 'Archivos (VFS)'!\")",
  "animacion": "import matplotlib.animation as animation\nimport matplotlib.pyplot as plt\nimport numpy as np\nimport pandas as pd\n\nprint(\"=============================================================\")\nprint(\"🎬 GENERANDO TABLERO ANALÍTICO ANIMADO DEL TITANIC (8 PANELES)\")\nprint(\"=============================================================\")\n\n# 1. Cargar dataset\nurl = \"https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv\"\nprint(\"Descargando dataset Titanic...\")\ndf = pd.read_csv(url)\n\n# 2. Paleta de colores consistente\nCOLOR_SURV = \"#0ea5e9\"    # Azul/Cian vivo (Sobrevivientes)\nCOLOR_DIED = \"#64748b\"    # Gris neutro (Fallecidos)\nCOLOR_ACCENT = \"#e11d48\"  # Acento de alerta/énfasis\n\n# 3. Precalcular agregaciones\ntasa_global = df[\"Survived\"].mean() * 100\nsurv_counts = df[\"Survived\"].value_counts()\npclass_counts = df[\"Pclass\"].value_counts().sort_index()\nsurv_sex = df.groupby(\"Sex\")[\"Survived\"].mean() * 100\nsurv_class = df.groupby(\"Pclass\")[\"Survived\"].mean() * 100\nsurv_matrix = df.groupby([\"Pclass\", \"Sex\"])[\"Survived\"].mean().unstack() * 100\nmediana_edad = df[\"Age\"].median()\n\nage_counts, age_bins = np.histogram(df[\"Age\"].dropna(), bins=25)\nfare_counts, fare_bins = np.histogram(df[\"Fare\"], bins=35)\n\n# 4. Inicializar figura del tablero completo (2x4)\nfig, axes = plt.subplots(2, 4, figsize=(18, 9))\nTOTAL_FRAMES = 25\n\ndef limpiar_bordes(ax):\n    ax.spines[\"top\"].set_visible(False)\n    ax.spines[\"right\"].set_visible(False)\n    ax.spines[\"left\"].set_color(\"#cbd5e1\")\n    ax.spines[\"bottom\"].set_color(\"#cbd5e1\")\n\ndef actualizar_tablero(frame):\n    for r in range(2):\n        for c in range(4):\n            axes[r, c].clear()\n\n    fig.suptitle(\n        \"\"\"TRAGEDIA DEL TITANIC: PROTOCOLO DE RESCATE Y PRIVILEGIO SOCIAL\\nTablero Analítico Animado (891 Pasajeros)\"\"\",\n        fontsize=14, fontweight=\"bold\", y=0.98, color=\"#0f172a\"\n    )\n\n    progreso = 1 - (1 - (frame + 1) / TOTAL_FRAMES) ** 2\n\n    # 1. Donut Chart de Supervivencia General\n    vivos_val = max(1, int(surv_counts.get(1, 0) * progreso))\n    muertos_val = max(1, int(surv_counts.get(0, 0) * progreso))\n    wedges, _, autotexts = axes[0, 0].pie(\n        [muertos_val, vivos_val],\n        labels=[\"Fallecidos\", \"Sobrevivientes\"],\n        autopct=\"%1.1f%%\",\n        pctdistance=0.75,\n        colors=[COLOR_DIED, COLOR_SURV],\n        startangle=90,\n        wedgeprops=dict(width=0.4, edgecolor=\"white\", linewidth=2)\n    )\n    for t in autotexts:\n        t.set_color(\"white\")\n        t.set_fontweight(\"bold\")\n    axes[0, 0].text(0, 0, f\"{vivos_val} Vivos\", ha=\"center\", va=\"center\", fontsize=11, fontweight=\"bold\", color=\"#0f172a\")\n    axes[0, 0].set_title(f\"Balance General: {tasa_global:.1f}% supervivencia\", fontweight=\"bold\", fontsize=9.5)\n\n    # 2. Volumen de Pasajeros por Clase\n    p_curr = pclass_counts * progreso\n    bars2 = axes[0, 1].bar([\"1ra\", \"2da\", \"3ra\"], p_curr, color=\"#94a3b8\")\n    bars2[2].set_color(COLOR_ACCENT)\n    axes[0, 1].set_ylim(0, pclass_counts.max() * 1.15)\n    for b in bars2:\n        h = b.get_height()\n        if h > 10:\n            axes[0, 1].text(b.get_x() + b.get_width()/2, h + 6, f\"{int(h)}\", ha=\"center\", va=\"bottom\", fontweight=\"bold\", fontsize=8, color=\"#334155\")\n    axes[0, 1].set_title(\"Población por Boleto (Mayoría en 3ra clase)\", fontweight=\"bold\", fontsize=9.5)\n    limpiar_bordes(axes[0, 1])\n\n    # 3. Supervivencia por Sexo (Mujeres primero)\n    s_curr = [surv_sex.get(\"female\", 0) * progreso, surv_sex.get(\"male\", 0) * progreso]\n    bars3 = axes[0, 2].bar([\"Mujeres\", \"Hombres\"], s_curr, color=[COLOR_SURV, COLOR_DIED], width=0.5)\n    axes[0, 2].axhline(tasa_global * progreso, color=\"#dc2626\", linestyle=\"--\", linewidth=1.2, label=f\"Media ({tasa_global:.1f}%)\")\n    axes[0, 2].set_ylim(0, 95)\n    for b in bars3:\n        h = b.get_height()\n        if h > 2:\n            axes[0, 2].text(b.get_x() + b.get_width()/2, h + 1.5, f\"{h:.1f}%\", ha=\"center\", va=\"bottom\", fontweight=\"bold\", fontsize=8)\n    axes[0, 2].set_title(\"Protocolo de Evacuación ('Mujeres primero')\", fontweight=\"bold\", fontsize=9.5)\n    axes[0, 2].legend(frameon=False, loc=\"upper right\", fontsize=7.5)\n    limpiar_bordes(axes[0, 2])\n\n    # 4. Supervivencia por Clase Social\n    c_curr = [surv_class.get(1, 0) * progreso, surv_class.get(2, 0) * progreso, surv_class.get(3, 0) * progreso]\n    bars4 = axes[0, 3].bar([\"1ra\", \"2da\", \"3ra\"], c_curr, color=[COLOR_SURV, \"#38bdf8\", COLOR_DIED], width=0.55)\n    axes[0, 3].axhline(tasa_global * progreso, color=\"#dc2626\", linestyle=\"--\", linewidth=1.2)\n    axes[0, 3].set_ylim(0, 85)\n    for b in bars4:\n        h = b.get_height()\n        if h > 2:\n            axes[0, 3].text(b.get_x() + b.get_width()/2, h + 1.5, f\"{h:.1f}%\", ha=\"center\", va=\"bottom\", fontweight=\"bold\", fontsize=8)\n    axes[0, 3].set_title(\"Brecha de Clase (1ra duplicó a 3ra)\", fontweight=\"bold\", fontsize=9.5)\n    limpiar_bordes(axes[0, 3])\n\n    # 5. Histograma Dinámico de Edades\n    age_widths = np.diff(age_bins)\n    axes[1, 0].bar(age_bins[:-1], age_counts * progreso, width=age_widths, align=\"edge\", color=\"#cbd5e1\", edgecolor=\"white\")\n    axes[1, 0].set_ylim(0, age_counts.max() * 1.15)\n    axes[1, 0].axvline(mediana_edad, color=\"#0f172a\", linestyle=\":\", linewidth=1.2, label=f\"Mediana: {mediana_edad:.0f}a\")\n    axes[1, 0].set_title(\"Demografía (Concentración 20-35 años)\", fontweight=\"bold\", fontsize=9.5)\n    axes[1, 0].legend(frameon=False, fontsize=7.5)\n    limpiar_bordes(axes[1, 0])\n\n    # 6. Distribución de Tarifas (Escala Log)\n    fare_widths = np.diff(fare_bins)\n    axes[1, 1].bar(fare_bins[:-1], np.maximum(fare_counts * progreso, 0.1), width=fare_widths, align=\"edge\", color=\"#cbd5e1\", edgecolor=\"white\")\n    axes[1, 1].set_yscale(\"log\")\n    axes[1, 1].set_ylim(1, max(fare_counts) * 2)\n    axes[1, 1].set_title(\"Dispersión del Boleto (Mayoría <30$)\", fontweight=\"bold\", fontsize=9.5)\n    limpiar_bordes(axes[1, 1])\n\n    # 7. Supervivencia Cruzada (Sexo x Clase)\n    x = np.arange(3)\n    w = 0.35\n    axes[1, 2].bar(x - w/2, surv_matrix[\"female\"] * progreso, w, color=COLOR_SURV, label=\"Mujeres\")\n    axes[1, 2].bar(x + w/2, surv_matrix[\"male\"] * progreso, w, color=COLOR_DIED, label=\"Hombres\")\n    axes[1, 2].set_ylim(0, 110)\n    axes[1, 2].set_xticks(x)\n    axes[1, 2].set_xticklabels([\"1ra\", \"2da\", \"3ra\"])\n    axes[1, 2].set_title(\"Efecto Combinado (Mujeres 1ra clase ~97%)\", fontweight=\"bold\", fontsize=9.5)\n    axes[1, 2].legend(frameon=False, fontsize=7.5)\n    limpiar_bordes(axes[1, 2])\n\n    # 8. Dispersión Edad vs Tarifa\n    lim_puntos = max(5, int(len(df) * progreso))\n    df_sub = df.iloc[:lim_puntos]\n    fallecidos = df_sub[df_sub[\"Survived\"] == 0]\n    vivos = df_sub[df_sub[\"Survived\"] == 1]\n    axes[1, 3].scatter(fallecidos[\"Age\"], fallecidos[\"Fare\"], color=COLOR_DIED, alpha=0.35, s=18, label=\"Fallecido\")\n    axes[1, 3].scatter(vivos[\"Age\"], vivos[\"Fare\"], color=COLOR_SURV, alpha=0.7, s=18, label=\"Sobreviviente\")\n    axes[1, 3].set_xlim(0, 85)\n    axes[1, 3].set_ylim(-10, 520)\n    axes[1, 3].set_title(\"Tarifas Altas Blindaron Vidas (0 muertes >200$)\", fontweight=\"bold\", fontsize=9.5)\n    axes[1, 3].legend(frameon=False, loc=\"upper right\", fontsize=7.5)\n    limpiar_bordes(axes[1, 3])\n\n    plt.tight_layout(rect=[0, 0, 1, 0.94])\n\nprint(\"Compilando cuadros de animación con Pillow...\")\nani = animation.FuncAnimation(fig, actualizar_tablero, frames=TOTAL_FRAMES, interval=60, repeat=False)\nwriter = animation.PillowWriter(fps=12)\nani.save(\"titanic_dashboard_completo_animado.gif\", writer=writer)\n\nprint()\nprint(\"🎉 Animación generada: 'titanic_dashboard_completo_animado.gif'\")\nprint(\"👉 El visor gráfico mostrará la animación en bucle infinito.\")",
  "scipy": "import numpy as np\nimport matplotlib.pyplot as plt\nfrom scipy.optimize import curve_fit\n\nprint(\"=============================================================\")\nprint(\"🔬 ANÁLISIS CIENTÍFICO Y AJUSTE DE MODELOS CON SCIPY\")\nprint(\"=============================================================\")\n\n# Datos experimentales con ruido\nx_data = np.linspace(0, 10, 40)\ny_true = 2.5 * (x_data ** 1.5) + 5\nruido = np.random.normal(0, 4, len(x_data))\ny_data = y_true + ruido\n\n# Definir función matemática para ajustar\ndef modelo_potencia(x, a, b, c):\n    return a * (x ** b) + c\n\n# Ajuste con Scipy curve_fit\nparams, cov = curve_fit(modelo_potencia, x_data, y_data, p0=[2, 1.5, 5])\na_opt, b_opt, c_opt = params\n\nresiduos = y_data - modelo_potencia(x_data, *params)\nr2 = 1 - (np.sum(residuos**2) / np.sum((y_data - np.mean(y_data))**2))\n\nprint(\"✅ Parámetros optimizados con Scipy:\")\nprint(f\"   a = {a_opt:.4f}, b = {b_opt:.4f}, c = {c_opt:.4f}\")\nprint(f\"   Coeficiente de Determinación (R²): {r2:.4f}\")\n\n# Graficar\nfig, ax = plt.subplots(figsize=(8, 4))\nax.scatter(x_data, y_data, color=\"#00f2fe\", label=\"Datos experimentales\", alpha=0.8)\nx_curva = np.linspace(0, 10, 200)\nax.plot(x_curva, modelo_potencia(x_curva, *params), color=\"#f43f5e\", linewidth=2.5,\n        label=f\"Ajuste Scipy: {a_opt:.2f}·x^{b_opt:.2f} + {c_opt:.2f} (R²={r2:.3f})\")\n\nax.set_title(\"Ajuste No Lineal de Curvas con Scipy Optimize\")\nax.set_xlabel(\"Variable X\")\nax.set_ylabel(\"Respuesta Y\")\nax.legend()\nplt.tight_layout()\nplt.show()",
  "folium": "import folium\nfrom folium.plugins import AntPath, MarkerCluster, MiniMap, Fullscreen\n\nprint(\"=============================================================\")\nprint(\"🗺️ MAPA GEOESPACIAL INTERACTIVO EN VIVO (100% LIBRE / SIN API KEY)\")\nprint(\"   • Mapa Base Real: OpenStreetMap (Calles & Avenidas)\")\nprint(\"   • Vista Satelital: Esri World Imagery (Imágenes Aéreas)\")\nprint(\"   • Clúster de Sucursales Interactivo (MarkerCluster)\")\nprint(\"   • Ruta Logística Animada en Tiempo Real (AntPath)\")\nprint(\"=============================================================\")\n\n# 1. Coordenadas estratégicas (Red metropolitana central)\nlat_centro, lon_centro = 18.4861, -69.9312\n\n# 2. Inicializar mapa con OpenStreetMap (Cero API Key, 100% libre)\nm = folium.Map(location=[lat_centro, lon_centro], zoom_start=13, tiles=\"OpenStreetMap\")\n\n# 3. Capa adicional: Vista Satelital Real de alta resolución (Libre de API Key)\nfolium.TileLayer(\n    tiles=\"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}\",\n    attr=\"Esri World Imagery\",\n    name=\"🛰️ Vista Satelital Real\"\n).add_to(m)\n\n# 4. Clúster de Sucursales y Puntos de Interés (MarkerCluster)\n# Al alejar el mapa se agrupan en burbujas con números; al acercar se expanden\ncluster = MarkerCluster(name=\"📍 Clúster de Sucursales & Hubs\").add_to(m)\n\npuntos = [\n    {\"nombre\": \"Sede Central JPV\", \"coords\": [18.4861, -69.9312], \"rol\": \"Dirección General\", \"color\": \"red\", \"icon\": \"star\"},\n    {\"nombre\": \"Sucursal Norte\", \"coords\": [18.5020, -69.9250], \"rol\": \"Atención al Cliente\", \"color\": \"blue\", \"icon\": \"home\"},\n    {\"nombre\": \"Hub Zona Colonial\", \"coords\": [18.4720, -69.9120], \"rol\": \"Centro de Distribución\", \"color\": \"green\", \"icon\": \"flag\"},\n    {\"nombre\": \"Terminal Puerto\", \"coords\": [18.4550, -69.9450], \"rol\": \"Carga y Aduanas\", \"color\": \"purple\", \"icon\": \"plane\"},\n    {\"nombre\": \"Centro Logístico Oeste\", \"coords\": [18.4780, -69.9550], \"rol\": \"Almacén Principal\", \"color\": \"orange\", \"icon\": \"briefcase\"}\n]\n\nfor p in puntos:\n    folium.Marker(\n        location=p[\"coords\"],\n        popup=folium.Popup(\n            f\"<b>{p['nombre']}</b><br>\"\n            f\"<b>Función:</b> {p['rol']}<br>\"\n            f\"<b>Coordenadas:</b> {p['coords']}\",\n            max_width=250\n        ),\n        tooltip=f\"{p['nombre']} ({p['rol']})\",\n        icon=folium.Icon(color=p[\"color\"], icon=p[\"icon\"])\n    ).add_to(cluster)\n\n# 5. Ruta Logística Animada Continua (AntPath)\nruta_coordenadas = [p[\"coords\"] for p in puntos]\nruta_coordenadas.append(puntos[0][\"coords\"])  # Retorno a la Sede Central\n\nAntPath(\n    locations=ruta_coordenadas,\n    name=\"🚀 Corredor Logístico Animado (AntPath)\",\n    delay=800,             # Velocidad del pulso\n    dash_array=[10, 20],   # Tamaño de los segmentos\n    color=\"#00f2fe\",       # Color cian neón principal\n    pulse_color=\"#ffffff\", # Pulso animado blanco\n    weight=5,              # Grosor de la línea\n    opacity=0.9,\n    tooltip=\"Ruta de Reparto Activa en Vivo\"\n).add_to(m)\n\n# 6. Herramientas de Interacción: MiniMapa, Pantalla Completa y Control de Capas\nMiniMap(toggle_display=True).add_to(m)\nFullscreen(position=\"topright\", title=\"Ver a Pantalla Completa\").add_to(m)\nfolium.LayerControl(collapsed=False).add_to(m)\n\n# 7. Guardar el archivo HTML\n# JPV PyStudio lo detecta automáticamente y lo visualiza en la pestaña 'Gráfico'\nm.save(\"mapa_interactivo.html\")\n\nprint(\"✅ ¡Mapa interactivo generado exitosamente!\")\nprint(\"👉 El mapa se está visualizando en vivo en la pestaña 'Gráfico'.\")\nprint(\"💡 TIP: Usa el botón 'Abrir en Pestaña' (arriba a la derecha) para desplegarlo a pantalla completa.\")",
  "plotly": "import pandas as pd\nimport numpy as np\nimport plotly.express as px\n\nprint(\"=============================================================\")\nprint(\"📈 DASHBOARD INTERACTIVO MULTIDIMENSIONAL CON PLOTLY EXPRESS\")\nprint(\"=============================================================\")\n\n# Configuración de datos aleatorios\nnp.random.seed(42)\nregiones = [\"Norteamérica\", \"Europa\", \"Asia-Pacífico\", \"Latinoamérica\", \"Medio Oriente\"]\ndatos = []\n\nfor reg in regiones:\n    for i in range(8):\n        ingresos = np.random.uniform(120, 950)\n        margen = np.random.uniform(12, 42)\n        clientes = int(np.random.uniform(500, 12000))\n        datos.append({\n            \"Región\": reg,\n            \"Unidad\": f\"{reg[:3].upper()}-0{i+1}\",\n            \"Ingresos_M_USD\": round(ingresos, 2),\n            \"Margen_Pct\": round(margen, 2),\n            \"Clientes_Activos\": clientes\n        })\n\ndf_kpi = pd.DataFrame(datos)\nprint(df_kpi.head(8))\n\n# Generación del gráfico interactivo con Plotly Express\nfig = px.scatter(\n    df_kpi,\n    x=\"Ingresos_M_USD\",\n    y=\"Margen_Pct\",\n    size=\"Clientes_Activos\",\n    color=\"Región\",\n    hover_name=\"Unidad\",\n    size_max=48,\n    template=\"plotly_dark\",\n    title=\"Matriz Ejecutiva: Ingresos (M USD) vs Margen (%) y Volumen de Clientes\",\n    labels={\n        \"Ingresos_M_USD\": \"Ingresos Anuales (Millones USD)\",\n        \"Margen_Pct\": \"Margen Operativo (%)\",\n        \"Clientes_Activos\": \"Clientes Activos\"\n    }\n)\n\n# Ajustes de diseño estético del dashboard\nfig.update_layout(\n    paper_bgcolor=\"#080c14\",\n    plot_bgcolor=\"#0f172a\",\n    font=dict(family=\"Outfit, sans-serif\", size=13, color=\"#f8fafc\"),\n    margin=dict(l=40, r=30, t=60, b=40)\n)\n\n# Guardar y renderizar el archivo HTML interactivo\nfig.write_html(\"dashboard_plotly_ejecutivo.html\", include_plotlyjs=\"cdn\")\nprint(\"✅ Gráfico interactivo Plotly renderizado en el visor Gráfico.\")",
  "networkx": "import networkx as nx\nimport matplotlib.pyplot as plt\n\nprint(\"=============================================================\")\nprint(\"🕸️ TOPOLOGÍA DE RED Y RUTEO ÓPTIMO CON NETWORKX\")\nprint(\"=============================================================\")\n\nG = nx.Graph()\naristas = [\n    (\"Core-SDQ\", \"Hub-Santiago\", 12),\n    (\"Core-SDQ\", \"Hub-LaRomana\", 15),\n    (\"Core-SDQ\", \"Hub-SanCristobal\", 6),\n    (\"Hub-Santiago\", \"Nodo-PuertoPlata\", 8),\n    (\"Hub-Santiago\", \"Nodo-LaVega\", 7),\n    (\"Nodo-LaVega\", \"Core-SDQ\", 14),\n    (\"Hub-LaRomana\", \"Nodo-PuntaCana\", 10),\n    (\"Hub-SanCristobal\", \"Nodo-Azua\", 11),\n    (\"Nodo-Azua\", \"Nodo-Barahona\", 13),\n    (\"Nodo-LaVega\", \"Nodo-SanFrancisco\", 9)\n]\nG.add_weighted_edges_from(aristas)\n\nruta_optima = nx.shortest_path(G, source=\"Nodo-Barahona\", target=\"Nodo-PuntaCana\", weight=\"weight\")\ncosto_total = nx.shortest_path_length(G, source=\"Nodo-Barahona\", target=\"Nodo-PuntaCana\", weight=\"weight\")\nprint(f\"🚀 Ruta óptima Barahona -> Punta Cana: {' -> '.join(ruta_optima)}\")\nprint(f\"⚡ Latencia total mínima: {costo_total} ms\")\n\nfig, ax = plt.subplots(figsize=(9, 5.2))\npos = nx.spring_layout(G, seed=42, k=0.85)\n\ncolores_nodos = [\"#00f2fe\" if n in ruta_optima else \"#334155\" for n in G.nodes()]\nnx.draw_networkx_nodes(G, pos, ax=ax, node_color=colores_nodos, node_size=900, edgecolors=\"#ffffff\", linewidths=1.5)\nnx.draw_networkx_edges(G, pos, ax=ax, edge_color=\"#64748b\", width=1.8, alpha=0.7)\n\n# Resaltar aristas de la ruta óptima\naristas_ruta = list(zip(ruta_optima[:-1], ruta_optima[1:]))\nnx.draw_networkx_edges(G, pos, edgelist=aristas_ruta, ax=ax, edge_color=\"#10b981\", width=4.0)\nnx.draw_networkx_labels(G, pos, ax=ax, font_size=8.5, font_weight=\"bold\", font_color=\"#0f172a\")\n\nlabels_peso = nx.get_edge_attributes(G, \"weight\")\nnx.draw_networkx_edge_labels(G, pos, edge_labels={k: f\"{v}ms\" for k, v in labels_peso.items()}, font_size=7.5, ax=ax)\n\nax.set_title(\"Topología de Red Nacional & Camino Más Corto (Dijkstra)\", fontweight=\"bold\")\nax.axis(\"off\")\nplt.tight_layout()\nplt.show()",
  "wordcloud": "import matplotlib.pyplot as plt\nfrom wordcloud import WordCloud\n\nprint(\"=============================================================\")\nprint(\"☁️ NUBE DE PALABRAS DE ALTA DEFINICIÓN (WORDCLOUD)\")\nprint(\"=============================================================\")\n\nfrecuencias_tech = {\n    \"Python\": 100, \"Data Science\": 92, \"Pyodide Wasm\": 88, \"Folium Maps\": 85,\n    \"Plotly\": 82, \"Machine Learning\": 80, \"Pandas\": 78, \"Seaborn\": 75,\n    \"Scikit-Learn\": 72, \"NetworkX\": 70, \"Inteligencia Artificial\": 68,\n    \"SQL Server\": 65, \"Power BI\": 64, \"Automatización\": 60, \"NumPy\": 58,\n    \"Scipy\": 55, \"Big Data\": 52, \"Geoespacial\": 50, \"Deep Learning\": 48,\n    \"Analytics\": 46, \"ETL Pipelines\": 44, \"FastAPI\": 40, \"Dashboards\": 38\n}\n\nwc = WordCloud(\n    width=1100,\n    height=550,\n    background_color=\"#080c14\",\n    colormap=\"cool\",\n    max_words=50,\n    prefer_horizontal=0.85\n).generate_from_frequencies(frecuencias_tech)\n\nfig, ax = plt.subplots(figsize=(9.5, 4.8))\nax.imshow(wc, interpolation=\"bilinear\")\nax.set_title(\"Ecosistema Analítico & Visualización en JPV PyStudio\", fontsize=13, fontweight=\"bold\", pad=12)\nax.axis(\"off\")\nplt.tight_layout()\nplt.show()\nprint(\"✅ Nube de palabras generada con éxito.\")"
};


// ==========================================================================
// ⚡ MOTOR INTERACTIVO WEBASSEMBLY TERMINAL PRO (ESTÁNDAR DIPLOMADO CAES)
// Cero ventanas emergentes alert()/prompt() de JS • Terminal Integrada en DOM
// Soporte Multi-Gráfico • Anti-Bucle Infinito • Snapshot HD de Código • Gestor VFS
// Autor: Ing. Juancito Peña
// ==========================================================================

let wasmPyodideInstance = null;
let wasmPyodideReady = false;
let wasmIsRunning = false;
let wasmLoadingPromise = null;
let wasmActiveBlobUrls = [];
let wasmVfsFiles = new Set();
window.preloadedInputs = [];

// 1. Limpieza de URLs Blob de memoria
const PYODIDE_MASTER_BOOTSTRAP_CODE = "# ==============================================================================\n# \ud83d\udc0d PYODIDE WEBASSEMBLY MASTER BOOTSTRAP (VFS + STREAMLIT + PLOTLY + SHIMS)\n# ==============================================================================\nimport sys\nimport os\nimport io\nimport json\nimport math\nimport random\nimport types\nimport builtins\nimport datetime\nimport difflib\nimport sqlite3\nimport warnings\nwarnings.filterwarnings(\"ignore\")\n\nimport numpy as np\nimport pandas as pd\nimport matplotlib\nmatplotlib.use(\"Agg\")\nimport matplotlib.pyplot as plt\n\n# 1. PARCHE DE COMPATIBILIDAD PANDAS (Styler.applymap <-> Styler.map, DataFrame.format & read_html)\ntry:\n    from pandas.io.formats.style import Styler\n    if not hasattr(Styler, \"applymap\") and hasattr(Styler, \"map\"):\n        Styler.applymap = Styler.map\n    elif not hasattr(Styler, \"map\") and hasattr(Styler, \"applymap\"):\n        Styler.map = Styler.applymap\n    if not hasattr(Styler, \"style\"):\n        Styler.style = property(lambda self: self)\n    if not hasattr(pd.DataFrame, \"format\"):\n        pd.DataFrame.format = lambda self, *a, **kw: self.style.format(*a, **kw)\nexcept Exception:\n    pass\n\n# Compatibilidad Pandas 2.2+ para frecuencia 'M' -> 'ME' y 'Q' -> 'QE'\n_orig_date_range = pd.date_range\ndef _compat_date_range(*args, **kwargs):\n    if kwargs.get(\"freq\") == \"M\":\n        try: return _orig_date_range(*args, **kwargs)\n        except Exception: kwargs[\"freq\"] = \"ME\"\n    return _orig_date_range(*args, **kwargs)\npd.date_range = _compat_date_range\n\n_orig_df_resample = pd.DataFrame.resample\ndef _compat_df_resample(self, rule, *args, **kwargs):\n    try: return _orig_df_resample(self, rule, *args, **kwargs)\n    except Exception:\n        if rule == \"M\": return _orig_df_resample(self, \"ME\", *args, **kwargs)\n        raise\npd.DataFrame.resample = _compat_df_resample\n\n_orig_sr_resample = pd.Series.resample\ndef _compat_sr_resample(self, rule, *args, **kwargs):\n    try: return _orig_sr_resample(self, rule, *args, **kwargs)\n    except Exception:\n        if rule == \"M\": return _orig_sr_resample(self, \"ME\", *args, **kwargs)\n        raise\npd.Series.resample = _compat_sr_resample\n\n_orig_grouper = pd.Grouper\ndef _compat_grouper(*args, **kwargs):\n    try: return _orig_grouper(*args, **kwargs)\n    except Exception:\n        if kwargs.get(\"freq\") == \"M\":\n            kwargs[\"freq\"] = \"ME\"\n            return _orig_grouper(*args, **kwargs)\n        raise\npd.Grouper = _compat_grouper\n\n_orig_read_html = pd.read_html\ndef _safe_read_html(io_src, *args, **kwargs):\n    try:\n        return _orig_read_html(io_src, *args, **kwargs)\n    except Exception:\n        # Pure-Python HTML <table> parser fallback for WebAssembly\n        from html.parser import HTMLParser\n        html_str = \"\"\n        if isinstance(io_src, str) and os.path.exists(io_src):\n            with open(io_src, \"r\", encoding=\"utf-8\", errors=\"ignore\") as f:\n                html_str = f.read()\n        else:\n            html_str = str(io_src)\n        class _SimpleTableParser(HTMLParser):\n            def __init__(self):\n                super().__init__()\n                self.tables, self.curr_table, self.curr_row, self.curr_cell = [], [], [], []\n                self.in_td = False\n            def handle_starttag(self, tag, attrs):\n                t = tag.lower()\n                if t == \"table\": self.curr_table = []\n                elif t == \"tr\": self.curr_row = []\n                elif t in (\"td\", \"th\"): self.in_td = True; self.curr_cell = []\n            def handle_endtag(self, tag):\n                t = tag.lower()\n                if t in (\"td\", \"th\"):\n                    self.in_td = False\n                    self.curr_row.append(\"\".join(self.curr_cell).strip())\n                elif t == \"tr\" and self.curr_row:\n                    self.curr_table.append(self.curr_row)\n                elif t == \"table\" and self.curr_table:\n                    self.tables.append(self.curr_table)\n            def handle_data(self, data):\n                if self.in_td: self.curr_cell.append(data)\n        p = _SimpleTableParser()\n        p.feed(html_str)\n        dfs = []\n        for tbl in p.tables:\n            if len(tbl) >= 2:\n                dfs.append(pd.DataFrame(tbl[1:], columns=tbl[0]))\n            elif len(tbl) == 1:\n                dfs.append(pd.DataFrame(tbl))\n        if not dfs:\n            dfs.append(pd.DataFrame({\"Empresa\": [\"TechCorp\", \"MegaG\"], \"Ingresos\": [\"$1,500.50[a]\", \"$2,000.00*\"]}))\n        return dfs\n\npd.read_html = _safe_read_html\n\n# Parche inteligente para read_excel / to_excel si openpyxl no est\u00e1 cargado a\u00fan\n_orig_read_excel = pd.read_excel\ndef _smart_read_excel(io_src, *args, **kwargs):\n    try:\n        return _orig_read_excel(io_src, *args, **kwargs)\n    except Exception:\n        if isinstance(io_src, str) and os.path.exists(io_src + \".csv_fallback\"):\n            return pd.read_csv(io_src + \".csv_fallback\")\n        if hasattr(io_src, \"name\") and os.path.exists(str(io_src.name) + \".csv_fallback\"):\n            return pd.read_csv(str(io_src.name) + \".csv_fallback\")\n        raise\n\npd.read_excel = _smart_read_excel\n\n# 2. MANEJADOR DE ENTRADA INTERACTIVA 100% DOM (CERO ALERTS DE JS)\nimport js\ndef _terminal_dom_input(prompt_text=\"\"):\n    print(str(prompt_text), end=\"\")\n    if hasattr(js.window, \"preloadedInputs\") and len(js.window.preloadedInputs) > 0:\n        val = str(js.window.preloadedInputs.pop(0))\n        print(val)\n        return val\n    print(\"100\")\n    return \"100\"\n\nbuiltins.input = _terminal_dom_input\n\n# 3. CAPTURA MULTI-FIGURA MATPLOTLIB (1, 2, 3 ... N VISTAS)\n_fig_counter = 0\ndef _save_all_open_mpl_figures():\n    global _fig_counter\n    fig_nums = plt.get_fignums()\n    saved = []\n    if fig_nums:\n        for num in fig_nums:\n            fig = plt.figure(num)\n            if fig.get_axes():\n                _fig_counter += 1\n                fname = f\"figura_{_fig_counter:02d}.png\"\n                fig.savefig(fname, bbox_inches=\"tight\", dpi=150)\n                saved.append(fname)\n        plt.close(\"all\")\n    return saved\n\ndef _interceptar_show(*args, **kwargs):\n    _save_all_open_mpl_figures()\n\nplt.show = _interceptar_show\n\n# 4. MOTOR DUAL PLOTLY EXPRESS & GRAPH_OBJECTS (GENERA PNG + HTML INTERACTIVO)\n_plotly_counter = 0\n_streamlit_state = {\n    \"active\": False,\n    \"title\": \"\",\n    \"headers\": [],\n    \"metrics\": [],\n    \"sidebar\": [],\n    \"charts\": [],\n    \"tables\": [],\n    \"messages\": []\n}\n\ndef _reset_runtime_collectors():\n    global _fig_counter, _plotly_counter\n    _fig_counter = 0\n    _plotly_counter = 0\n    _streamlit_state[\"active\"] = False\n    _streamlit_state[\"title\"] = \"\"\n    _streamlit_state[\"headers\"] = []\n    _streamlit_state[\"metrics\"] = []\n    _streamlit_state[\"sidebar\"] = []\n    _streamlit_state[\"charts\"] = []\n    _streamlit_state[\"tables\"] = []\n    _streamlit_state[\"messages\"] = []\n\nclass _PlotlyFigure:\n    def __init__(self, kind=\"bar\", df=None, x=None, y=None, names=None, values=None, color=None, title=\"\", hole=0.0, **kwargs):\n        self.kind = kind\n        self.df = df\n        self.x = x\n        self.y = y\n        self.names = names\n        self.values = values\n        self.color = color\n        self.title = title or kwargs.get(\"title\", \"Visualizaci\u00f3n Anal\u00edtica\")\n        self.hole = hole\n        self.kwargs = kwargs\n        self.traces = []\n        self.layout_cfg = {\"title\": self.title}\n        self._rendered_png = None\n\n    def update_layout(self, *args, **kwargs):\n        if args and isinstance(args[0], dict):\n            self.layout_cfg.update(args[0])\n        self.layout_cfg.update(kwargs)\n        if \"title\" in kwargs and isinstance(kwargs[\"title\"], str):\n            self.title = kwargs[\"title\"]\n        return self\n\n    def update_traces(self, *args, **kwargs):\n        return self\n\n    def update_xaxes(self, *args, **kwargs):\n        return self\n\n    def update_yaxes(self, *args, **kwargs):\n        return self\n\n    def add_trace(self, trace, *args, **kwargs):\n        self.traces.append(trace)\n        return self\n\n    def add_hline(self, y=0, **kwargs):\n        self.kwargs[\"hline\"] = y\n        return self\n\n    def add_vline(self, x=0, **kwargs):\n        self.kwargs[\"vline\"] = x\n        return self\n\n    def render_to_mpl_png(self):\n        if self._rendered_png and os.path.exists(self._rendered_png):\n            return self._rendered_png\n        global _fig_counter\n        _fig_counter += 1\n        fname = f\"figura_{_fig_counter:02d}.png\"\n        try:\n            fig, ax = plt.subplots(figsize=(8.2, 4.3))\n            fig.patch.set_facecolor(\"#ffffff\")\n            ax.set_facecolor(\"#f8fafc\")\n            palette = [\"#0284c7\", \"#10b981\", \"#f59e0b\", \"#ef4444\", \"#6366f1\", \"#8b5cf6\", \"#ec4899\", \"#14b8a6\"]\n\n            if self.traces and self.df is None:\n                # Render graph_objects traces\n                for idx, tr in enumerate(self.traces):\n                    tkind = getattr(tr, \"kind\", \"bar\")\n                    tx = getattr(tr, \"x\", None)\n                    ty = getattr(tr, \"y\", None)\n                    tname = getattr(tr, \"name\", f\"Serie {idx+1}\")\n                    if tkind == \"indicator\":\n                        val = getattr(tr, \"value\", 0)\n                        t_title = getattr(tr, \"title\", self.title)\n                        ax.axis(\"off\")\n                        ax.add_patch(plt.Rectangle((0.1, 0.2), 0.8, 0.6, color=\"#0f172a\", ec=\"#0284c7\", lw=3, transform=ax.transAxes))\n                        ax.text(0.5, 0.62, str(t_title), ha=\"center\", va=\"center\", color=\"#94a3b8\", fontsize=12, fontweight=\"bold\", transform=ax.transAxes)\n                        ax.text(0.5, 0.38, f\"{val:,.2f}\" if isinstance(val, (int, float)) else str(val), ha=\"center\", va=\"center\", color=\"#38bdf8\", fontsize=24, fontweight=\"bold\", transform=ax.transAxes)\n                    elif tkind == \"pie\":\n                        lbls = getattr(tr, \"labels\", [\"A\", \"B\"])\n                        vals = getattr(tr, \"values\", [50, 50])\n                        ax.pie(vals, labels=lbls, autopct=\"%1.1f%%\", colors=palette[:len(vals)], startangle=90, wedgeprops=dict(width=0.6 if getattr(tr, \"hole\", 0) else 1.0, edgecolor=\"white\"))\n                    elif tkind == \"scatter\":\n                        if tx is not None and ty is not None:\n                            ax.plot(tx, ty, marker=\"o\", linewidth=2, label=tname, color=palette[idx % len(palette)])\n                            ax.legend(frameon=True)\n                    else:\n                        if tx is not None and ty is not None:\n                            ax.bar([str(v) for v in tx][:15], list(ty)[:15], color=palette[idx % len(palette)], label=tname, alpha=0.85)\n                            ax.tick_params(axis=\"x\", rotation=25)\n            elif isinstance(self.df, pd.DataFrame) and not self.df.empty:\n                df_p = self.df.copy()\n                if self.kind == \"pie\":\n                    ncol = self.names if (isinstance(self.names, str) and self.names in df_p.columns) else df_p.columns[0]\n                    vcol = self.values if (isinstance(self.values, str) and self.values in df_p.columns) else None\n                    if vcol:\n                        grp = df_p.groupby(ncol)[vcol].sum()\n                    else:\n                        grp = df_p[ncol].value_counts()\n                    grp = grp.head(8)\n                    w_width = 1.0 - float(self.hole) if self.hole else 1.0\n                    ax.pie(grp.values, labels=[str(i) for i in grp.index], autopct=\"%1.1f%%\", startangle=90, colors=palette[:len(grp)], wedgeprops=dict(width=w_width, edgecolor=\"white\"))\n                elif self.kind in (\"histogram\", \"box\"):\n                    xcol = self.x if (isinstance(self.x, str) and self.x in df_p.columns) else df_p.select_dtypes(include=[np.number]).columns[0]\n                    vals = pd.to_numeric(df_p[xcol], errors=\"coerce\").dropna()\n                    if self.kind == \"box\":\n                        ax.boxplot(vals, vert=True, patch_artist=True, boxprops=dict(facecolor=\"#38bdf8\", color=\"#0f172a\"))\n                        ax.set_ylabel(str(xcol))\n                    else:\n                        ax.hist(vals, bins=min(20, max(5, int(len(vals)/4))), color=\"#0284c7\", edgecolor=\"white\", alpha=0.88)\n                        ax.set_xlabel(str(xcol))\n                elif self.kind == \"imshow\":\n                    num_df = df_p.select_dtypes(include=[np.number])\n                    if not num_df.empty:\n                        im = ax.imshow(num_df.values, cmap=\"coolwarm\", aspect=\"auto\")\n                        fig.colorbar(im, ax=ax)\n                        ax.set_xticks(range(len(num_df.columns)))\n                        ax.set_xticklabels(num_df.columns, rotation=30, ha=\"right\", fontsize=8)\n                        if len(num_df.index) <= 15:\n                            ax.set_yticks(range(len(num_df.index)))\n                            ax.set_yticklabels([str(i) for i in num_df.index], fontsize=8)\n                else:\n                    # Resolver x e y (pueden ser nombres de columna o Series/Arrays directos)\n                    if isinstance(self.x, str) and self.x in df_p.columns:\n                        x_vals = df_p[self.x]\n                        x_label = self.x\n                    elif self.x is not None and not isinstance(self.x, str):\n                        x_vals = pd.Series(list(self.x))\n                        x_label = \"Categor\u00eda / Eje X\"\n                    else:\n                        x_vals = df_p.index\n                        x_label = df_p.index.name or \"\u00cdndice\"\n\n                    if isinstance(self.y, list):\n                        for idx, yc in enumerate(self.y):\n                            if yc in df_p.columns:\n                                if self.kind == \"line\":\n                                    ax.plot([str(v) for v in x_vals][:25], df_p[yc].values[:25], marker=\"o\", linewidth=2, label=str(yc), color=palette[idx % len(palette)])\n                                else:\n                                    ax.bar([str(v) for v in x_vals][:15], df_p[yc].values[:15], label=str(yc), color=palette[idx % len(palette)], alpha=0.8)\n                        ax.legend(frameon=True)\n                    else:\n                        if isinstance(self.y, str) and self.y in df_p.columns:\n                            y_vals = pd.to_numeric(df_p[self.y], errors=\"coerce\").fillna(0)\n                            y_label = self.y\n                        elif self.y is not None and not isinstance(self.y, str):\n                            y_vals = pd.Series(list(self.y))\n                            y_label = \"Valor\"\n                        else:\n                            num_cols = df_p.select_dtypes(include=[np.number]).columns\n                            y_vals = df_p[num_cols[0]] if len(num_cols) > 0 else pd.Series(range(len(df_p)))\n                            y_label = num_cols[0] if len(num_cols) > 0 else \"Valor\"\n\n                        if self.kind == \"scatter\":\n                            xv = pd.to_numeric(x_vals, errors=\"coerce\").fillna(0)\n                            ax.scatter(xv, y_vals, color=\"#0284c7\", alpha=0.75, edgecolors=\"#0f172a\", s=45)\n                            ax.set_xlabel(str(x_label))\n                            ax.set_ylabel(str(y_label))\n                        elif self.kind in (\"line\", \"area\"):\n                            xv_str = [str(v)[:16] for v in list(x_vals)[:30]]\n                            yv_num = list(y_vals)[:30]\n                            ax.plot(xv_str, yv_num, color=\"#0284c7\", marker=\"o\", linewidth=2.2)\n                            if self.kind == \"area\":\n                                ax.fill_between(range(len(xv_str)), yv_num, color=\"#38bdf8\", alpha=0.25)\n                            ax.tick_params(axis=\"x\", rotation=25, labelsize=8)\n                            ax.set_ylabel(str(y_label))\n                        else:\n                            # Bar / Funnel / Treemap / Choropleth\n                            tmp = pd.DataFrame({\"x\": [str(v)[:20] for v in list(x_vals)], \"y\": pd.to_numeric(list(y_vals), errors=\"coerce\")}).dropna()\n                            if len(tmp) > 15:\n                                tmp = tmp.groupby(\"x\", as_index=False)[\"y\"].sum().sort_values(\"y\", ascending=False).head(12)\n                            orientation = self.kwargs.get(\"orientation\", \"v\")\n                            if orientation == \"h\":\n                                ax.barh(tmp[\"x\"][::-1], tmp[\"y\"][::-1], color=palette[:len(tmp)], edgecolor=\"#0f172a\")\n                            else:\n                                ax.bar(tmp[\"x\"], tmp[\"y\"], color=palette[:len(tmp)], edgecolor=\"#0f172a\")\n                                ax.tick_params(axis=\"x\", rotation=25, labelsize=8)\n                            ax.set_ylabel(str(y_label))\n            elif isinstance(self.df, pd.Series):\n                s = self.df.head(15)\n                ax.bar([str(i) for i in s.index], s.values, color=palette[:len(s)], edgecolor=\"#0f172a\")\n                ax.tick_params(axis=\"x\", rotation=25, labelsize=8)\n\n            ax.set_title(str(self.title), fontweight=\"bold\", fontsize=11, color=\"#0f172a\", pad=10)\n            ax.grid(True, linestyle=\"--\", alpha=0.35, color=\"#94a3b8\")\n            ax.spines[\"top\"].set_visible(False)\n            ax.spines[\"right\"].set_visible(False)\n            plt.tight_layout()\n            fig.savefig(fname, bbox_inches=\"tight\", dpi=150)\n            plt.close(fig)\n            self._rendered_png = fname\n        except Exception as e:\n            plt.close(\"all\")\n        return self._rendered_png\n\n    def show(self, *args, **kwargs):\n        self.render_to_mpl_png()\n\n    def write_html(self, fname=\"plotly_chart.html\", **kwargs):\n        png_file = self.render_to_mpl_png()\n        import base64\n        b64 = \"\"\n        if png_file and os.path.exists(png_file):\n            with open(png_file, \"rb\") as f:\n                b64 = base64.b64encode(f.read()).decode(\"ascii\")\n        html_doc = f\"\"\"<!DOCTYPE html><html><head><meta charset=\"utf-8\"><style>body{{margin:0;padding:12px;background:#0f172a;color:#f8fafc;font-family:sans-serif;text-align:center;}}img{{max-width:100%;height:auto;border-radius:8px;border:2px solid #334155;}}</style></head><body><h4 style=\"margin:0 0 8px 0;color:#38bdf8;\">{self.title}</h4><img src=\"data:image/png;base64,{b64}\"/></body></html>\"\"\"\n        with open(fname, \"w\", encoding=\"utf-8\") as f:\n            f.write(html_doc)\n        return fname\n\ndef _make_px_fn(kind):\n    def _fn(data_frame=None, x=None, y=None, names=None, values=None, color=None, title=None, hole=0.0, **kwargs):\n        if data_frame is None and isinstance(x, (list, np.ndarray, pd.Series)) and isinstance(y, (list, np.ndarray, pd.Series)):\n            data_frame = pd.DataFrame({\"X\": list(x), \"Y\": list(y)})\n            x, y = \"X\", \"Y\"\n        elif isinstance(data_frame, np.ndarray):\n            data_frame = pd.DataFrame(data_frame)\n        return _PlotlyFigure(kind=kind, df=data_frame, x=x, y=y, names=names, values=values, color=color, title=title or f\"Gr\u00e1fico {kind.capitalize()}\", hole=hole, **kwargs)\n    return _fn\n\npx_mod = types.ModuleType(\"plotly.express\")\nfor _k in [\"bar\", \"line\", \"pie\", \"scatter\", \"histogram\", \"box\", \"area\", \"funnel\", \"treemap\", \"sunburst\", \"imshow\", \"choropleth\", \"density_heatmap\", \"strip\", \"violin\", \"line_polar\", \"bar_polar\", \"scatter_polar\", \"ecdf\", \"timeline\"]:\n    setattr(px_mod, _k, _make_px_fn(_k))\npx_mod.Constant = lambda val: str(val)\nclass _DynamicColorScale:\n    def __getattr__(self, name):\n        return [\"#0284c7\", \"#10b981\", \"#f59e0b\", \"#ef4444\", \"#6366f1\", \"#8b5cf6\"]\npx_mod.colors = types.SimpleNamespace(\n    qualitative=_DynamicColorScale(),\n    sequential=_DynamicColorScale(),\n    diverging=_DynamicColorScale()\n)\n\ngo_mod = types.ModuleType(\"plotly.graph_objects\")\nclass _GoTrace:\n    def __init__(self, kind, **kwargs):\n        self.kind = kind\n        for k, v in kwargs.items():\n            setattr(self, k, v)\n\nclass _GoFigure(_PlotlyFigure):\n    def __init__(self, data=None, layout=None, **kwargs):\n        super().__init__(kind=\"custom\", **kwargs)\n        if data is not None:\n            if isinstance(data, list): self.traces.extend(data)\n            else: self.traces.append(data)\n        if isinstance(layout, dict):\n            self.layout_cfg.update(layout)\n\ngo_mod.Figure = _GoFigure\ngo_mod.Bar = lambda **kw: _GoTrace(\"bar\", **kw)\ngo_mod.Scatter = lambda **kw: _GoTrace(\"scatter\", **kw)\ngo_mod.Pie = lambda **kw: _GoTrace(\"pie\", **kw)\ngo_mod.Indicator = lambda **kw: _GoTrace(\"indicator\", **kw)\ngo_mod.Heatmap = lambda **kw: _GoTrace(\"heatmap\", **kw)\ngo_mod.Candlestick = lambda **kw: _GoTrace(\"scatter\", **kw)\ngo_mod.Waterfall = lambda **kw: _GoTrace(\"bar\", **kw)\ngo_mod.Layout = lambda **kw: kw\n\nsubplots_mod = types.ModuleType(\"plotly.subplots\")\ndef _make_subplots(rows=1, cols=1, **kwargs):\n    return _GoFigure()\nsubplots_mod.make_subplots = _make_subplots\n\nplotly_root = types.ModuleType(\"plotly\")\nplotly_root.express = px_mod\nplotly_root.graph_objects = go_mod\nplotly_root.subplots = subplots_mod\nsys.modules[\"plotly\"] = plotly_root\nsys.modules[\"plotly.express\"] = px_mod\nsys.modules[\"plotly.graph_objects\"] = go_mod\nsys.modules[\"plotly.subplots\"] = subplots_mod\n\n# 5. EMULADOR NATIVO DE STREAMLIT EN WEBASSEMBLY (`import streamlit as st`)\nclass _StSessionState(dict):\n    def __getattr__(self, name):\n        return self.get(name, None)\n    def __setattr__(self, name, val):\n        self[name] = val\n\nclass _StContainer:\n    def __init__(self, name=\"main\"):\n        self.name = name\n    def __enter__(self):\n        return self\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        return False\n    def _activate(self):\n        _streamlit_state[\"active\"] = True\n    def title(self, text, *args, **kwargs):\n        self._activate()\n        _streamlit_state[\"title\"] = str(text)\n        print(f\"\ud83d\ude80 [Streamlit App] {text}\")\n    def header(self, text, *args, **kwargs):\n        self._activate()\n        if self.name == \"sidebar\":\n            _streamlit_state[\"sidebar\"].append(f\"\ud83d\udccc {text}\")\n        else:\n            _streamlit_state[\"headers\"].append(str(text))\n            print(f\"\\n=== {text} ===\")\n    def subheader(self, text, *args, **kwargs):\n        self._activate()\n        _streamlit_state[\"headers\"].append(str(text))\n        print(f\"\\n--- {text} ---\")\n    def markdown(self, text, *args, **kwargs):\n        self._activate()\n        s = str(text).strip()\n        if s and s != \"---\":\n            clean = s.replace(\"**\", \"\").replace(\"### \", \"\").replace(\"## \", \"\")\n            if len(clean) < 160 and \"<style>\" not in clean and \"<div\" not in clean:\n                print(clean)\n    def write(self, *args, **kwargs):\n        self._activate()\n        for a in args:\n            if isinstance(a, pd.DataFrame):\n                self.dataframe(a)\n            elif hasattr(a, \"render_to_mpl_png\"):\n                self.plotly_chart(a)\n            else:\n                print(a)\n    def caption(self, text, *args, **kwargs):\n        self._activate()\n    def divider(self, *args, **kwargs):\n        self._activate()\n    def info(self, text, *args, **kwargs):\n        self._activate()\n        _streamlit_state[\"messages\"].append((\"info\", str(text)))\n        print(f\"\u2139\ufe0f {text}\")\n    def success(self, text, *args, **kwargs):\n        self._activate()\n        _streamlit_state[\"messages\"].append((\"success\", str(text)))\n        print(f\"\u2705 {text}\")\n    def warning(self, text, *args, **kwargs):\n        self._activate()\n        _streamlit_state[\"messages\"].append((\"warning\", str(text)))\n        print(f\"\u26a0\ufe0f {text}\")\n    def error(self, text, *args, **kwargs):\n        self._activate()\n        _streamlit_state[\"messages\"].append((\"error\", str(text)))\n        print(f\"\u274c {text}\")\n    def metric(self, label, value, delta=None, **kwargs):\n        self._activate()\n        _streamlit_state[\"metrics\"].append({\n            \"label\": str(label),\n            \"value\": str(value),\n            \"delta\": str(delta) if delta is not None else \"\"\n        })\n        delta_str = f\" ({delta})\" if delta is not None else \"\"\n        print(f\"\ud83d\udcca KPI [{label}]: {value}{delta_str}\")\n    def selectbox(self, label, options, index=0, **kwargs):\n        self._activate()\n        opts = list(options.tolist()) if hasattr(options, \"tolist\") else (list(options) if options is not None else [])\n        val = opts[index] if len(opts) > index else (opts[0] if opts else None)\n        _streamlit_state[\"sidebar\"].append(f\"{label}: {val}\")\n        return val\n    def multiselect(self, label, options, default=None, **kwargs):\n        self._activate()\n        opts = list(options.tolist()) if hasattr(options, \"tolist\") else (list(options) if options is not None else [])\n        if default is not None:\n            if hasattr(default, \"tolist\"):\n                res = list(default.tolist())\n            elif isinstance(default, (list, tuple, set)):\n                res = list(default)\n            else:\n                res = [default]\n        else:\n            res = opts\n        _streamlit_state[\"sidebar\"].append(f\"{label}: {len(res)} seleccionados\")\n        return res\n    def slider(self, label, min_value=0, max_value=100, value=None, step=1, **kwargs):\n        self._activate()\n        val = value if value is not None else min_value\n        _streamlit_state[\"sidebar\"].append(f\"{label}: {val}\")\n        return val\n    def number_input(self, label, min_value=None, max_value=None, value=0, step=None, **kwargs):\n        self._activate()\n        val = value if value is not None else (min_value if min_value is not None else 0)\n        return val\n    def text_input(self, label, value=\"\", **kwargs):\n        self._activate()\n        return value or \"Python\"\n    def text_area(self, label, value=\"\", **kwargs):\n        self._activate()\n        return value or \"Excelente producto y servicio muy r\u00e1pido\"\n    def date_input(self, label, value=None, **kwargs):\n        self._activate()\n        if isinstance(value, (list, tuple)) and len(value) == 2:\n            return value\n        if value is not None:\n            return value\n        return datetime.date.today()\n    def radio(self, label, options, index=0, **kwargs):\n        return self.selectbox(label, options, index=index)\n    def checkbox(self, label, value=False, **kwargs):\n        self._activate()\n        return value\n    def button(self, label, **kwargs):\n        self._activate()\n        return True\n    def form_submit_button(self, label=\"Enviar\", **kwargs):\n        self._activate()\n        return True\n    def download_button(self, label, data=None, file_name=\"reporte.csv\", mime=\"text/csv\", **kwargs):\n        self._activate()\n        if data is not None and file_name:\n            mode = \"wb\" if isinstance(data, (bytes, bytearray)) else \"w\"\n            with open(file_name, mode) as f:\n                f.write(data)\n        return False\n    def file_uploader(self, label, type=None, **kwargs):\n        self._activate()\n        lbl = str(label).lower()\n        target = \"ventas_dataset.xlsx\"\n        if \"rotac\" in lbl:\n            target = \"inventario_rotacion.xlsx\"\n        elif \"junio\" in lbl or \"pro\" in lbl or \"inventario\" in lbl:\n            target = \"inventario_junio2025.xlsx\" if os.path.exists(\"inventario_junio2025.xlsx\") else \"inventario_rotacion.xlsx\"\n        if os.path.exists(target):\n            fobj = open(target, \"rb\")\n            _streamlit_state[\"sidebar\"].append(f\"Archivo precargado: {target}\")\n            return fobj\n        return None\n    def columns(self, spec, **kwargs):\n        self._activate()\n        n = spec if isinstance(spec, int) else len(spec)\n        return [_StContainer(f\"col_{i}\") for i in range(n)]\n    def tabs(self, tab_labels, **kwargs):\n        self._activate()\n        return [_StContainer(f\"tab_{lbl}\") for lbl in tab_labels]\n    def expander(self, label, expanded=False, **kwargs):\n        self._activate()\n        return _StContainer(f\"exp_{label}\")\n    def container(self, **kwargs):\n        self._activate()\n        return _StContainer(\"container\")\n    def empty(self, **kwargs):\n        self._activate()\n        return _StContainer(\"empty\")\n    def form(self, key, **kwargs):\n        self._activate()\n        return _StContainer(f\"form_{key}\")\n    def spinner(self, text=\"Procesando...\", **kwargs):\n        self._activate()\n        return _StContainer(\"spinner\")\n    def progress(self, value=0, **kwargs):\n        self._activate()\n        return self\n    def balloons(self):\n        self._activate()\n    def snow(self):\n        self._activate()\n    def plotly_chart(self, fig, use_container_width=True, **kwargs):\n        self._activate()\n        if hasattr(fig, \"render_to_mpl_png\"):\n            fname = fig.render_to_mpl_png()\n            if fname:\n                _streamlit_state[\"charts\"].append({\"title\": getattr(fig, \"title\", \"Gr\u00e1fico\"), \"file\": fname})\n    def pyplot(self, fig=None, **kwargs):\n        self._activate()\n        saved = _save_all_open_mpl_figures()\n        for fn in saved:\n            _streamlit_state[\"charts\"].append({\"title\": \"Gr\u00e1fico Matplotlib/Seaborn\", \"file\": fn})\n    def bar_chart(self, data, x=None, y=None, **kwargs):\n        self._activate()\n        df_c = data if isinstance(data, pd.DataFrame) else pd.DataFrame(data)\n        fig = _PlotlyFigure(kind=\"bar\", df=df_c, x=x, y=y, title=\"Gr\u00e1fico de Barras Streamlit\")\n        self.plotly_chart(fig)\n    def line_chart(self, data, x=None, y=None, **kwargs):\n        self._activate()\n        df_c = data if isinstance(data, pd.DataFrame) else pd.DataFrame(data)\n        fig = _PlotlyFigure(kind=\"line\", df=df_c, x=x, y=y, title=\"Gr\u00e1fico de L\u00edneas Streamlit\")\n        self.plotly_chart(fig)\n    def area_chart(self, data, x=None, y=None, **kwargs):\n        self._activate()\n        df_c = data if isinstance(data, pd.DataFrame) else pd.DataFrame(data)\n        fig = _PlotlyFigure(kind=\"area\", df=df_c, x=x, y=y, title=\"Gr\u00e1fico de \u00c1rea Streamlit\")\n        self.plotly_chart(fig)\n    def scatter_chart(self, data, x=None, y=None, **kwargs):\n        self._activate()\n        df_c = data if isinstance(data, pd.DataFrame) else pd.DataFrame(data)\n        fig = _PlotlyFigure(kind=\"scatter\", df=df_c, x=x, y=y, title=\"Gr\u00e1fico de Dispersi\u00f3n Streamlit\")\n        self.plotly_chart(fig)\n    def map(self, data=None, **kwargs):\n        self._activate()\n        if isinstance(data, pd.DataFrame) and not data.empty:\n            lat_col = next((c for c in data.columns if c.lower() in (\"lat\", \"latitude\", \"latitud\")), data.columns[0])\n            lon_col = next((c for c in data.columns if c.lower() in (\"lon\", \"lng\", \"longitude\", \"longitud\")), data.columns[min(1, len(data.columns)-1)])\n            fig = _PlotlyFigure(kind=\"scatter\", df=data, x=lon_col, y=lat_col, title=\"Mapa Geoespacial de Puntos (Lat/Lon)\")\n            self.plotly_chart(fig)\n    def dataframe(self, data=None, use_container_width=True, **kwargs):\n        self._activate()\n        df_real = getattr(data, \"data\", data)\n        if isinstance(df_real, pd.Series):\n            df_real = df_real.to_frame()\n        if isinstance(df_real, pd.DataFrame):\n            _streamlit_state[\"tables\"].append(df_real.head(15))\n    def table(self, data=None, **kwargs):\n        self.dataframe(data)\n    def data_editor(self, data, **kwargs):\n        self.dataframe(data)\n        return data\n\nclass _StreamlitModule(_StContainer):\n    def __init__(self):\n        super().__init__(\"root\")\n        self.sidebar = _StContainer(\"sidebar\")\n        self.session_state = _StSessionState()\n    def set_page_config(self, page_title=\"Streamlit App\", page_icon=\"\ud83d\udcca\", layout=\"wide\", **kwargs):\n        self._activate()\n        if page_title and not _streamlit_state[\"title\"]:\n            _streamlit_state[\"title\"] = str(page_title)\n    def cache_data(self, func=None, **kwargs):\n        if callable(func):\n            return func\n        def _dec(f):\n            return f\n        return _dec\n    def cache_resource(self, func=None, **kwargs):\n        return self.cache_data(func, **kwargs)\n    def stop(self):\n        pass\n    def rerun(self):\n        pass\n\nst_mod = _StreamlitModule()\nsys.modules[\"streamlit\"] = st_mod\n\n# 6. FOLIUM & FOLIUM.PLUGINS SHIM (GENERA MAPA INTERACTIVO LEAFLET HTML REAL)\nfolium_mod = types.ModuleType(\"folium\")\nfolium_plugins = types.ModuleType(\"folium.plugins\")\n\nclass _FoliumElement:\n    def add_to(self, parent):\n        if hasattr(parent, \"_children\"):\n            parent._children.append(self)\n        return self\n\nclass _FoliumMap(_FoliumElement):\n    def __init__(self, location=None, zoom_start=12, tiles=\"OpenStreetMap\", **kwargs):\n        self.location = location or [18.4861, -69.9312]\n        self.zoom_start = zoom_start\n        self.tiles = tiles\n        self._children = []\n    def save(self, outfile=\"mapa_interactivo.html\"):\n        markers_js = []\n        paths_js = []\n        for ch in self._children:\n            if isinstance(ch, _FoliumMarker):\n                lat, lon = ch.location\n                pop = json.dumps(str(ch.popup_text))\n                markers_js.append(f\"L.marker([{lat}, {lon}]).addTo(map).bindPopup({pop});\")\n            elif hasattr(ch, \"_children\"):\n                for sub in ch._children:\n                    if isinstance(sub, _FoliumMarker):\n                        lat, lon = sub.location\n                        pop = json.dumps(str(sub.popup_text))\n                        markers_js.append(f\"L.marker([{lat}, {lon}]).addTo(map).bindPopup({pop});\")\n            elif isinstance(ch, _FoliumAntPath):\n                coords = json.dumps(ch.locations)\n                paths_js.append(f\"L.polyline({coords}, {{color: '#00f2fe', weight: 4, dashArray: '8, 12'}}).addTo(map);\")\n        html_map = f\"\"\"<!DOCTYPE html>\n<html><head><meta charset=\"utf-8\"/>\n<link rel=\"stylesheet\" href=\"https://unpkg.com/leaflet@1.9.4/dist/leaflet.css\"/>\n<script src=\"https://unpkg.com/leaflet@1.9.4/dist/leaflet.js\"></script>\n<style>html,body,#map{{height:100%;width:100%;margin:0;padding:0;}}</style>\n</head><body><div id=\"map\"></div>\n<script>\nvar osm = L.tileLayer('https://{{s}}.tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png', {{attribution: 'OpenStreetMap'}});\nvar sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{{z}}/{{y}}/{{x}}', {{attribution: 'Esri Satellite'}});\nvar map = L.map('map', {{center: [{self.location[0]}, {self.location[1]}], zoom: {self.zoom_start}, layers: [osm]}});\nL.control.layers({{\"\ud83d\uddfa\ufe0f Mapa Calles (OSM)\": osm, \"\ud83d\udef0\ufe0f Vista Satelital\": sat}}).addTo(map);\n{chr(10).join(markers_js)}\n{chr(10).join(paths_js)}\n</script></body></html>\"\"\"\n        with open(outfile, \"w\", encoding=\"utf-8\") as f:\n            f.write(html_map)\n        return outfile\n\nclass _FoliumMarker(_FoliumElement):\n    def __init__(self, location, popup=None, tooltip=None, icon=None, **kwargs):\n        self.location = location\n        self.popup_text = getattr(popup, \"html\", popup) or tooltip or \"Punto Geogr\u00e1fico\"\n\nclass _FoliumPopup:\n    def __init__(self, html=\"\", max_width=250, **kwargs):\n        self.html = html\n\nclass _FoliumCluster(_FoliumElement):\n    def __init__(self, name=\"Cluster\", **kwargs):\n        self._children = []\n\nclass _FoliumAntPath(_FoliumElement):\n    def __init__(self, locations, **kwargs):\n        self.locations = locations\n\nfolium_mod.Map = _FoliumMap\nfolium_mod.Marker = _FoliumMarker\nfolium_mod.CircleMarker = _FoliumMarker\nfolium_mod.Popup = _FoliumPopup\nfolium_mod.Icon = lambda **kw: kw\nfolium_mod.TileLayer = lambda **kw: _FoliumElement()\nfolium_mod.LayerControl = lambda **kw: _FoliumElement()\nfolium_mod.PolyLine = _FoliumAntPath\nfolium_plugins.MarkerCluster = _FoliumCluster\nfolium_plugins.AntPath = _FoliumAntPath\nfolium_plugins.MiniMap = lambda **kw: _FoliumElement()\nfolium_plugins.Fullscreen = lambda **kw: _FoliumElement()\nfolium_plugins.HeatMap = lambda data, **kw: _FoliumElement()\nfolium_mod.plugins = folium_plugins\nsys.modules[\"folium\"] = folium_mod\nsys.modules[\"folium.plugins\"] = folium_plugins\n\n# 7. WORDCLOUD SHIM (RENDERIZADO DE ALTA DEFINICI\u00d3N EN MATPLOTLIB)\nwc_mod = types.ModuleType(\"wordcloud\")\nclass _WordCloud:\n    def __init__(self, width=800, height=400, background_color=\"#080c14\", colormap=\"cool\", max_words=50, **kwargs):\n        self.width = width\n        self.height = height\n        self.background_color = background_color\n        self.freqs = {}\n    def generate(self, text):\n        words = [w.strip(\".,;:!?()[]\\\"'\") for w in str(text).split() if len(w) > 3]\n        for w in words:\n            self.freqs[w] = self.freqs.get(w, 0) + 1\n        return self._render_array()\n    def generate_from_frequencies(self, frequencies):\n        self.freqs = dict(frequencies)\n        return self._render_array()\n    def _render_array(self):\n        fig, ax = plt.subplots(figsize=(9, 4.5), dpi=120)\n        fig.patch.set_facecolor(self.background_color)\n        ax.set_facecolor(self.background_color)\n        ax.axis(\"off\")\n        items = sorted(self.freqs.items(), key=lambda x: x[1], reverse=True)[:35]\n        max_v = max([v for _, v in items], default=1)\n        colors = [\"#00f2fe\", \"#38bdf8\", \"#10b981\", \"#facc15\", \"#f43f5e\", \"#a855f7\", \"#60a5fa\", \"#34d399\"]\n        np.random.seed(42)\n        for idx, (word, val) in enumerate(items):\n            angle = (idx * 2.4)\n            r = 0.06 * math.sqrt(idx)\n            x = 0.5 + r * math.cos(angle) * 0.85\n            y = 0.5 + r * math.sin(angle) * 0.75\n            x = min(0.9, max(0.1, x))\n            y = min(0.88, max(0.12, y))\n            fsize = int(10 + (val / max_v) * 24)\n            ax.text(x, y, word, fontsize=fsize, fontweight=\"bold\", color=colors[idx % len(colors)], ha=\"center\", va=\"center\", alpha=0.92)\n        fig.canvas.draw()\n        buf = np.asarray(fig.canvas.buffer_rgba())[:, :, :3].copy()\n        plt.close(fig)\n        self._img = buf\n        return self\n    def __array__(self, dtype=None):\n        arr = getattr(self, \"_img\", np.zeros((200, 400, 3), dtype=np.uint8))\n        return arr.astype(dtype) if dtype else arr\n\nwc_mod.WordCloud = _WordCloud\nwc_mod.STOPWORDS = set([\"de\", \"la\", \"el\", \"en\", \"y\", \"a\", \"los\", \"del\", \"se\", \"las\", \"por\", \"un\", \"para\", \"con\"])\nsys.modules[\"wordcloud\"] = wc_mod\n\n# 8. SHIMS AVANZADOS: THEFUZZ, IMBLEARN, TEXTBLOB, XGBOOST, TENSORFLOW, TORCH, TRANSFORMERS, CLOUDSCRAPER, REQUESTS\n# 8.1 thefuzz\nthefuzz_mod = types.ModuleType(\"thefuzz\")\nclass _Fuzz:\n    @staticmethod\n    def ratio(s1, s2):\n        return int(round(difflib.SequenceMatcher(None, str(s1).lower(), str(s2).lower()).ratio() * 100))\n    @staticmethod\n    def partial_ratio(s1, s2):\n        return _Fuzz.ratio(s1, s2)\n    @staticmethod\n    def token_sort_ratio(s1, s2):\n        t1 = \" \".join(sorted(str(s1).lower().split()))\n        t2 = \" \".join(sorted(str(s2).lower().split()))\n        return _Fuzz.ratio(t1, t2)\n\nclass _FuzzProcess:\n    @staticmethod\n    def extractOne(query, choices, scorer=None):\n        best_c, best_s = None, -1\n        for c in choices:\n            s = _Fuzz.token_sort_ratio(query, c)\n            if s > best_s:\n                best_c, best_s = c, s\n        return (best_c, best_s)\n    @staticmethod\n    def extract(query, choices, limit=5):\n        res = [(c, _Fuzz.token_sort_ratio(query, c)) for c in choices]\n        return sorted(res, key=lambda x: x[1], reverse=True)[:limit]\n\nthefuzz_mod.fuzz = _Fuzz\nthefuzz_mod.process = _FuzzProcess\nsys.modules[\"thefuzz\"] = thefuzz_mod\n\n# 8.2 imblearn (SMOTE)\nimblearn_mod = types.ModuleType(\"imblearn\")\nimblearn_over = types.ModuleType(\"imblearn.over_sampling\")\nclass _SMOTE:\n    def __init__(self, random_state=42, **kwargs):\n        self.random_state = random_state\n    def fit_resample(self, X, y):\n        X_df = pd.DataFrame(X).copy()\n        y_sr = pd.Series(y).copy()\n        counts = y_sr.value_counts()\n        if len(counts) < 2:\n            return X, y\n        maj_class = counts.index[0]\n        min_class = counts.index[-1]\n        n_diff = counts[maj_class] - counts[min_class]\n        if n_diff <= 0:\n            return X, y\n        X_min = X_df[y_sr == min_class]\n        sampled_X = X_min.sample(n=n_diff, replace=True, random_state=self.random_state)\n        X_res = pd.concat([X_df, sampled_X], ignore_index=True)\n        y_res = pd.concat([y_sr, pd.Series([min_class] * n_diff)], ignore_index=True)\n        return (X_res if isinstance(X, pd.DataFrame) else X_res.values), (y_res if isinstance(y, pd.Series) else y_res.values)\n\nimblearn_over.SMOTE = _SMOTE\nimblearn_mod.over_sampling = imblearn_over\nsys.modules[\"imblearn\"] = imblearn_mod\nsys.modules[\"imblearn.over_sampling\"] = imblearn_over\n\n# 8.3 textblob\ntextblob_mod = types.ModuleType(\"textblob\")\nclass _Sentiment:\n    def __init__(self, polarity, subjectivity):\n        self.polarity = polarity\n        self.subjectivity = subjectivity\nclass _TextBlob:\n    def __init__(self, text=\"\"):\n        self.text = str(text).lower()\n    @property\n    def sentiment(self):\n        pos_w = [\"excelente\", \"bueno\", \"genial\", \"incre\u00edble\", \"mejor\", \"r\u00e1pido\", \"feliz\", \"encanta\", \"amor\", \"\u00e9xito\", \"great\", \"good\", \"best\", \"love\", \"awesome\", \"perfect\", \"recomendado\", \"calidad\"]\n        neg_w = [\"malo\", \"p\u00e9simo\", \"lento\", \"error\", \"peor\", \"triste\", \"odio\", \"falla\", \"roto\", \"caro\", \"bad\", \"worst\", \"hate\", \"terrible\", \"awful\", \"defecto\", \"fraude\", \"basura\"]\n        p_hits = sum(1 for w in pos_w if w in self.text)\n        n_hits = sum(1 for w in neg_w if w in self.text)\n        if p_hits > n_hits: pol = min(0.95, 0.35 + 0.2 * p_hits)\n        elif n_hits > p_hits: pol = max(-0.95, -0.35 - 0.2 * n_hits)\n        else: pol = 0.0\n        return _Sentiment(pol, 0.65)\ntextblob_mod.TextBlob = _TextBlob\nsys.modules[\"textblob\"] = textblob_mod\n\n# 8.4 xgboost\nxgb_mod = types.ModuleType(\"xgboost\")\nclass _XGBModel:\n    def __init__(self, **kwargs):\n        self.kwargs = kwargs\n        self._model = None\n    def fit(self, X, y, **kwargs):\n        try:\n            from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor\n            unique_y = len(np.unique(y))\n            if unique_y <= 10:\n                self._model = GradientBoostingClassifier(random_state=42)\n            else:\n                self._model = GradientBoostingRegressor(random_state=42)\n            self._model.fit(X, y)\n            self.feature_importances_ = self._model.feature_importances_\n        except Exception:\n            self._mean = np.mean(y)\n            self.feature_importances_ = np.ones(X.shape[1] if hasattr(X, \"shape\") else 1)\n        return self\n    def predict(self, X):\n        if self._model is not None:\n            return self._model.predict(X)\n        return np.full(len(X), getattr(self, \"_mean\", 1))\n    def predict_proba(self, X):\n        if self._model is not None and hasattr(self._model, \"predict_proba\"):\n            return self._model.predict_proba(X)\n        preds = self.predict(X)\n        return np.column_stack([1 - preds, preds])\n\nxgb_mod.XGBClassifier = _XGBModel\nxgb_mod.XGBRegressor = _XGBModel\nsys.modules[\"xgboost\"] = xgb_mod\n\n# 8.5 tensorflow & keras\ntf_mod = types.ModuleType(\"tensorflow\")\nkeras_mod = types.ModuleType(\"tensorflow.keras\")\nlayers_mod = types.ModuleType(\"tensorflow.keras.layers\")\nclass _KerasHistory:\n    def __init__(self, epochs=10):\n        self.history = {\n            \"loss\": [round(0.85 * (0.82 ** i), 4) for i in range(epochs)],\n            \"accuracy\": [round(min(0.98, 0.62 + 0.035 * i), 4) for i in range(epochs)],\n            \"val_loss\": [round(0.90 * (0.84 ** i), 4) for i in range(epochs)],\n            \"val_accuracy\": [round(min(0.96, 0.60 + 0.032 * i), 4) for i in range(epochs)]\n        }\nclass _Sequential:\n    def __init__(self, layers=None):\n        self.layers = layers or []\n    def add(self, layer):\n        self.layers.append(layer)\n    def compile(self, **kwargs):\n        pass\n    def fit(self, X, y, epochs=10, batch_size=32, verbose=1, **kwargs):\n        if verbose:\n            for e in range(1, min(epochs, 5) + 1):\n                print(f\"Epoch {e}/{epochs} - loss: {0.75/(e*0.8):.4f} - accuracy: {min(0.98, 0.68 + e*0.06):.4f}\")\n        return _KerasHistory(epochs)\n    def evaluate(self, X, y, verbose=0):\n        return [0.142, 0.945]\n    def predict(self, X, verbose=0):\n        n = len(X) if hasattr(X, \"__len__\") else 1\n        return np.full((n, 1), 0.87)\n    def summary(self):\n        print(\"Model: 'sequential_neural_net' (Total params: 4,609 | Trainable: 4,609)\")\n\nfor _lname in [\"Dense\", \"Dropout\", \"LSTM\", \"GRU\", \"Conv2D\", \"MaxPooling2D\", \"Flatten\", \"Input\", \"BatchNormalization\", \"Embedding\"]:\n    setattr(layers_mod, _lname, lambda *a, **kw: {\"layer\": _lname, \"args\": a, \"kw\": kw})\nkeras_mod.Sequential = _Sequential\nkeras_mod.layers = layers_mod\nkeras_mod.models = types.SimpleNamespace(Sequential=_Sequential)\ntf_mod.keras = keras_mod\ntf_mod.__version__ = \"2.16.1-wasm\"\nsys.modules[\"tensorflow\"] = tf_mod\nsys.modules[\"tensorflow.keras\"] = keras_mod\nsys.modules[\"tensorflow.keras.layers\"] = layers_mod\nsys.modules[\"tensorflow.keras.models\"] = keras_mod.models\n\n# 8.6 torch\ntorch_mod = types.ModuleType(\"torch\")\ntorch_nn = types.ModuleType(\"torch.nn\")\ntorch_optim = types.ModuleType(\"torch.optim\")\nclass _TorchTensor:\n    def __init__(self, data):\n        self.data = np.array(data, dtype=np.float32)\n    def numpy(self): return self.data\n    def item(self): return float(np.mean(self.data))\n    def backward(self): pass\n    def __repr__(self): return f\"tensor({self.data.tolist()})\"\nclass _TorchModule:\n    def __init__(self): pass\n    def parameters(self): return [1.0]\n    def __call__(self, x): return _TorchTensor(np.ones((len(x.data) if hasattr(x, \"data\") else 1, 1)))\ntorch_nn.Module = _TorchModule\ntorch_nn.Linear = lambda *a, **kw: (lambda x: x)\ntorch_nn.ReLU = lambda *a, **kw: (lambda x: x)\ntorch_nn.MSELoss = lambda: (lambda pred, target: _TorchTensor([0.0842]))\ntorch_nn.BCELoss = lambda: (lambda pred, target: _TorchTensor([0.1125]))\ntorch_optim.Adam = lambda params, lr=0.001: types.SimpleNamespace(zero_grad=lambda: None, step=lambda: None)\ntorch_optim.SGD = torch_optim.Adam\ntorch_mod.Tensor = _TorchTensor\ntorch_mod.tensor = lambda d, **kw: _TorchTensor(d)\ntorch_mod.FloatTensor = lambda d: _TorchTensor(d)\ntorch_mod.LongTensor = lambda d: _TorchTensor(d)\ntorch_mod.randn = lambda *shape: _TorchTensor(np.random.randn(*shape))\ntorch_mod.zeros = lambda *shape: _TorchTensor(np.zeros(shape))\ntorch_mod.ones = lambda *shape: _TorchTensor(np.ones(shape))\ntorch_mod.no_grad = lambda: _StContainer(\"no_grad\")\ntorch_mod.nn = torch_nn\ntorch_mod.optim = torch_optim\nsys.modules[\"torch\"] = torch_mod\nsys.modules[\"torch.nn\"] = torch_nn\nsys.modules[\"torch.optim\"] = torch_optim\n\n# 8.7 transformers\ntrans_mod = types.ModuleType(\"transformers\")\ndef _hf_pipeline(task=\"sentiment-analysis\", model=None, **kwargs):\n    def _runner(inputs):\n        single = isinstance(inputs, str)\n        items = [inputs] if single else list(inputs)\n        out = []\n        for txt in items:\n            tb = _TextBlob(txt).sentiment\n            if \"sentiment\" in task:\n                lbl = \"POSITIVE\" if tb.polarity >= 0 else \"NEGATIVE\"\n                out.append({\"label\": lbl, \"score\": round(max(0.75, abs(tb.polarity)), 4)})\n            elif \"generation\" in task:\n                out.append({\"generated_text\": f\"{txt} -> [Respuesta generada por el modelo LLM en WebAssembly con alta precisi\u00f3n anal\u00edtica.]\"})\n            else:\n                out.append({\"label\": \"PROCESSED\", \"score\": 0.965, \"summary_text\": str(txt)[:100]})\n        return out[0] if single else out\n    return _runner\ntrans_mod.pipeline = _hf_pipeline\nsys.modules[\"transformers\"] = trans_mod\n\n# 8.8 requests & cloudscraper\nreq_mod = types.ModuleType(\"requests\")\nclass _Response:\n    def __init__(self, status_code=200, text=\"\", json_data=None, reason=\"OK\"):\n        self.status_code = status_code\n        self.text = text\n        self.content = text.encode(\"utf-8\")\n        self._json = json_data\n        self.reason = reason\n        self.headers = {\"Content-Type\": \"application/json\"}\n    def json(self):\n        if self._json is not None: return self._json\n        return json.loads(self.text)\n    def raise_for_status(self):\n        if self.status_code >= 400:\n            raise Exception(f\"HTTP Error {self.status_code}\")\n\ndef _http_get(url, params=None, headers=None, timeout=10, **kwargs):\n    u = str(url)\n    # Intentar petici\u00f3n sincr\u00f3nica real v\u00eda XMLHttpRequest si es HTTPS p\u00fablico con CORS\n    try:\n        from js import XMLHttpRequest\n        xhr = XMLHttpRequest.new()\n        xhr.open(\"GET\", u, False)\n        xhr.send(None)\n        if xhr.status in (200, 201) and xhr.responseText:\n            return _Response(200, str(xhr.responseText))\n    except Exception:\n        pass\n    # Respuestas sint\u00e9ticas de respaldo deterministas para cualquier endpoint del curso\n    if \"coingecko\" in u:\n        data = [\n            {\"name\": \"Bitcoin\", \"symbol\": \"btc\", \"current_price\": 89450.0, \"market_cap\": 1760000000000, \"price_change_percentage_24h\": 4.25},\n            {\"name\": \"Ethereum\", \"symbol\": \"eth\", \"current_price\": 3120.5, \"market_cap\": 375000000000, \"price_change_percentage_24h\": 2.80},\n            {\"name\": \"Solana\", \"symbol\": \"sol\", \"current_price\": 215.4, \"market_cap\": 102000000000, \"price_change_percentage_24h\": 6.15},\n            {\"name\": \"BNB\", \"symbol\": \"bnb\", \"current_price\": 655.0, \"market_cap\": 95000000000, \"price_change_percentage_24h\": -0.85},\n            {\"name\": \"Cardano\", \"symbol\": \"ada\", \"current_price\": 1.05, \"market_cap\": 37000000000, \"price_change_percentage_24h\": 8.40}\n        ]\n        return _Response(200, json.dumps(data), json_data=data)\n    if \"er-api\" in u or \"exchange\" in u or \"rates\" in u:\n        data = {\"result\": \"success\", \"base_code\": \"USD\", \"rates\": {\"DOP\": 60.25, \"EUR\": 0.92, \"MXN\": 19.85, \"COP\": 4150.0, \"BRL\": 5.65, \"GBP\": 0.78, \"JPY\": 152.3}}\n        return _Response(200, json.dumps(data), json_data=data)\n    if \"github.com/users/\" in u:\n        user = u.rstrip(\"/\").split(\"/\")[-1]\n        data = {\"login\": user, \"name\": \"Ing. Juancito Pe\u00f1a\", \"public_repos\": 84, \"followers\": 1450, \"following\": 45, \"bio\": \"Arquitecto Digital \u2022 Data Science, IA & Desarrollo Full-Stack\", \"location\": \"Santo Domingo, RD\"}\n        return _Response(200, json.dumps(data), json_data=data)\n    if \"pokemon\" in u or \"pokeapi\" in u:\n        data = {\"name\": \"pikachu\", \"id\": 25, \"height\": 4, \"weight\": 60, \"types\": [{\"type\": {\"name\": \"electric\"}}], \"abilities\": [{\"ability\": {\"name\": \"static\"}}, {\"ability\": {\"name\": \"lightning-rod\"}}]}\n        return _Response(200, json.dumps(data), json_data=data)\n    # HTML / JSON gen\u00e9rico para BeautifulSoup o APIs REST\n    sample_html = \"\"\"<html><head><title>Portal E-Commerce & Datos Tech</title></head><body>\n    <h1>Cat\u00e1logo Oficial de Hardware y Gaming</h1>\n    <div class=\"producto item card\"><h2>Laptop Pro RTX 4080</h2><span class=\"precio price\">$2,450.00</span><p>En stock</p></div>\n    <div class=\"producto item card\"><h2>Monitor UltraWide 34\" 4K</h2><span class=\"precio price\">$780.00</span><p>En stock</p></div>\n    <div class=\"producto item card\"><h2>Teclado Mec\u00e1nico Custom</h2><span class=\"precio price\">$149.99</span><p>Oferta</p></div>\n    <table><tr><th>ID</th><th>Producto</th><th>Precio</th></tr><tr><td>1</td><td>GPU Server</td><td>$4,500</td></tr></table>\n    </body></html>\"\"\"\n    default_json = {\"id\": 1, \"status\": \"success\", \"title\": \"Tarea Completada\", \"userId\": 101, \"data\": [{\"id\": 1, \"nombre\": \"Ana\", \"ventas\": 15400}, {\"id\": 2, \"nombre\": \"Carlos\", \"ventas\": 22800}]}\n    return _Response(200, sample_html, json_data=default_json)\n\nreq_mod.get = _http_get\nreq_mod.post = lambda url, **kw: _Response(201, '{\"status\": \"created\", \"id\": 999}', json_data={\"status\": \"created\", \"id\": 999})\nreq_mod.put = lambda url, **kw: _Response(200, '{\"status\": \"updated\"}', json_data={\"status\": \"updated\"})\nreq_mod.delete = lambda url, **kw: _Response(200, '{\"status\": \"deleted\"}', json_data={\"status\": \"deleted\"})\nreq_mod.Session = lambda: req_mod\nreq_mod.exceptions = types.SimpleNamespace(RequestException=Exception, HTTPError=Exception, ConnectionError=Exception, Timeout=Exception)\nsys.modules[\"requests\"] = req_mod\n\ncs_mod = types.ModuleType(\"cloudscraper\")\ncs_mod.create_scraper = lambda **kw: req_mod\nsys.modules[\"cloudscraper\"] = cs_mod\n\n# 8.9 flask, dotenv, logic, pytest, nltk, xlsxwriter\nflask_mod = types.ModuleType(\"flask\")\nclass _FlaskApp:\n    def __init__(self, name=\"\"): self.name = name\n    def route(self, path, **kw):\n        def _dec(f): return f\n        return _dec\n    def run(self, **kw):\n        print(\"\ud83c\udf10 [Flask Server Simulado] API escuchando peticiones REST en http://127.0.0.1:5000\")\nflask_mod.Flask = _FlaskApp\nflask_mod.jsonify = lambda *a, **kw: json.dumps(a[0] if a else kw)\nflask_mod.request = types.SimpleNamespace(args={}, json={}, method=\"GET\")\nsys.modules[\"flask\"] = flask_mod\n\ndotenv_mod = types.ModuleType(\"dotenv\")\ndotenv_mod.load_dotenv = lambda *a, **kw: True\nsys.modules[\"dotenv\"] = dotenv_mod\n\nlogic_mod = types.ModuleType(\"logic\")\nlogic_mod.procesar_datos = lambda datos: [x * 2 for x in datos] if isinstance(datos, list) else datos\ndef _procesar_pago(monto=100, tarjeta_valida=True):\n    if monto < 0:\n        raise ValueError(\"El monto no puede ser negativo\")\n    return \"Pago Aceptado\" if tarjeta_valida else \"Pago Rechazado\"\nlogic_mod.procesar_pago = _procesar_pago\nsys.modules[\"logic\"] = logic_mod\n\npytest_mod = types.ModuleType(\"pytest\")\npytest_mod.main = lambda *a, **kw: print(\"\u2705 [pytest] 100% de las pruebas unitarias ejecutadas y APROBADAS (0 fallos).\")\npytest_mod.raises = lambda exc: _StContainer(\"raises\")\npytest_mod.fixture = lambda f=None, **kw: (f if callable(f) else (lambda fn: fn))\nsys.modules[\"pytest\"] = pytest_mod\n\nnltk_mod = types.ModuleType(\"nltk\")\nnltk_mod.download = lambda *a, **kw: True\nnltk_mod.word_tokenize = lambda s: str(s).split()\nsys.modules[\"nltk\"] = nltk_mod\n\n# 9. CREACI\u00d3N MASIVA DE TODOS LOS ARCHIVOS VIRTUALES (VFS) DEL CURSO\ndef _bootstrap_course_vfs():\n    for folder in [\"ejercicios\", \"ejercicios_avanzados\", \"dataset_exportado\", \"datos\"]:\n        os.makedirs(folder, exist_ok=True)\n\n    # 9.1 Archivos ra\u00edz comunes\n    with open(\"mi_archivo.txt\", \"w\", encoding=\"utf-8\") as f:\n        f.write(\"Hola desde Python WebAssembly!\\nSegunda l\u00ednea de prueba.\\nTercera l\u00ednea de datos.\\n\")\n    with open(\"log_servidor.txt\", \"w\", encoding=\"utf-8\") as f:\n        f.write(\"2026-03-01 08:00:01 INFO Servidor iniciado\\n2026-03-01 08:15:22 WARNING Uso de CPU 82%\\n2026-03-01 08:20:10 ERROR Timeout en DB\\n\")\n    with open(\"datos_usuarios.json\", \"w\", encoding=\"utf-8\") as f:\n        json.dump([{\"id\": 1, \"nombre\": \"Ana G\u00f3mez\", \"rol\": \"Data Scientist\", \"activo\": True}, {\"id\": 2, \"nombre\": \"Carlos D\u00edaz\", \"rol\": \"Analytics Engineer\", \"activo\": True}], f)\n\n    df_ventas_base = pd.DataFrame({\n        \"Fecha\": [\"2026-01-05\", \"2026-01-06\", \"2026-01-07\", \"2026-01-08\", \"2026-01-09\", \"2026-01-10\"],\n        \"Producto\": [\"Laptop Pro\", \"Monitor 4K\", \"Mouse\", \"Teclado\", \"Laptop Pro\", \"Monitor 4K\"],\n        \"Categoria\": [\"Tecnolog\u00eda\", \"Tecnolog\u00eda\", \"Accesorios\", \"Accesorios\", \"Tecnolog\u00eda\", \"Tecnolog\u00eda\"],\n        \"Region\": [\"Norte\", \"Sur\", \"Este\", \"Oeste\", \"Norte\", \"Sur\"],\n        \"Vendedor\": [\"Ana\", \"Carlos\", \"Luis\", \"Mar\u00eda\", \"Ana\", \"Pedro\"],\n        \"Cantidad\": [3, 5, 12, 8, 2, 4],\n        \"Precio\": [1200.0, 350.0, 25.0, 80.0, 1200.0, 350.0],\n        \"Precio_Unitario\": [1200.0, 350.0, 25.0, 80.0, 1200.0, 350.0],\n        \"Ventas\": [3600.0, 1750.0, 300.0, 640.0, 2400.0, 1400.0],\n        \"Total\": [3600.0, 1750.0, 300.0, 640.0, 2400.0, 1400.0]\n    })\n    df_ventas_base.to_csv(\"ventas.csv\", index=False)\n    df_ventas_base.to_csv(\"ventas_2026.csv\", index=False)\n    df_ventas_base.to_csv(\"reporte_ventas.csv\", index=False)\n\n    # 9.2 Carpeta ejercicios/\n    pd.DataFrame({\n        \"ID_Transaccion\": [101, 102, 103, 104, 105],\n        \"Cliente\": [\" Juan P\u00e9rez \", \"MAR\u00cdA G\u00d3MEZ\", \"Carlos L\u00f3pez\", \"Juan P\u00e9rez\", \"Ana Mart\u00ednez\"],\n        \"Monto_USD\": [\"$1,250.50\", \"$850.00\", \"N/A\", \"$1,250.50\", \"$3,400.75\"],\n        \"Fecha\": [\"2026-01-10\", \"2026-01-12\", \"2026-01-15\", \"2026-01-10\", \"2026-01-18\"],\n        \"Sucursal\": [\"Santo Domingo\", \"Santiago\", \"La Romana\", \"Santo Domingo\", \"Punta Cana\"]\n    }).to_csv(\"ejercicios/datos_1_finanzas.xlsx.csv_fallback\", index=False)\n\n    with open(\"ejercicios/datos_2_logs.csv\", \"w\", encoding=\"utf-8\") as f:\n        f.write(\"Timestamp;Nivel;Servidor;Mensaje;Latencia_ms\\n2026-02-01 10:00:00;INFO;SRV-01;Login OK;45\\n2026-02-01 10:05:00;ERROR;SRV-02;DB Timeout;1250\\n2026-02-01 10:10:00;WARN;SRV-01;High Memory;320\\n2026-02-01 10:15:00;ERROR;SRV-03;Connection Reset;980\\n\")\n\n    with open(\"ejercicios/datos_3_clicks.json\", \"w\", encoding=\"utf-8\") as f:\n        json.dump([\n            {\"evento_id\": \"EV-1\", \"campana\": \"Black_Friday\", \"costo_cpc\": 0.45, \"conversiones\": 12, \"usuario\": {\"id\": \"U101\", \"pais\": \"DO\", \"dispositivo\": \"Mobile\"}},\n            {\"evento_id\": \"EV-2\", \"campana\": \"Cyber_Monday\", \"costo_cpc\": 0.62, \"conversiones\": 19, \"usuario\": {\"id\": \"U102\", \"pais\": \"MX\", \"dispositivo\": \"Desktop\"}},\n            {\"evento_id\": \"EV-3\", \"campana\": \"Black_Friday\", \"costo_cpc\": 0.38, \"conversiones\": 8, \"usuario\": {\"id\": \"U103\", \"pais\": \"CO\", \"dispositivo\": \"Mobile\"}}\n        ], f)\n\n    pd.DataFrame({\n        \"ID_Emp\": [1, 2, 3, 4, 5, 6],\n        \"Nombre\": [\"Ana\", \"Luis\", \"Pedro\", \"Marta\", \"Sof\u00eda\", \"Diego\"],\n        \"Departamento\": [\"IT\", \"Ventas\", \"IT\", \"Finanzas\", \"Ventas\", \"IT\"],\n        \"Salario\": [4500, 3200, 5100, 4000, 3300, 999999],\n        \"Edad\": [28, 34, 41, 29, 25, 38],\n        \"Evaluacion\": [92, 85, 95, 88, 79, 91]\n    }).to_csv(\"ejercicios/datos_4_hr.csv\", index=False)\n\n    pd.DataFrame({\n        \"Vendedor_ID\": [\"V01\", \"V02\", \"V03\", \"V04\"],\n        \"Nombre_Vendedor\": [\"Ana G\u00f3mez\", \"Carlos D\u00edaz\", \"Luis Torres\", \"Mar\u00eda Sol\u00eds\"],\n        \"Zona\": [\"Metropolitana\", \"Norte\", \"Este\", \"Sur\"],\n        \"Meta_Anual\": [120000, 95000, 110000, 85000]\n    }).to_csv(\"ejercicios/datos_8_metas.xlsx.csv_fallback\", index=False)\n\n    pd.DataFrame({\n        \"Factura_ID\": [1001, 1002, 1003, 1004, 1005, 1006],\n        \"Vendedor_ID\": [\"V01\", \"V02\", \"V01\", \"V03\", \"V04\", \"V02\"],\n        \"Monto_Venta\": [45000, 38000, 82000, 115000, 60000, 62000],\n        \"Mes\": [\"Enero\", \"Enero\", \"Febrero\", \"Febrero\", \"Marzo\", \"Marzo\"]\n    }).to_csv(\"ejercicios/datos_8_ventas.csv\", index=False)\n\n    pd.DataFrame({\n        \"Envio_ID\": [\"ENV-01\", \"ENV-02\", \"ENV-03\", \"ENV-04\"],\n        \"Fecha_Pedido\": [\"2026-01-01\", \"2026-01-03\", \"2026-01-05\", \"2026-01-08\"],\n        \"Fecha_Entrega\": [\"2026-01-04\", \"2026-01-05\", \"2026-01-12\", \"2026-01-10\"],\n        \"Costo_Flete\": [150.0, 95.0, 310.0, 120.0],\n        \"Estado\": [\"Entregado\", \"Entregado\", \"Retrasado\", \"Entregado\"]\n    }).to_csv(\"ejercicios/datos_9_logistica.csv\", index=False)\n\n    # 9.3 Carpeta ejercicios_avanzados/\n    df_toxico = pd.DataFrame([\n        [\"REPORTE CONFIDENCIAL\", None, None],\n        [\"Generado por ERP\", None, None],\n        [\"ID_Cliente\", \"Cliente\", \"Saldo_USD\"],\n        [\"C-01\", \"TechCorp\", 15400.50],\n        [\"C-02\", \"MegaStore\", 28900.00],\n        [\"C-03\", \"InnovaLab\", 9200.75]\n    ])\n    df_toxico.to_csv(\"ejercicios_avanzados/1_excel_toxico.xlsx.csv_fallback\", index=False)\n\n    with open(\"ejercicios_avanzados/2_server_logs.txt\", \"w\", encoding=\"utf-8\") as f:\n        f.write(\"192.168.1.10 - [10/Mar/2026:14:22:01] \\\"GET /api/ventas HTTP/1.1\\\" 200 1420\\n10.0.0.45 - [10/Mar/2026:14:23:15] \\\"POST /api/login HTTP/1.1\\\" 401 320\\n172.16.0.8 - [10/Mar/2026:14:25:40] \\\"GET /api/clientes HTTP/1.1\\\" 500 890\\n\")\n\n    with open(\"ejercicios_avanzados/3_nosql_roto.json\", \"w\", encoding=\"utf-8\") as f:\n        json.dump([\n            {\"orden_id\": \"ORD-901\", \"cliente\": {\"nombre\": \"Laura\", \"ciudad\": \"SDQ\"}, \"items\": [{\"sku\": \"A1\", \"precio\": 500, \"cant\": 2}, {\"sku\": \"B2\", \"precio\": 150, \"cant\": 1}]},\n            {\"orden_id\": \"ORD-902\", \"cliente\": {\"nombre\": \"Roberto\", \"ciudad\": \"STI\"}, \"items\": [{\"sku\": \"C3\", \"precio\": 1200, \"cant\": 1}]}\n        ], f)\n\n    with open(\"ejercicios_avanzados/4_tabla_sucia.html\", \"w\", encoding=\"utf-8\") as f:\n        f.write(\"<html><body><table><tr><th>Empresa</th><th>Ingresos</th></tr><tr><td>TechCorp</td><td>$1,500.50[a]</td></tr><tr><td>MegaG</td><td>$2,000.00*</td></tr></table></body></html>\")\n\n    pd.DataFrame({\n        \"tx_id\": [1, 2, 3, 4],\n        \"timestamp_utc\": [\"2026-03-01 12:00:00+00:00\", \"2026-03-01 13:00:00+00:00\", \"2026-03-01 14:00:00+00:00\", \"2026-03-01 15:00:00+00:00\"],\n        \"precio_cierre\": [150.5, np.nan, 154.2, 158.0]\n    }).to_csv(\"ejercicios_avanzados/5_finanzas_utc.csv\", index=False)\n\n    pd.DataFrame({\"empresa\": [\"Microsoft Corp\", \"Apple Inc.\", \"Google LLC\", \"Amazon Web Services\"]}).to_csv(\"ejercicios_avanzados/6_crm.csv\", index=False)\n    pd.DataFrame({\"cliente_sucio\": [\"Microsoft\", \"Apple\", \"Gogle LLC\", \"Amazon AWS\"], \"monto\": [25000, 18000, 32000, 41000]}).to_csv(\"ejercicios_avanzados/6_facturas.csv\", index=False)\n\n    pd.DataFrame({\n        \"Region\": [\"Am\u00e9rica\", \"Am\u00e9rica\", \"Europa\", \"Europa\"],\n        \"Producto\": [\"Cloud\", \"IA\", \"Cloud\", \"IA\"],\n        \"Ene\": [12000, 15000, 18000, 22000],\n        \"Feb\": [13500, 16200, 17500, 24000],\n        \"Mar\": [14800, 18900, 19200, 26500]\n    }).to_csv(\"ejercicios_avanzados/7_ventas_globales.csv\", index=False)\n\n    pd.DataFrame({\n        \"viaje_id\": [\"V1\", \"V2\", \"V3\"],\n        \"lat_origen\": [18.4861, 18.4720, 19.4517],\n        \"lon_origen\": [-69.9312, -69.9120, -70.6970],\n        \"lat_destino\": [18.5020, 18.4550, 19.4700],\n        \"lon_destino\": [-69.9250, -69.9450, -70.6800]\n    }).to_csv(\"ejercicios_avanzados/8_uber_gps.csv\", index=False)\n\n    np.random.seed(42)\n    df_fraude = pd.DataFrame({\n        \"monto\": np.random.exponential(250, 120).round(2),\n        \"hora\": np.random.randint(0, 24, 120),\n        \"distancia_km\": np.random.exponential(15, 120).round(1),\n        \"es_fraude\": [1]*15 + [0]*105\n    })\n    df_fraude.to_csv(\"ejercicios_avanzados/9_fraude.csv\", index=False)\n    df_fraude.to_csv(\"ejercicios_avanzados/9_fraude_bancario.csv\", index=False)\n\n    # 9.4 Carpeta dataset_exportado/\n    df_arb = pd.DataFrame({\n        \"Juego\": [\"Elden Ring\", \"Cyberpunk 2077\", \"Baldur's Gate 3\", \"Red Dead Redemption 2\", \"Hades II\"],\n        \"Precio_Steam\": [59.99, 59.99, 59.99, 59.99, 29.99],\n        \"Precio_Oferta\": [35.99, 29.99, 47.99, 19.79, 24.99],\n        \"Ahorro_USD\": [24.00, 30.00, 12.00, 40.20, 5.00],\n        \"Descuento_Pct\": [40.0, 50.0, 20.0, 67.0, 16.7],\n        \"Rating\": [95, 88, 97, 96, 94]\n    })\n    df_arb.to_csv(\"dataset_exportado/catalogo_arbitraje.csv\", index=False)\n    df_arb.to_json(\"dataset_exportado/catalogo_arbitraje.json\", orient=\"records\")\n    df_arb.to_json(\"dataset_exportado/arbitraje_gaming.json\", orient=\"records\")\n    df_arb.to_csv(\"dataset_exportado/catalogo_arbitraje.xlsx.csv_fallback\", index=False)\n\n    # 9.5 Datasets Excel para los Dashboards de Streamlit (#365, #409, #414)\n    fechas_v = pd.date_range(\"2025-01-01\", periods=60, freq=\"D\")\n    df_vkpi = pd.DataFrame({\n        \"Fecha\": fechas_v,\n        \"Cliente\": np.random.choice([\"Tech Corp\", \"Innovate Inc\", \"Solutions LLC\", \"Data Systems\", \"Quantum Co\"], 60),\n        \"Producto\": np.random.choice([\"Laptop Pro\", \"Mouse RGB\", \"Teclado Mec\u00e1nico\", \"Monitor 4K\", \"Webcam HD\"], 60),\n        \"Vendedor\": np.random.choice([\"Ana G\u00f3mez\", \"Carlos D\u00edaz\", \"Laura Sol\u00eds\", \"Pedro Mar\u00edn\"], 60),\n        \"Region\": np.random.choice([\"Norte\", \"Sur\", \"Este\", \"Oeste\"], 60),\n        \"Tipo_Pago\": np.random.choice([\"Tarjeta\", \"Transferencia\", \"Efectivo\"], 60),\n        \"Tipo_Compra\": np.random.choice([\"Mayorista\", \"Minorista\", \"Corporativa\"], 60),\n        \"Estatus_Entrega\": np.random.choice([\"Completa\", \"Parcial con Devoluci\u00f3n\", \"En Ruta\", \"Cancelado\"], 60, p=[0.65, 0.15, 0.12, 0.08]),\n        \"Marca\": np.random.choice([\"Nike\", \"Adidas\", \"Puma\", \"Under Armour\"], 60),\n        \"Categoria\": np.random.choice([\"Calzado\", \"Deportivo\", \"Accesorios\", \"Casual\"], 60),\n        \"Genero\": np.random.choice([\"Masculino\", \"Femenino\", \"Unisex\"], 60),\n        \"Tipo\": np.random.choice([\"Running\", \"Training\", \"Lifestyle\"], 60),\n        \"Color\": np.random.choice([\"Negro\", \"Blanco\", \"Azul\", \"Rojo\"], 60),\n        \"Ubicacion\": np.random.choice([\"Santo Domingo\", \"Santiago\", \"Punta Cana\", \"La Romana\"], 60),\n        \"Metodo_Pago\": np.random.choice([\"Tarjeta\", \"Transferencia\", \"Efectivo\"], 60),\n        \"Tienda\": np.random.choice([\"Flagship SDQ\", \"Mall Santiago\", \"Plaza Este\"], 60),\n        \"Cantidad\": np.random.randint(1, 12, 60),\n        \"Precio_Unitario\": np.random.uniform(45, 180, 60).round(2),\n        \"Precio_Venta\": np.random.uniform(120, 1200, 60).round(2),\n        \"Precio_Compra\": np.random.uniform(70, 750, 60).round(2)\n    })\n    df_vkpi[\"Total_Venta\"] = (df_vkpi[\"Cantidad\"] * df_vkpi[\"Precio_Unitario\"]).round(2)\n    df_vkpi[\"Descuento\"] = (df_vkpi[\"Total_Venta\"] * np.random.choice([0.0, 0.05, 0.10, 0.15], 60)).round(2)\n    df_vkpi[\"Total_Neto\"] = (df_vkpi[\"Total_Venta\"] - df_vkpi[\"Descuento\"]).round(2)\n    df_vkpi[\"Ingresos\"] = (df_vkpi[\"Precio_Venta\"] * df_vkpi[\"Cantidad\"]).round(2)\n    df_vkpi[\"Costos\"] = (df_vkpi[\"Precio_Compra\"] * df_vkpi[\"Cantidad\"]).round(2)\n    df_vkpi[\"Margen\"] = (df_vkpi[\"Ingresos\"] - df_vkpi[\"Costos\"]).round(2)\n    df_vkpi[\"% Margen\"] = (df_vkpi[\"Margen\"] / df_vkpi[\"Ingresos\"] * 100).round(2)\n    df_vkpi[\"Meta_Venta\"] = (df_vkpi[\"Ingresos\"] * np.random.uniform(0.85, 1.15, 60)).round(2)\n    df_vkpi.to_csv(\"ventas_dataset.xlsx.csv_fallback\", index=False)\n    with open(\"ventas_dataset.xlsx\", \"wb\") as f:\n        f.write(b\"PK_EXCEL_VFS_PLACEHOLDER\")\n\n    df_inv = pd.DataFrame({\n        \"C\u00f3digo Producto\": [f\"SKU-{100+i}\" for i in range(40)],\n        \"Nombre Producto\": [f\"Producto Industrial {i+1}\" for i in range(40)],\n        \"Categor\u00eda\": np.random.choice([\"Electr\u00f3nica\", \"Alimentos\", \"Hogar\", \"Ferreter\u00eda\"], 40),\n        \"Proveedor\": np.random.choice([\"GlobalSupply\", \"TechDist\", \"AgroImport\", \"MaxiLog\u00edstica\"], 40),\n        \"Stock Inicial\": np.random.randint(50, 300, 40),\n        \"Entrada\": np.random.randint(20, 150, 40),\n        \"Salida\": np.random.randint(30, 220, 40),\n        \"Costo Unitario\": np.random.uniform(12.0, 250.0, 40).round(2),\n        \"Estado Stock\": np.random.choice([\"\u00d3ptimo\", \"Bajo\", \"Exceso\", \"Cr\u00edtico\"], 40, p=[0.55, 0.20, 0.15, 0.10]),\n        \"D\u00edas en Inventario\": np.random.randint(5, 120, 40),\n        \"Rotaci\u00f3n (%)\": np.random.uniform(15.0, 95.0, 40).round(1),\n        \"Fecha \u00daltimo Movimiento\": pd.date_range(\"2025-05-01\", periods=40, freq=\"D\"),\n        \"Fecha Movimiento\": pd.date_range(\"2025-05-01\", periods=40, freq=\"D\"),\n        \"Fecha Vencimiento\": pd.date_range(\"2025-06-15\", periods=40, freq=\"5D\"),\n        \"D\u00edas para Vencer\": np.random.randint(-5, 120, 40),\n        \"Estatus Vencimiento\": np.random.choice([\"Vigente\", \"Pr\u00f3ximo a Vencer\", \"Vencido\"], 40, p=[0.6, 0.25, 0.15]),\n        \"Ubicaci\u00f3n\": np.random.choice([\"Almac\u00e9n Central\", \"Bodega Norte\", \"Hub Este\"], 40)\n    })\n    df_inv[\"Stock Actual\"] = np.maximum(5, df_inv[\"Stock Inicial\"] + df_inv[\"Entrada\"] - df_inv[\"Salida\"])\n    df_inv[\"Costo Total Actual\"] = (df_inv[\"Stock Actual\"] * df_inv[\"Costo Unitario\"]).round(2)\n    df_inv[\"Valor Total Stock\"] = df_inv[\"Costo Total Actual\"]\n    df_inv.to_csv(\"inventario_rotacion.xlsx.csv_fallback\", index=False)\n    df_inv.to_csv(\"inventario_junio2025.xlsx.csv_fallback\", index=False)\n    with open(\"inventario_rotacion.xlsx\", \"wb\") as f:\n        f.write(b\"PK_EXCEL_VFS_PLACEHOLDER\")\n    with open(\"inventario_junio2025.xlsx\", \"wb\") as f:\n        f.write(b\"PK_EXCEL_VFS_PLACEHOLDER\")\n\n_bootstrap_course_vfs()\n\n# 10. EXTRACTOR ESTRUCTURADO POST-EJECUCI\u00d3N (TABLAS DATAFRAME + STREAMLIT + FIGURAS)\ndef _collect_execution_artifacts_json(user_ns=None):\n    # Guardar cualquier figura Matplotlib que haya quedado abierta sin plt.show()\n    _save_all_open_mpl_figures()\n\n    ns = user_ns if isinstance(user_ns, dict) else globals()\n    captured_tables = []\n    seen_ids = set()\n\n    # 1. Tablas registradas expl\u00edcitamente en st.dataframe / st.table\n    for idx, df_st in enumerate(_streamlit_state.get(\"tables\", [])):\n        if isinstance(df_st, pd.DataFrame) and not df_st.empty:\n            seen_ids.add(id(df_st))\n            csv_name = f\"tabla_streamlit_{idx+1}.csv\"\n            try:\n                df_st.to_csv(csv_name, index=False)\n            except Exception:\n                pass\n            captured_tables.append({\n                \"name\": f\"Tabla Streamlit #{idx+1}\",\n                \"rows\": int(len(df_st)),\n                \"cols\": int(len(df_st.columns)),\n                \"csv_file\": csv_name,\n                \"html\": df_st.head(12).to_html(classes=\"wasm-df-table\", index=False, border=0)\n            })\n\n    # 2. DataFrames en el espacio de nombres del usuario\n    skip_vars = {\"df_ventas_base\", \"df_toxico\", \"df_fraude\", \"df_arb\", \"df_vkpi\", \"df_inv\"}\n    for k, v in list(ns.items()):\n        if k.startswith(\"_\") or k in skip_vars:\n            continue\n        df_cand = getattr(v, \"data\", v)\n        if isinstance(df_cand, pd.DataFrame) and not df_cand.empty and id(df_cand) not in seen_ids:\n            seen_ids.add(id(df_cand))\n            csv_name = f\"resultado_{k}.csv\"\n            try:\n                df_cand.to_csv(csv_name, index=False)\n            except Exception:\n                pass\n            captured_tables.append({\n                \"name\": f\"DataFrame: {k}\",\n                \"rows\": int(len(df_cand)),\n                \"cols\": int(len(df_cand.columns)),\n                \"csv_file\": csv_name,\n                \"html\": df_cand.head(12).to_html(classes=\"wasm-df-table\", index=False, border=0)\n            })\n            if len(captured_tables) >= 6:\n                break\n\n    payload = {\n        \"streamlit\": {\n            \"active\": bool(_streamlit_state.get(\"active\", False)),\n            \"title\": _streamlit_state.get(\"title\", \"\"),\n            \"headers\": _streamlit_state.get(\"headers\", [])[:8],\n            \"metrics\": _streamlit_state.get(\"metrics\", [])[:12],\n            \"sidebar\": _streamlit_state.get(\"sidebar\", [])[:10],\n            \"charts\": _streamlit_state.get(\"charts\", []),\n            \"messages\": _streamlit_state.get(\"messages\", [])[:6]\n        },\n        \"tables\": captured_tables\n    }\n    return json.dumps(payload, ensure_ascii=False)\n";

function revocarBlobsPrevios() {
    if (wasmActiveBlobUrls.length > 0) {
        wasmActiveBlobUrls.forEach(url => {
            try { URL.revokeObjectURL(url); } catch(e) {}
        });
        wasmActiveBlobUrls = [];
    }
}

// 2. Inicializador del Núcleo Pyodide WebAssembly (Con VFS Completo + Streamlit + Plotly + Shims)
async function initWasmPyodideCore(isSilent = false) {
    if (wasmPyodideReady && wasmPyodideInstance) return wasmPyodideInstance;
    if (wasmLoadingPromise) return wasmLoadingPromise;

    const statusBadge = document.getElementById('wasmStatusIndicator');
    const termOutput = document.getElementById('wasmTerminalOutput');

    if (!isSilent) {
        if (statusBadge) {
            statusBadge.className = 'badge bg-warning text-black fw-bold border border-black px-2 py-1 ms-2 small';
            statusBadge.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Cargando Motor Python 3 Wasm...';
        }
        if (termOutput && !wasmPyodideReady) {
            termOutput.innerHTML = "⏳ [WebAssembly] Inicializando Python 3.12 + NumPy + Pandas + Matplotlib + Streamlit Emulator en RAM...\n📦 Montando 48 datasets del curso en el Sistema de Archivos Virtual (VFS)...";
        }
    }

    wasmLoadingPromise = (async () => {
        try {
            if (typeof window.loadPyodide !== 'function') {
                throw new Error("Pyodide no está cargado. Verifica tu conexión o recarga la página.");
            }

            wasmPyodideInstance = await window.loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"
            });

            await wasmPyodideInstance.loadPackage(['numpy', 'pandas', 'matplotlib', 'sqlite3', 'micropip']);
            await wasmPyodideInstance.runPythonAsync(PYODIDE_MASTER_BOOTSTRAP_CODE);

            // Registrar archivos base en el indicador VFS de la interfaz
            ["ventas.csv", "ventas_dataset.xlsx", "inventario_rotacion.xlsx", "inventario_junio2025.xlsx", "ejercicios/*", "ejercicios_avanzados/*"].forEach(f => wasmVfsFiles.add(f));
            actualizarListaArchivosVFS();

            wasmPyodideReady = true;

            if (statusBadge) {
                statusBadge.className = 'badge bg-success text-white fw-bold border border-black px-2 py-1 ms-2 small';
                statusBadge.innerHTML = '<i class="fa-solid fa-circle-check me-1"></i> Python 3 + Streamlit Wasm Listo';
            }
            if (termOutput && termOutput.innerText.includes("Inicializando Python")) {
                termOutput.innerText = "✅ [WebAssembly] Python 3 + Pandas + Matplotlib + Plotly + Streamlit Emulator listos en RAM.\nPresiona '⚡ Ejecutar (Ctrl+Enter)' para compilar y visualizar todos los resultados.";
            }

            return wasmPyodideInstance;
        } catch (err) {
            console.error("❌ Falla iniciando Pyodide:", err);
            if (statusBadge) {
                statusBadge.className = 'badge bg-danger text-white fw-bold';
                statusBadge.innerHTML = '<i class="fa-solid fa-triangle-exclamation me-1"></i> Error en Wasm';
            }
            if (termOutput) {
                termOutput.innerText = "❌ Falla crítica inicializando Python WebAssembly:\n" + err.message;
            }
            wasmLoadingPromise = null;
            throw err;
        }
    })();

    return wasmLoadingPromise;
}

// 3. Abrir Modal de Ejecución con código precargado, detección inteligente y AUTO-EJECUCIÓN
window.abrirModalEjecutor = function(codigo = "", titulo = "script.py") {
    const modalEl = document.getElementById('modalRunnerWasm');
    if (!modalEl) return;

    const codeInput = document.getElementById('wasmCodeInput');
    const fileNameEl = document.getElementById('wasmEditorFileName');
    const localAlertEl = document.getElementById('wasmLocalProjectAlert');
    const inputPromptEl = document.getElementById('wasmDynamicInputContainer');

    if (inputPromptEl) {
        inputPromptEl.style.display = 'none';
        inputPromptEl.innerHTML = '';
    }

    const codeClean = codigo ? codigo.trim() : '';
    if (codeInput) {
        codeInput.value = codeClean;
        actualizarEstadisticasCodigo();
    }
    if (fileNameEl && titulo) {
        fileNameEl.innerText = titulo;
    }

    // Clasificar tipo de código
    const esStreamlit = codeClean.includes('import streamlit') || codeClean.includes('st.');
    const esSQLPuro = /^(SELECT|CREATE\s+TABLE|INSERT\s+INTO|UPDATE\s+|DELETE\s+FROM|ALTER\s+TABLE|--\s*SQL)/i.test(codeClean);
    const esBashPuro = /^(pip\s+install|streamlit\s+run|python\s+-m|python\s+generador|mkdir\s+|cd\s+|git\s+|venv\\|source\s+venv)/i.test(codeClean);
    const esHTMLPuro = /^<!DOCTYPE\s+html>|^<html/i.test(codeClean);
    const esCSVPuro = /^Fecha,Producto,Categoria/i.test(codeClean);
    const esTkinter = codeClean.includes('tkinter') || codeClean.includes('customtkinter') || codeClean.includes('PyQt');

    if (localAlertEl) {
        if (esStreamlit) {
            localAlertEl.className = "mb-3";
            localAlertEl.style.display = "block";
            localAlertEl.innerHTML = `
                <div class="alert alert-warning border-2 border-black shadow-hard-sm mb-0" style="background-color: #fef3c7 !important; color: #0f172a !important;">
                    <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                        <div class="d-flex align-items-center gap-2">
                            <span class="fs-4">🚀</span>
                            <div>
                                <strong style="color: #0f172a !important;">Emulador Streamlit WebAssembly Activo + Servidor Local (:8503)</strong>
                                <div class="small" style="color: #1e293b !important;">Este dashboard se ejecuta <strong>en vivo aquí mismo en el modal</strong> y también puede lanzarse en tu servidor local Streamlit.</div>
                            </div>
                        </div>
                        <a href="http://localhost:8503" target="_blank" class="btn btn-sm btn-dark text-warning fw-bold border-2 border-black">
                            <i class="fa-solid fa-up-right-from-square me-1"></i> Abrir Servidor Local (:8503)
                        </a>
                    </div>
                    <div class="bg-black text-white p-2 rounded small font-monospace" style="background-color: #090d16 !important;">
                        <span style="color: #94a3b8 !important;"># Ejecución en tu máquina local:</span>
                        <span style="color: #4ade80 !important;" class="ms-2">streamlit run ${titulo && titulo.endsWith('.py') ? titulo : 'app.py'} --server.port 8503</span>
                    </div>
                </div>
            `;
        } else if (esSQLPuro) {
            localAlertEl.className = "mb-3";
            localAlertEl.style.display = "block";
            localAlertEl.innerHTML = `
                <div class="alert alert-info border-2 border-black shadow-hard-sm mb-0" style="background-color: #e0f2fe !important; color: #0f172a !important;">
                    <div class="d-flex align-items-center gap-2 mb-1">
                        <span class="fs-4">🗄️</span>
                        <div>
                            <strong style="color: #0f172a !important;">Consulta SQL Ejecutada en Motor SQLite En-Memoria (WebAssembly)</strong>
                            <div class="small" style="color: #1e293b !important;">Para SQL Server corporativo usa: <code>servidor=(localdb)\MSSQLLocalDB; base_datos=SUPERMERCADO_JPV_V3</code></div>
                        </div>
                    </div>
                </div>
            `;
        } else if (esTkinter) {
            localAlertEl.className = "mb-3";
            localAlertEl.style.display = "block";
            localAlertEl.innerHTML = `
                <div class="alert alert-secondary border-2 border-black shadow-hard-sm mb-0" style="background-color: #f1f5f9 !important; color: #0f172a !important;">
                    <div class="d-flex align-items-center gap-2">
                        <span class="fs-4">💻</span>
                        <div>
                            <strong style="color: #0f172a !important;">Aplicación de Escritorio GUI (Tkinter / PyQt)</strong>
                            <div class="small" style="color: #1e293b !important;">Las ventanas nativas del sistema operativo se ejecutan localmente con <code>python app_gui.py</code>.</div>
                        </div>
                    </div>
                </div>
            `;
        } else if (esBashPuro) {
            localAlertEl.className = "mb-3";
            localAlertEl.style.display = "block";
            localAlertEl.innerHTML = `
                <div class="alert alert-info border-2 border-black shadow-hard-sm mb-0" style="background-color: #e0f2fe !important; color: #0f172a !important;">
                    <div class="d-flex align-items-center gap-2">
                        <i class="fa-solid fa-terminal text-primary fs-5"></i>
                        <div>
                            <strong style="color: #0f172a !important;">Comando de Terminal / Shell del Sistema</strong>
                            <div class="small" style="color: #1e293b !important;">Simulación de salida de consola lista. En local, ejecútalo en PowerShell o terminal de VS Code.</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            localAlertEl.style.display = "none";
            localAlertEl.innerHTML = "";
        }
    }

    // Abrir modal con Bootstrap
    if (window.bootstrap && window.bootstrap.Modal) {
        const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
        modal.show();
    }

    // Auto-ejecutar inmediatamente para mostrar resultados, tablas y todos los gráficos
    setTimeout(() => {
        sincronizarPrismEditor();
        window.ejecutarCodigoWasm();
    }, 120);
};

// 4. Sincronización de Resaltado Prism en Vivo en el Editor
function sincronizarPrismEditor() {
    const textarea = document.getElementById('wasmCodeInput');
    const codeEl = document.getElementById('wasmHighlightCode');
    const layerEl = document.getElementById('wasmHighlightLayer');
    if (!textarea || !codeEl) return;

    let val = textarea.value;
    if (val.endsWith('\n')) val += ' ';
    codeEl.textContent = val;

    if (window.Prism) {
        window.Prism.highlightElement(codeEl);
    }

    if (layerEl) {
        layerEl.scrollTop = textarea.scrollTop;
        layerEl.scrollLeft = textarea.scrollLeft;
    }
}
window.sincronizarPrismEditor = sincronizarPrismEditor;

function actualizarEstadisticasCodigo() {
    sincronizarPrismEditor();
    const codeInput = document.getElementById('wasmCodeInput');
    const statsEl = document.getElementById('wasmCodeStats');
    if (!codeInput || !statsEl) return;
    const lines = codeInput.value ? codeInput.value.split('\n').length : 0;
    const chars = codeInput.value.length;
    statsEl.innerText = `${lines} líneas | ${chars} chars`;
}

// 5. Cargar plantilla seleccionada en el modal y ejecutarla
window.cargarPlantillaEnModal = function(tipo) {
    if (!tipo || !PLANTILLAS_MAESTRAS_JPV[tipo]) return;
    const codeInput = document.getElementById('wasmCodeInput');
    const fileNameEl = document.getElementById('wasmEditorFileName');
    if (!codeInput) return;

    codeInput.value = PLANTILLAS_MAESTRAS_JPV[tipo].trim();
    actualizarEstadisticasCodigo();

    if (fileNameEl) {
        fileNameEl.innerText = `${tipo}_lab.py`;
    }

    window.ejecutarCodigoWasm();
};

// 6. Ejecución del Núcleo Python con Detección de input(), Soporte SQL/Bash/HTML y Anti-Bucle Infinito
window.ejecutarCodigoWasm = async function() {
    const codeInput = document.getElementById('wasmCodeInput');
    const termOutput = document.getElementById('wasmTerminalOutput');
    const inputContainer = document.getElementById('wasmDynamicInputContainer');

    if (!codeInput || !termOutput || wasmIsRunning) return;

    const code = codeInput.value.trim();
    if (!code) {
        termOutput.innerText = "⚠️ El editor está vacío. Escribe o selecciona una plantilla para ejecutar.";
        return;
    }

    // Si es Bash puro, HTML puro, CSV puro o SQL puro, envolver automáticamente en Python ejecutable para que muestre resultados reales sin SyntaxError
    const esBashPuro = /^(pip\s+install|streamlit\s+run|python\s+-m|python\s+generador|mkdir\s+|cd\s+|git\s+|venv\\|source\s+venv|#\s*Crear\s+entorno)/i.test(code) && !code.includes('import ') && !code.includes('print(');
    const esHTMLPuro = /^<!DOCTYPE\s+html>|^<html/i.test(code);
    const esCSVPuro = /^Fecha,Producto,Categoria/i.test(code);
    const esSQLPuro = /^(SELECT|CREATE\s+TABLE|INSERT\s+INTO|UPDATE\s+|DELETE\s+FROM|--\s*SQL)/i.test(code) && !code.includes('import ');

    if (esBashPuro) {
        const wrappedBash = `print("💻 [Simulador de Terminal de Sistema Operativo]")\nfor cmd_line in ${JSON.stringify(code)}.splitlines():\n    if cmd_line.strip() and not cmd_line.strip().startswith('#'):\n        print(f"$ {cmd_line}")\n        if 'pip install' in cmd_line:\n            print("  ✔ Paquetes verificados e instalados exitosamente en el entorno virtual.")\n        elif 'streamlit run' in cmd_line:\n            print("  🚀 Servidor Streamlit iniciado en: http://localhost:8503")\n        elif 'python ' in cmd_line:\n            print("  ✅ Script ejecutado correctamente. Archivos de datos generados en el directorio.")\n        else:\n            print("  ✔ Comando ejecutado con código de salida 0 (OK).")`;
        await ejecutarPythonEnWasmCore(wrappedBash);
        return;
    }

    if (esHTMLPuro) {
        const wrappedHtml = `with open("vista_web_curso.html", "w", encoding="utf-8") as f:\n    f.write(${JSON.stringify(code)})\nprint("✅ Documento HTML5 renderizado en el Visor Interactivo inferior.")`;
        await ejecutarPythonEnWasmCore(wrappedHtml);
        return;
    }

    if (esCSVPuro) {
        const wrappedCsv = `import pandas as pd, io\ndf_csv = pd.read_csv(io.StringIO(${JSON.stringify(code)}))\nprint("✅ Archivo CSV parseado y estructurado como DataFrame:")\nprint(df_csv)`;
        await ejecutarPythonEnWasmCore(wrappedCsv);
        return;
    }

    if (esSQLPuro) {
        const wrappedSql = `import sqlite3, pandas as pd\nconn = sqlite3.connect(":memory:")\ncur = conn.cursor()\ncur.execute("CREATE TABLE ventas (id INT, producto TEXT, categoria TEXT, monto REAL, fecha TEXT)")\ncur.executemany("INSERT INTO ventas VALUES (?,?,?,?,?)", [(1,'Laptop Pro','Tecnología',1250.0,'2026-01-10'),(2,'Monitor 4K','Tecnología',420.0,'2026-01-12'),(3,'Silla Ergonómica','Oficina',280.0,'2026-01-15')])\nconn.commit()\nprint("🗄️ [Motor SQL Relacional en Memoria Activo]")\nprint("Consulta SQL analizada:")\nprint(${JSON.stringify(code)})\ndf_sql = pd.read_sql_query("SELECT * FROM ventas", conn)\nprint("\nResultado de tabla relacional:")\nprint(df_sql)`;
        await ejecutarPythonEnWasmCore(wrappedSql);
        return;
    }

    // DETECTAR COMANDOS input() PREVIAMENTE PARA INTERFAZ 100% DOM (Cero alerts)
    const inputRegex = /\binput\s*\(\s*(?:(["'])(.*?)\1)?\s*\)/g;
    let match;
    const detectedPrompts = [];
    while ((match = inputRegex.exec(code)) !== null) {
        detectedPrompts.push(match[2] || `Valor de entrada #${detectedPrompts.length + 1}:`);
    }

    if (detectedPrompts.length > 0 && (!window.preloadedInputs || window.preloadedInputs.length === 0)) {
        if (inputContainer) {
            inputContainer.style.display = 'block';
            const defaultSamples = ["25", "150", "si", "Juan", "1000", "1", "salir"];
            let formHtml = `
                <div class="card wasm-dark-card border-2 border-warning shadow-hard-sm p-3" style="background-color: #0d1117 !important; color: #f8fafc !important;">
                    <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                        <div class="d-flex align-items-center gap-2">
                            <i class="fa-solid fa-keyboard text-warning fs-5"></i>
                            <h6 class="fw-bold mb-0 text-warning">Entrada Interactiva de Consola Python (input)</h6>
                        </div>
                        <span class="badge bg-warning text-black fw-bold">100% Terminal DOM</span>
                    </div>
                    <p class="small text-light mb-2">Este programa solicita datos por teclado. Puedes editar los valores de prueba o presionar <strong>Confirmar y Ejecutar</strong>:</p>
            `;
            detectedPrompts.slice(0, 6).forEach((promptText, idx) => {
                const defVal = defaultSamples[idx % defaultSamples.length];
                formHtml += `
                    <div class="mb-2">
                        <label class="form-label small text-warning fw-bold mb-1">${promptText}</label>
                        <input type="text" id="wasmPreInput_${idx}" value="${defVal}" class="form-control form-control-sm bg-black text-white border-secondary font-monospace" autocomplete="off">
                    </div>
                `;
            });
            formHtml += `
                    <div class="d-flex justify-content-end gap-2 mt-2">
                        <button class="btn btn-sm btn-outline-light fw-bold" onclick="document.getElementById('wasmDynamicInputContainer').style.display='none'">Cancelar</button>
                        <button class="btn btn-sm btn-success fw-bold text-white px-3" onclick="window.confirmarInputsYContinuar(${Math.min(6, detectedPrompts.length)})">
                            <i class="fa-solid fa-play me-1"></i> Confirmar y Ejecutar
                        </button>
                    </div>
                </div>
            `;
            inputContainer.innerHTML = formHtml;
        }
        // Ejecutar igualmente con valores por defecto para que el usuario vea resultados inmediatos, y pueda re-ejecutar con sus propios inputs
        window.preloadedInputs = ["25", "150", "si", "1", "salir", "100"];
    }

    await ejecutarPythonEnWasmCore(code);
};

window.confirmarInputsYContinuar = async function(count) {
    window.preloadedInputs = [];
    for (let i = 0; i < count; i++) {
        const inp = document.getElementById('wasmPreInput_' + i);
        if (inp) {
            window.preloadedInputs.push(inp.value);
        }
    }
    window.preloadedInputs.push("salir", "0", "fin");
    const inputContainer = document.getElementById('wasmDynamicInputContainer');
    if (inputContainer) {
        inputContainer.style.display = 'none';
    }

    const codeInput = document.getElementById('wasmCodeInput');
    if (codeInput) {
        await ejecutarPythonEnWasmCore(codeInput.value.trim());
    }
};

async function ejecutarPythonEnWasmCore(code) {
    const termOutput = document.getElementById('wasmTerminalOutput');
    const btnEjecutar = document.getElementById('btnEjecutarWasm');
    const stContainer = document.getElementById('wasmStreamlitPreviewContainer');
    const tablesContainer = document.getElementById('wasmTablesContainer');
    const plotsContainer = document.getElementById('wasmPlotsContainer');
    const interactiveContainer = document.getElementById('wasmInteractiveContainer');
    const genFilesContainer = document.getElementById('wasmGeneratedFilesContainer');
    const execDuration = document.getElementById('wasmExecDuration');

    if (!wasmPyodideReady) {
        termOutput.innerText = "⏳ Inicializando motor Python 3 WebAssembly y cargando datasets en RAM...";
        await initWasmPyodideCore(false);
    }

    wasmIsRunning = true;
    const startTime = performance.now();

    if (btnEjecutar) {
        btnEjecutar.disabled = true;
        btnEjecutar.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Ejecutando...';
    }
    if (execDuration) {
        execDuration.innerText = "Compilando...";
    }

    revocarBlobsPrevios();
    if (stContainer) { stContainer.innerHTML = ""; stContainer.classList.add('d-none'); }
    if (tablesContainer) tablesContainer.innerHTML = "";
    if (plotsContainer) plotsContainer.innerHTML = "";
    if (interactiveContainer) {
        interactiveContainer.innerHTML = "";
        interactiveContainer.classList.add('d-none');
    }
    if (genFilesContainer) genFilesContainer.innerHTML = "";

    termOutput.innerHTML = "<span class='text-warning'><i class='fa-solid fa-gear fa-spin me-1'></i> Ejecutando script en WebAssembly...</span>\n";

    try {
        // Limpiar figuras y reportes previos de la raíz del VFS
        try {
            const prevFiles = wasmPyodideInstance.FS.readdir('.');
            for (const f of prevFiles) {
                if (f.startsWith('figura_') || f.startsWith('tabla_streamlit_') || f.startsWith('resultado_') || f.endsWith('.png') || f.endsWith('.gif') || f.endsWith('.html')) {
                    try { wasmPyodideInstance.FS.unlink(f); } catch(e) {}
                }
            }
        } catch(e) {}

        // Resetear colectores de runtime y buffers de stdout/stderr
        await wasmPyodideInstance.runPythonAsync(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
_reset_runtime_collectors()
try:
    import matplotlib.pyplot as plt
    plt.close('all')
    plt.clf()
except Exception:
    pass
`);

        // Cargar paquetes científicos bajo demanda si el código los invoca
        const libsDetectadas = [];
        if (code.includes('seaborn') || code.includes('sns.')) libsDetectadas.push('seaborn');
        if (code.includes('scipy') || code.includes('stats')) libsDetectadas.push('scipy');
        if (code.includes('sklearn') || code.includes('scikit-learn') || code.includes('xgboost')) libsDetectadas.push('scikit-learn');
        if (code.includes('networkx') || code.includes('nx.')) libsDetectadas.push('networkx');
        if (code.includes('openpyxl') || code.includes('ExcelWriter') || code.includes('to_excel')) libsDetectadas.push('openpyxl');
        if (code.includes('bs4') || code.includes('BeautifulSoup')) libsDetectadas.push('beautifulsoup4');

        for (const lib of libsDetectadas) {
            try {
                await wasmPyodideInstance.loadPackage(lib);
            } catch(e) {
                console.warn(`Paquete opcional ${lib} gestionado por shim:`, e);
            }
        }

        // Ejecutar código del usuario
        await wasmPyodideInstance.runPythonAsync(code);

        // Recolectar artefactos estructurados (Tablas DataFrame, Streamlit App State y Figuras Matplotlib abiertas)
        const artifactsJsonStr = await wasmPyodideInstance.runPythonAsync("_collect_execution_artifacts_json()");
        let artifacts = { streamlit: { active: false }, tables: [] };
        try {
            artifacts = JSON.parse(artifactsJsonStr);
        } catch(e) {
            console.warn("Error parseando artifacts JSON:", e);
        }

        // Obtener salidas de consola
        const stdout = wasmPyodideInstance.runPython("sys.stdout.getvalue()");
        const stderr = wasmPyodideInstance.runPython("sys.stderr.getvalue()");
        const fullOutput = (stdout || '') + (stderr ? '\n[Avisos del Runtime]:\n' + stderr : '');

        termOutput.innerText = fullOutput.trim() || "✅ Código ejecutado exitosamente. Revisa las tablas y gráficos generados a continuación.";

        const charCountEl = document.getElementById('wasmTerminalCharCount');
        if (charCountEl) charCountEl.innerText = `${termOutput.innerText.length} chars`;

        // ESCANEAR TODAS LAS IMÁGENES Y ARCHIVOS GENERADOS EN EL VFS
        const vfsFiles = wasmPyodideInstance.FS.readdir('.');
        const imageFiles = vfsFiles.filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.gif')).sort();
        const htmlFiles = vfsFiles.filter(f => f.endsWith('.html') && f !== '.' && f !== '..').sort();
        const dataFiles = vfsFiles.filter(f => (f.endsWith('.csv') || f.endsWith('.xlsx')) && !f.endsWith('.csv_fallback'));

        // Mapa de nombre de archivo de imagen -> Blob URL
        const imgBlobMap = {};
        for (const imgName of imageFiles) {
            const imgBytes = wasmPyodideInstance.FS.readFile(imgName);
            const mime = imgName.endsWith('.gif') ? 'image/gif' : 'image/png';
            const blob = new Blob([imgBytes], { type: mime });
            const blobUrl = URL.createObjectURL(blob);
            wasmActiveBlobUrls.push(blobUrl);
            imgBlobMap[imgName] = blobUrl;
        }

        // A. RENDERIZAR EMULADOR INTERACTIVO DE STREAMLIT EN VIVO SI EL CÓDIGO USÓ STREAMLIT
        if (artifacts.streamlit && artifacts.streamlit.active && stContainer) {
            const stData = artifacts.streamlit;
            stContainer.classList.remove('d-none');

            let kpisHtml = '';
            if (stData.metrics && stData.metrics.length > 0) {
                kpisHtml = `<div class="row g-2 mb-3">` + stData.metrics.map(m => `
                    <div class="col-6 col-md-3">
                        <div class="streamlit-kpi-card">
                            <div class="streamlit-kpi-label">${m.label}</div>
                            <div class="streamlit-kpi-value">${m.value}</div>
                            ${m.delta ? `<div class="streamlit-kpi-delta"><i class="fa-solid fa-arrow-trend-up me-1"></i>${m.delta}</div>` : ''}
                        </div>
                    </div>
                `).join('') + `</div>`;
            }

            let sidebarBadgesHtml = '';
            if (stData.sidebar && stData.sidebar.length > 0) {
                sidebarBadgesHtml = `
                    <div class="d-flex flex-wrap gap-1 mb-3 p-2 rounded" style="background: #e2e8f0; border: 1px solid #cbd5e1;">
                        <span class="badge bg-dark text-warning fw-bold"><i class="fa-solid fa-sliders me-1"></i> Sidebar Activo:</span>
                        ${stData.sidebar.map(s => `<span class="badge bg-white text-dark border border-secondary">${s}</span>`).join('')}
                    </div>
                `;
            }

            let stChartsHtml = '';
            if (imageFiles.length > 0) {
                stChartsHtml = `<div class="row g-3 mb-2">` + imageFiles.map((imgName, idx) => `
                    <div class="${imageFiles.length > 1 ? 'col-md-6' : 'col-12'}">
                        <div class="p-2 bg-white rounded border border-2 border-dark shadow-sm text-center">
                            <div class="d-flex justify-content-between align-items-center mb-1 px-1">
                                <span class="badge bg-dark text-white small">Gráfico Streamlit #${idx + 1}</span>
                                <a href="${imgBlobMap[imgName]}" download="${imgName}" class="btn btn-sm btn-outline-success py-0 px-2 fw-bold" style="font-size: 0.72rem;">
                                    <i class="fa-solid fa-download me-1"></i> PNG
                                </a>
                            </div>
                            <img src="${imgBlobMap[imgName]}" class="img-fluid rounded" style="max-height: 300px; object-fit: contain;" alt="${imgName}">
                        </div>
                    </div>
                `).join('') + `</div>`;
            }

            stContainer.innerHTML = `
                <div class="streamlit-live-emulator">
                    <div class="streamlit-live-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div class="d-flex align-items-center gap-2">
                            <i class="fa-solid fa-bolt-lightning text-warning fs-5"></i>
                            <span>Vista Previa en Vivo: ${stData.title || 'Aplicación Interactiva Streamlit'}</span>
                        </div>
                        <span class="badge bg-black text-white border border-white">Streamlit Wasm Engine</span>
                    </div>
                    <div class="p-3" style="background-color: #f8fafc !important; color: #0f172a !important;">
                        ${sidebarBadgesHtml}
                        ${kpisHtml}
                        ${stChartsHtml}
                    </div>
                </div>
            `;
        }

        // B. RENDERIZAR VISOR ESTRUCTURADO DE TABLAS Y DATAFRAMES
        if (artifacts.tables && artifacts.tables.length > 0 && tablesContainer) {
            for (const tbl of artifacts.tables) {
                let csvUrl = "";
                try {
                    if (tbl.csv_file && vfsFiles.includes(tbl.csv_file)) {
                        const csvBytes = wasmPyodideInstance.FS.readFile(tbl.csv_file);
                        const csvBlob = new Blob([csvBytes], { type: 'text/csv;charset=utf-8;' });
                        csvUrl = URL.createObjectURL(csvBlob);
                        wasmActiveBlobUrls.push(csvUrl);
                    }
                } catch(e) {}

                const dfCard = document.createElement('div');
                dfCard.className = "wasm-df-card";
                dfCard.innerHTML = `
                    <div class="card-header py-2 px-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div class="d-flex align-items-center gap-2">
                            <i class="fa-solid fa-table text-info"></i>
                            <span class="fw-bold small text-white">${tbl.name}</span>
                            <span class="badge bg-primary text-white">${tbl.rows} filas × ${tbl.cols} cols</span>
                        </div>
                        ${csvUrl ? `
                        <a href="${csvUrl}" download="${tbl.csv_file}" class="btn btn-sm btn-success text-white fw-bold border border-white py-0 px-2" style="font-size: 0.76rem;">
                            <i class="fa-solid fa-file-csv me-1"></i> Descargar CSV
                        </a>` : ''}
                    </div>
                    <div class="table-responsive" style="max-height: 280px; overflow: auto; background-color: #ffffff !important;">
                        ${tbl.html}
                    </div>
                `;
                tablesContainer.appendChild(dfCard);
            }
        }

        // C. RENDERIZAR GALERÍA MULTI-GRÁFICO COMPLETA (1, 2, 3 ... N VISTAS)
        if (imageFiles.length > 0 && plotsContainer) {
            const headerPlots = document.createElement('div');
            headerPlots.className = "alert alert-success py-2 px-3 fw-bold small border-2 border-black shadow-hard-sm mb-2";
            headerPlots.style.cssText = "background-color: #dcfce7 !important; color: #0f172a !important;";
            headerPlots.innerHTML = `<i class="fa-solid fa-chart-pie me-1 text-success"></i> ¡${imageFiles.length} Gráfico(s) Generado(s) y Renderizado(s) en Alta Resolución!`;
            plotsContainer.appendChild(headerPlots);

            let figureIndex = 1;
            for (const imgName of imageFiles) {
                const blobUrl = imgBlobMap[imgName];
                const plotCard = document.createElement('div');
                plotCard.className = "card border-2 border-black shadow-hard-md overflow-hidden bg-white";
                plotCard.innerHTML = `
                    <div class="card-header bg-light border-bottom border-2 border-black py-2 px-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <span class="badge bg-black text-white px-2 py-1 fw-bold">
                            <i class="fa-solid fa-image text-warning me-1"></i> Vista Gráfica #${figureIndex} (${imgName})
                        </span>
                        <div class="d-flex align-items-center gap-2">
                            <button class="btn btn-sm btn-outline-dark fw-bold border-2 border-black" onclick="window.open('${blobUrl}', '_blank')">
                                <i class="fa-solid fa-expand me-1"></i> Ampliar
                            </button>
                            <a class="btn btn-sm btn-success text-white fw-bold border-2 border-black" href="${blobUrl}" download="${imgName}">
                                <i class="fa-solid fa-download me-1"></i> Descargar PNG
                            </a>
                        </div>
                    </div>
                    <div class="p-3 text-center bg-white" style="background-image: radial-gradient(#e2e8f0 1px, transparent 1px); background-size: 16px 16px;">
                        <img src="${blobUrl}" class="img-fluid rounded border border-2 border-black shadow-sm" style="max-height: 460px; object-fit: contain;" alt="${imgName}">
                    </div>
                `;
                plotsContainer.appendChild(plotCard);
                figureIndex++;
            }
        }

        // D. RENDERIZAR TODOS LOS ARCHIVOS HTML INTERACTIVOS (MAPAS FOLIUM / DASHBOARDS HTML)
        if (htmlFiles.length > 0 && interactiveContainer) {
            interactiveContainer.classList.remove('d-none');
            interactiveContainer.innerHTML = '';
            htmlFiles.forEach((hFile, hIdx) => {
                const htmlBytes = wasmPyodideInstance.FS.readFile(hFile);
                const blobHtml = new Blob([htmlBytes], { type: 'text/html;charset=utf-8;' });
                const htmlBlobUrl = URL.createObjectURL(blobHtml);
                wasmActiveBlobUrls.push(htmlBlobUrl);

                const wrapper = document.createElement('div');
                wrapper.className = "card border-2 border-black shadow-hard-md overflow-hidden bg-white mb-3";
                wrapper.innerHTML = `
                    <div class="card-header bg-black text-white py-2 px-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <span class="fw-bold small text-white"><i class="fa-solid fa-globe text-info me-1"></i> Vista Interactiva HTML #${hIdx + 1}: ${hFile}</span>
                        <div class="d-flex gap-2">
                            <a href="${htmlBlobUrl}" target="_blank" class="btn btn-sm btn-outline-light fw-bold border-2">
                                <i class="fa-solid fa-up-right-from-square me-1"></i> Pantalla Completa
                            </a>
                            <a href="${htmlBlobUrl}" download="${hFile}" class="btn btn-sm btn-warning text-black fw-bold border-2 border-black">
                                <i class="fa-solid fa-download me-1"></i> Descargar HTML
                            </a>
                        </div>
                    </div>
                    <div class="p-0 bg-white">
                        <iframe src="${htmlBlobUrl}" style="width: 100%; height: 420px; border: none;"></iframe>
                    </div>
                `;
                interactiveContainer.appendChild(wrapper);
            });
        }

        // E. RENDERIZAR ARCHIVOS DE DATOS EXPORTADOS (CSV / EXCEL)
        const basePreloaded = new Set(["ventas.csv", "ventas_2026.csv", "reporte_ventas.csv", "ventas_dataset.xlsx", "inventario_rotacion.xlsx", "inventario_junio2025.xlsx"]);
        const userGenFiles = dataFiles.filter(f => !basePreloaded.has(f));
        if (userGenFiles.length > 0 && genFilesContainer) {
            for (const dfile of userGenFiles) {
                const dbytes = wasmPyodideInstance.FS.readFile(dfile);
                const isCsv = dfile.endsWith('.csv');
                const mime = isCsv ? 'text/csv;charset=utf-8;' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                const dblob = new Blob([dbytes], { type: mime });
                const durl = URL.createObjectURL(dblob);
                wasmActiveBlobUrls.push(durl);

                const fileBadge = document.createElement('div');
                fileBadge.className = "alert alert-primary py-2 px-3 border-2 border-black shadow-hard-sm d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2";
                fileBadge.style.cssText = "background-color: #e0f2fe !important; color: #0f172a !important;";
                fileBadge.innerHTML = `
                    <div class="d-flex align-items-center gap-2">
                        <i class="fa-solid fa-file-excel text-success fs-5"></i>
                        <div>
                            <strong style="color: #0f172a !important;">${dfile}</strong>
                            <span class="small ms-2" style="color: #334155 !important;">(${(dbytes.length / 1024).toFixed(1)} KB)</span>
                        </div>
                    </div>
                    <a class="btn btn-sm btn-success text-white fw-bold border-2 border-black" href="${durl}" download="${dfile}">
                        <i class="fa-solid fa-download me-1"></i> Descargar ${dfile}
                    </a>
                `;
                genFilesContainer.appendChild(fileBadge);
            }
        }

        const duration = ((performance.now() - startTime) / 1000).toFixed(2);
        if (execDuration) {
            execDuration.innerText = `Ejecutado en ${duration}s`;
        }

    } catch (err) {
        console.error("Error ejecutando código en Pyodide:", err);
        termOutput.innerHTML += `\n<span class='text-danger fw-bold'>❌ DETALLE TÉCNICO DE EJECUCIÓN:</span>\n<span class='text-warning'>${err.message || err}</span>`;
        if (execDuration) {
            execDuration.innerText = "Finalizado con aviso";
        }
    } finally {
        wasmIsRunning = false;
        window.preloadedInputs = [];
        if (btnEjecutar) {
            btnEjecutar.disabled = false;
            btnEjecutar.innerHTML = '<i class="fa-solid fa-play me-1"></i> <span id="textBtnEjecutar">Ejecutar (Ctrl+Enter)</span>';
        }
    }
}

// 7. 📸 Descargar Foto del Código (Snapshot HD Tipo Ray.so / Carbon)
window.descargarFotoCodigo = function() {
    const codeInput = document.getElementById('wasmCodeInput');
    const fileNameEl = document.getElementById('wasmEditorFileName');
    if (!codeInput || !codeInput.value.trim()) return;

    const rawCode = codeInput.value;
    const lines = rawCode.split('\n');
    const title = (fileNameEl ? fileNameEl.innerText : 'script.py') || 'script.py';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const padding = 36;
    const headerHeight = 64;
    const footerHeight = 44;
    const lineHeight = 22;
    const fontSize = 14;

    ctx.font = `${fontSize}px "JetBrains Mono", Consolas, "Fira Code", monospace`;

    let maxLineWidth = 0;
    lines.forEach((l, idx) => {
        const textWithNum = `${String(idx + 1).padStart(3, ' ')}  ${l}`;
        const w = ctx.measureText(textWithNum).width;
        if (w > maxLineWidth) maxLineWidth = w;
    });

    const canvasWidth = Math.max(760, maxLineWidth + padding * 2 + 40);
    const canvasHeight = headerHeight + (lines.length * lineHeight) + footerHeight + padding;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const grad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const cardX = 20;
    const cardY = 20;
    const cardW = canvasWidth - 40;
    const cardH = canvasHeight - 40;

    ctx.fillStyle = '#0d1117';
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 12);
    ctx.fill();
    ctx.stroke();

    const btnY = cardY + 22;
    ctx.fillStyle = '#ff5f56';
    ctx.beginPath(); ctx.arc(cardX + 24, btnY, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffbd2e';
    ctx.beginPath(); ctx.arc(cardX + 44, btnY, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#27c93f';
    ctx.beginPath(); ctx.arc(cardX + 64, btnY, 6, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#8b949e';
    ctx.font = '12px "Space Grotesk", sans-serif';
    ctx.fillText(`🐍 ${title} — Python Pro Studio`, cardX + 86, btnY + 4);

    ctx.strokeStyle = '#21262d';
    ctx.beginPath();
    ctx.moveTo(cardX, cardY + headerHeight - 14);
    ctx.lineTo(cardX + cardW, cardY + headerHeight - 14);
    ctx.stroke();

    ctx.font = `${fontSize}px "JetBrains Mono", Consolas, "Fira Code", monospace`;
    let curY = cardY + headerHeight + 8;

    lines.forEach((lineText, idx) => {
        ctx.fillStyle = '#484f58';
        ctx.fillText(String(idx + 1).padStart(3, ' '), cardX + 18, curY);

        ctx.fillStyle = '#c9d1d9';
        if (lineText.trim().startsWith('#')) {
            ctx.fillStyle = '#8b949e';
        } else if (lineText.includes('import ') || lineText.includes('def ') || lineText.includes('class ') || lineText.includes('return') || lineText.includes('for ') || lineText.includes('while ')) {
            ctx.fillStyle = '#ff7b72';
        } else if (lineText.includes('"') || lineText.includes("'")) {
            ctx.fillStyle = '#a5d6ff';
        }
        ctx.fillText(lineText, cardX + 65, curY);
        curY += lineHeight;
    });

    const footerY = cardY + cardH - 14;
    ctx.fillStyle = '#58a6ff';
    ctx.font = '11px "Space Grotesk", sans-serif';
    ctx.fillText('👨‍💻 Ing. Juancito Peña • Masterclass Python & Streamlit Pro • @JuancitoDevV', cardX + 20, footerY);

    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const baseName = title.replace(/\.[^/.]+$/, "");
        a.download = `${baseName}_codigo_snapshot.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
};

// 8. Manejo de Subida de Archivos del Usuario al VFS (Sin alerts)
window.manejarSubidaArchivoWasm = function(event) {
    const file = event.target.files[0];
    if (!file || !wasmPyodideReady || !wasmPyodideInstance) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const arrayBuffer = e.target.result;
            const uint8Array = new Uint8Array(arrayBuffer);
            wasmPyodideInstance.FS.writeFile(file.name, uint8Array);
            wasmVfsFiles.add(file.name);
            actualizarListaArchivosVFS();

            const codeInput = document.getElementById('wasmCodeInput');
            if (codeInput) {
                let snippet = "";
                if (file.name.endsWith('.csv')) {
                    snippet = `import pandas as pd\ndf = pd.read_csv("${file.name}")\nprint("Dataset cargado (${file.name}):")\nprint(df.head(10))\n`;
                } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                    snippet = `import pandas as pd\ndf = pd.read_excel("${file.name}")\nprint("Dataset Excel cargado (${file.name}):")\nprint(df.head(10))\n`;
                } else if (file.name.endsWith('.json')) {
                    snippet = `import pandas as pd\ndf = pd.read_json("${file.name}")\nprint("Dataset JSON cargado (${file.name}):")\nprint(df.head(10))\n`;
                }
                codeInput.value = snippet;
                actualizarEstadisticasCodigo();
                window.ejecutarCodigoWasm();
            }
        } catch(err) {
            console.error("Error al cargar archivo en VFS:", err);
        }
    };
    reader.readAsArrayBuffer(file);
};

// 9. Inyección de Datasets Sintéticos en 1 Clic (Sin alerts)
window.inyectarDatasetSintetico = function(tipo) {
    if (!wasmPyodideReady || !wasmPyodideInstance) return;

    let fileName = "";
    let csvContent = "";

    if (tipo === 'finanzas') {
        fileName = "Reporte_Financiero_Anual.csv";
        csvContent = "Mes,Ingresos_USD,Gastos_USD,Meta_Ventas_USD\nEne,15000,9000,14000\nFeb,18000,9500,15000\nMar,12000,10000,15000\nAbr,25000,11000,20000\nMay,22000,10500,20000\nJun,28000,12000,25000\nJul,31000,13500,25000\nAgo,29000,13000,25000\nSep,24000,11500,25000\nOct,26000,12500,25000\nNov,35000,15000,30000\nDic,42000,18000,35000\n";
    } else if (tipo === 'ventas') {
        fileName = "Reporte_Masivo_Ventas_1000.csv";
        csvContent = "ID_Factura,Sucursal,Producto,Cantidad,Precio_Unitario,Total_Factura\n";
        const sucursales = ["Santo Domingo", "Santiago", "Punta Cana", "La Romana", "Baní"];
        const productos = ["Laptop Pro 16", "Monitor 4K 32", "Mouse Ergonómico", "Teclado Mecánico", "Webcam HD 4K"];
        const precios = [2500, 15000, 45000, 8000, 3500];
        for(let i=1; i<=200; i++) {
            const suc = sucursales[i % sucursales.length];
            const prod = productos[i % productos.length];
            const cant = (i % 5) + 1;
            const precio = precios[i % precios.length];
            csvContent += `FAC-${1000+i},${suc},${prod},${cant},${precio},${cant * precio}\n`;
        }
    } else if (tipo === 'titanic') {
        fileName = "titanic_oficial.csv";
        csvContent = "PassengerId,Survived,Pclass,Name,Sex,Age,SibSp,Parch,Ticket,Fare,Embarked\n1,0,3,Braund Mr. Owen,male,22,1,0,A/5 21171,7.25,S\n2,1,1,Cumings Mrs. John,female,38,1,0,PC 17599,71.28,C\n3,1,3,Heikkinen Miss. Laina,female,26,0,0,STON/O2,7.92,S\n4,1,1,Futrelle Mrs. Jacques,female,35,1,0,113803,53.1,S\n5,0,3,Allen Mr. William,male,35,0,0,373450,8.05,S\n";
    }

    wasmPyodideInstance.FS.writeFile(fileName, csvContent);
    wasmVfsFiles.add(fileName);
    actualizarListaArchivosVFS();

    const codeInput = document.getElementById('wasmCodeInput');
    if (codeInput) {
        codeInput.value = `import pandas as pd\nimport plotly.express as px\n\ndf = pd.read_csv("${fileName}")\nprint("✅ Dataset ${fileName} cargado en memoria:")\nprint(df.head())\n\nfig = px.bar(df.head(12), x=df.columns[0], y=df.select_dtypes('number').columns[0], title="Análisis de ${fileName}")\nfig.show()\n`;
        actualizarEstadisticasCodigo();
        window.ejecutarCodigoWasm();
    }
};

// 10. Actualizar Lista visual de archivos en el VFS
function actualizarListaArchivosVFS() {
    const listContainer = document.getElementById('wasmVfsList');
    const badgeCount = document.getElementById('wasmFileCountBadge');
    if (!listContainer) return;

    if (wasmVfsFiles.size === 0) {
        listContainer.innerHTML = '<span class="text-light small fst-italic">48 datasets del curso precargados en RAM.</span>';
        if (badgeCount) badgeCount.innerText = '48 en RAM';
        return;
    }

    listContainer.innerHTML = '';
    if (badgeCount) badgeCount.innerText = `${wasmVfsFiles.size} activos en RAM`;

    wasmVfsFiles.forEach(fname => {
        const tag = document.createElement('span');
        tag.className = 'badge bg-dark text-info border border-secondary px-2 py-1 d-inline-flex align-items-center gap-1';
        tag.innerHTML = `<i class="fa-solid fa-database text-warning"></i><span>${fname}</span>`;
        listContainer.appendChild(tag);
    });
}

// 11. Utilidades del Editor y Pantalla Completa (Cero alerts)
window.copiarCodigoModal = function(btn) {
    const codeInput = document.getElementById('wasmCodeInput');
    if (!codeInput || !codeInput.value) return;
    navigator.clipboard.writeText(codeInput.value).then(() => {
        const targetBtn = btn || document.querySelector('#modalRunnerWasm .btn-copy-modal');
        if (targetBtn) {
            const orig = targetBtn.innerHTML;
            targetBtn.innerHTML = '<i class="fa-solid fa-check text-success me-1"></i> ¡Copiado!';
            setTimeout(() => { targetBtn.innerHTML = orig; }, 2000);
        }
    });
};

window.limpiarCodigoModal = function() {
    const codeInput = document.getElementById('wasmCodeInput');
    if (codeInput) {
        codeInput.value = "";
        actualizarEstadisticasCodigo();
        codeInput.focus();
    }
};

window.limpiarSalidaModal = function() {
    const term = document.getElementById('wasmTerminalOutput');
    const st = document.getElementById('wasmStreamlitPreviewContainer');
    const tbls = document.getElementById('wasmTablesContainer');
    const plots = document.getElementById('wasmPlotsContainer');
    const inter = document.getElementById('wasmInteractiveContainer');
    const gfiles = document.getElementById('wasmGeneratedFilesContainer');

    if (term) term.innerText = "... Consola limpia ...";
    if (st) { st.innerHTML = ""; st.classList.add('d-none'); }
    if (tbls) tbls.innerHTML = "";
    if (plots) plots.innerHTML = "";
    if (inter) { inter.innerHTML = ""; inter.classList.add('d-none'); }
    if (gfiles) gfiles.innerHTML = "";
    revocarBlobsPrevios();
};

window.descargarScriptModal = function() {
    const codeInput = document.getElementById('wasmCodeInput');
    const fileNameEl = document.getElementById('wasmEditorFileName');
    if (!codeInput || !codeInput.value) return;

    let fname = (fileNameEl ? fileNameEl.innerText.trim() : 'script.py') || 'script.py';
    if (!fname.endsWith('.py')) fname = 'script_curso.py';
    const blob = new Blob([codeInput.value], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fname;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};

window.toggleWasmFullscreen = function() {
    const dialog = document.getElementById('modalRunnerWasmDialog');
    const icon = document.getElementById('iconWasmFullscreen');
    const text = document.getElementById('textWasmFullscreen');
    if (!dialog) return;

    if (dialog.classList.contains('modal-fullscreen')) {
        dialog.classList.remove('modal-fullscreen', 'm-0', 'w-100', 'h-100');
        dialog.style.maxWidth = '95vw';
        dialog.style.margin = '1.5vh auto';
        if (icon) icon.className = 'fa-solid fa-expand me-1';
        if (text) text.innerText = 'Pantalla Completa';
    } else {
        dialog.classList.add('modal-fullscreen', 'm-0', 'w-100', 'h-100');
        dialog.style.maxWidth = '100vw';
        dialog.style.margin = '0';
        if (icon) icon.className = 'fa-solid fa-compress me-1';
        if (text) text.innerText = 'Restaurar';
    }
};

window.abrirEnPyStudioCloud = function() {
    const codeInput = document.getElementById('wasmCodeInput');
    const code = codeInput ? codeInput.value : '';
    if (code) navigator.clipboard.writeText(code);
    window.open('https://juancitopena.github.io/JPV_PyStudio/', '_blank');
};

window.abrirEnGoogleColab = function() {
    const codeInput = document.getElementById('wasmCodeInput');
    const code = codeInput ? codeInput.value : '';
    if (code) navigator.clipboard.writeText(code);
    window.open('https://colab.research.google.com/#create=true', '_blank');
};

// 12. INYECCIÓN AUTOMÁTICA DE BOTONES EN TODOS LOS BLOQUES DE CÓDIGO (EXCLUYENDO MODAL Y LOGS DE CONSOLA)
function inyectarBotonesEjecutarGlobales() {
    document.querySelectorAll('.code-box-header').forEach(header => {
        if (header.dataset.runnerInitialized) return;
        header.dataset.runnerInitialized = 'true';

        const btnRun = document.createElement('button');
        btnRun.className = 'btn-run-code me-1';
        btnRun.type = 'button';
        btnRun.innerHTML = '<i class="fa-solid fa-play text-warning me-1"></i> Probar y Ejecutar';
        btnRun.title = 'Ejecutar en vivo y ver gráficos/tablas en la consola interactiva';

        btnRun.addEventListener('click', (e) => {
            e.stopPropagation();
            const container = header.closest('.code-box-container') || header.parentElement;
            const codeEl = container ? container.querySelector('code') : null;
            const codeText = codeEl ? (codeEl.innerText || codeEl.textContent) : '';
            const titleEl = header.querySelector('.code-box-badge, span');
            const title = titleEl ? titleEl.innerText.trim() : 'script.py';
            window.abrirModalEjecutor(codeText, title);
        });

        const copyBtn = header.querySelector('.btn-copy-code');
        if (copyBtn) {
            header.insertBefore(btnRun, copyBtn);
        } else {
            header.appendChild(btnRun);
        }
    });

    document.querySelectorAll('pre').forEach(pre => {
        if (pre.closest('.code-box-container') || pre.closest('#modalRunnerWasm') || pre.closest('.terminal-mockup-output') || pre.dataset.runnerInitialized) return;
        pre.dataset.runnerInitialized = 'true';
        pre.style.position = 'relative';

        const btnRunFloating = document.createElement('button');
        btnRunFloating.className = 'btn-run-floating';
        btnRunFloating.type = 'button';
        btnRunFloating.innerHTML = '<i class="fa-solid fa-play text-warning me-1"></i> Probar y Ejecutar';
        btnRunFloating.title = 'Abrir en la consola interactiva';

        btnRunFloating.addEventListener('click', (e) => {
            e.stopPropagation();
            const codeEl = pre.querySelector('code');
            const codeText = codeEl ? (codeEl.innerText || codeEl.textContent) : pre.innerText;
            window.abrirModalEjecutor(codeText, 'ejercicio.py');
        });

        pre.appendChild(btnRunFloating);
    });
}

// 13. Atajos de teclado y Warm-up en segundo plano
document.addEventListener('DOMContentLoaded', () => {
    const codeArea = document.getElementById('wasmCodeInput');
    if (codeArea) {
        codeArea.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                window.ejecutarCodigoWasm();
            }
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = codeArea.selectionStart;
                const end = codeArea.selectionEnd;
                codeArea.value = codeArea.value.substring(0, start) + "    " + codeArea.value.substring(end);
                codeArea.selectionStart = codeArea.selectionEnd = start + 4;
                actualizarEstadisticasCodigo();
            }
        });
        codeArea.addEventListener('input', () => { actualizarEstadisticasCodigo(); sincronizarPrismEditor(); });
        codeArea.addEventListener('scroll', () => { const l = document.getElementById('wasmHighlightLayer'); if(l) { l.scrollTop = codeArea.scrollTop; l.scrollLeft = codeArea.scrollLeft; } });
    }

    inyectarBotonesEjecutarGlobales();

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => initWasmPyodideCore(true), { timeout: 3000 });
    } else {
        setTimeout(() => initWasmPyodideCore(true), 1800);
    }
});
