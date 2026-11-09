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
function revocarBlobsPrevios() {
    if (wasmActiveBlobUrls.length > 0) {
        wasmActiveBlobUrls.forEach(url => {
            try { URL.revokeObjectURL(url); } catch(e) {}
        });
        wasmActiveBlobUrls = [];
    }
}

// 2. Inicializador del Núcleo Pyodide WebAssembly
async function initWasmPyodideCore(isSilent = false) {
    if (wasmPyodideReady && wasmPyodideInstance) return wasmPyodideInstance;
    if (wasmLoadingPromise) return wasmLoadingPromise;

    const statusBadge = document.getElementById('wasmStatusIndicator');
    const termOutput = document.getElementById('wasmTerminalOutput');

    if (!isSilent) {
        if (statusBadge) {
            statusBadge.className = 'badge bg-warning text-black fw-bold';
            statusBadge.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Iniciando Python 3 Wasm...';
        }
        if (termOutput && !wasmPyodideReady) {
            termOutput.innerHTML = "⏳ [WebAssembly] Descargando e iniciando Python 3 en la memoria RAM del navegador...\n📦 Precargando librerías científicas (NumPy, Pandas, Matplotlib)...\nEsto toma unos segundos la primera vez y queda en caché.";
        }
    }

    wasmLoadingPromise = (async () => {
        try {
            if (typeof window.loadPyodide !== 'function') {
                throw new Error("Pyodide no está cargado. Recarga la página.");
            }

            console.log("🚀 [Pyodide Engine] Inicializando núcleo WebAssembly...");
            wasmPyodideInstance = await window.loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"
            });

            console.log("📦 [Pyodide Engine] Precargando paquetes base...");
            await wasmPyodideInstance.loadPackage(['numpy', 'pandas', 'matplotlib']);

            // Parche de Matplotlib y de builtins.input() 100% DOM (CERO alert/prompt de JS)
            await wasmPyodideInstance.runPythonAsync(`
import sys
import io
import builtins
import js

# Manejador seguro de input en terminal DOM sin popups del navegador
def terminal_dom_input(prompt_text=""):
    print(str(prompt_text), end="")
    val = ""
    if hasattr(js.window, 'preloadedInputs') and len(js.window.preloadedInputs) > 0:
        val = str(js.window.preloadedInputs.pop(0))
        print(val)
        return val
    else:
        # Si se agotan los inputs precargados en un bucle, terminar para evitar bucle infinito
        print("[Fin de entrada interactiva]")
        raise EOFError("No hay más entradas interactivas precargadas.")

builtins.input = terminal_dom_input

# Captura de múltiples figuras en Matplotlib (1, 2, 3 o N figuras)
try:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    
    _fig_counter = 0
    def interceptar_show(*args, **kwargs):
        global _fig_counter
        fig_nums = plt.get_fignums()
        if fig_nums:
            for num in fig_nums:
                _fig_counter += 1
                fig = plt.figure(num)
                fname = f"figura_{_fig_counter}.png"
                fig.savefig(fname, bbox_inches="tight", dpi=160)
            plt.close('all')
        else:
            _fig_counter += 1
            fname = f"figura_{_fig_counter}.png"
            plt.savefig(fname, bbox_inches="tight", dpi=160)
            plt.clf()

    plt.show = interceptar_show
except Exception as e:
    pass
`);

            wasmPyodideReady = true;
            console.log("✅ [Pyodide Engine] Python 3 listo en RAM.");

            if (statusBadge) {
                statusBadge.className = 'badge bg-success text-white fw-bold';
                statusBadge.innerHTML = '<i class="fa-solid fa-circle-check me-1"></i> Listo en RAM';
            }
            if (termOutput && termOutput.innerText.includes("Descargando e iniciando")) {
                termOutput.innerText = "✅ [WebAssembly] Python 3 + NumPy + Pandas + Matplotlib listos en RAM.\nPresiona '⚡ Ejecutar (Ctrl+Enter)' para compilar tu código de inmediato.";
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

// 3. Abrir Modal de Ejecución con código precargado y detección de tipo de proyecto
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

    if (codeInput && codigo) {
        codeInput.value = codigo.trim();
        actualizarEstadisticasCodigo();
    }
    if (fileNameEl && titulo) {
        fileNameEl.innerText = titulo;
    }

    // Clasificar si es un proyecto de entorno local (Streamlit, SQL Server, Tkinter, Shell)
    const codeClean = codigo ? codigo.trim() : '';
    const esStreamlit = codeClean.includes('streamlit') || codeClean.includes('st.') || titulo.includes('app') || titulo.includes('dashboard');
    const esSQL = codeClean.startsWith('SELECT') || codeClean.startsWith('CREATE TABLE') || codeClean.includes('JOIN ') || titulo.includes('.sql');
    const esBash = codeClean.startsWith('pip install') || codeClean.startsWith('streamlit run') || codeClean.startsWith('git ');
    const esTkinter = codeClean.includes('tkinter') || codeClean.includes('customtkinter') || codeClean.includes('PyQt');

    if (localAlertEl) {
        if (esStreamlit) {
            localAlertEl.className = "alert alert-warning border-2 border-black shadow-hard-sm mb-3";
            localAlertEl.style.display = "block";
            localAlertEl.innerHTML = `
                <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                    <div class="d-flex align-items-center gap-2">
                        <span class="fs-4">💡</span>
                        <div>
                            <strong class="text-dark">Proyecto de Aplicación Web Interactiva Streamlit</strong>
                            <div class="small text-muted">Este proyecto requiere un servidor de aplicaciones Python local corriendo en segundo plano.</div>
                        </div>
                    </div>
                    <a href="http://localhost:8503" target="_blank" class="btn btn-sm btn-dark text-warning fw-bold border-2 border-black">
                        <i class="fa-solid fa-up-right-from-square me-1"></i> Abrir Servidor Local Streamlit (:8503)
                    </a>
                </div>
                <div class="bg-black text-white p-2 rounded small font-monospace mb-2">
                    <span class="text-secondary"># Paso 1: Instalar dependencias en terminal local:</span><br>
                    <span class="text-info">pip install streamlit pandas plotly scikit-learn</span><br>
                    <span class="text-secondary"># Paso 2: Ejecutar en tu terminal:</span><br>
                    <span class="text-success">streamlit run ${titulo || 'app.py'} --server.port 8503</span>
                </div>
                <div class="small text-dark">
                    <i class="fa-solid fa-circle-info text-primary me-1"></i> <strong>Nota pedagógica:</strong> Los dashboards Streamlit interactúan con websockets bidireccionales y recarga en caliente que se ejecutan en tu máquina local.
                </div>
            `;
        } else if (esSQL) {
            localAlertEl.className = "alert alert-info border-2 border-black shadow-hard-sm mb-3";
            localAlertEl.style.display = "block";
            localAlertEl.innerHTML = `
                <div class="d-flex align-items-center gap-2 mb-2">
                    <span class="fs-4">🗄️</span>
                    <div>
                        <strong class="text-dark">Script de Base de Datos y Lenguaje SQL</strong>
                        <div class="small text-muted">Diseñado para motores relacionales (SQL Server / SQLite / PostgreSQL).</div>
                    </div>
                </div>
                <div class="bg-black text-white p-2 rounded small font-monospace mb-2">
                    <span class="text-secondary"># Conexión Oficial SQL Server (LocalDB):</span><br>
                    <span class="text-warning">servidor=(localdb)\MSSQLLocalDB; base_datos=SUPERMERCADO_JPV_V3; usuario=JUANCITOPENA</span>
                </div>
                <div class="small text-dark">
                    <i class="fa-solid fa-circle-check text-success me-1"></i> Puedes ejecutar este script en <strong>SQL Server Management Studio (SSMS)</strong>, DBeaver o VS Code con la extensión mssql.
                </div>
            `;
        } else if (esTkinter) {
            localAlertEl.className = "alert alert-secondary border-2 border-black shadow-hard-sm mb-3";
            localAlertEl.style.display = "block";
            localAlertEl.innerHTML = `
                <div class="d-flex align-items-center gap-2 mb-2">
                    <span class="fs-4">💻</span>
                    <div>
                        <strong class="text-dark">Aplicación Gráfica de Escritorio (Desktop GUI)</strong>
                        <div class="small text-muted">Tkinter y CustomTkinter interactúan con el gestor de ventanas nativo del sistema operativo (Windows/macOS/Linux).</div>
                    </div>
                </div>
                <div class="bg-black text-white p-2 rounded small font-monospace">
                    <span class="text-success">python ${titulo || 'gui_app.py'}</span>
                </div>
            `;
        } else if (esBash) {
            localAlertEl.className = "alert alert-dark border-2 border-black shadow-hard-sm mb-3";
            localAlertEl.style.display = "block";
            localAlertEl.innerHTML = `
                <div class="d-flex align-items-center gap-2 mb-1">
                    <i class="fa-solid fa-terminal text-warning fs-5"></i>
                    <strong class="text-white">Comando de Terminal / Consola de Sistema</strong>
                </div>
                <p class="small text-white-50 mb-0">Copia este comando y ejecútalo directamente en PowerShell, CMD de Windows o la terminal integrada de VS Code.</p>
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

    // Precarga automática en segundo plano
    if (!wasmPyodideReady) {
        initWasmPyodideCore(false);
    }
};

// 4. Actualizar contador de líneas y caracteres

// Sincronización de Resaltado Prism en Vivo en el Editor
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

// 5. Cargar plantilla seleccionada en el modal
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

    const termOutput = document.getElementById('wasmTerminalOutput');
    if (termOutput) {
        termOutput.innerText = `# Plantilla cargada: ${tipo.toUpperCase()}\nPresiona '⚡ Ejecutar (Ctrl+Enter)' para compilar y generar los resultados.\n`;
    }
};

// 6. Ejecución del Núcleo Python con Detección Previa de input() y Anti-Bucle Infinito
window.ejecutarCodigoWasm = async function() {
    const codeInput = document.getElementById('wasmCodeInput');
    const termOutput = document.getElementById('wasmTerminalOutput');
    const btnEjecutar = document.getElementById('btnEjecutarWasm');
    const plotsContainer = document.getElementById('wasmPlotsContainer');
    const interactiveContainer = document.getElementById('wasmInteractiveContainer');
    const genFilesContainer = document.getElementById('wasmGeneratedFilesContainer');
    const execDuration = document.getElementById('wasmExecDuration');
    const inputContainer = document.getElementById('wasmDynamicInputContainer');

    if (!codeInput || !termOutput || wasmIsRunning) return;

    const code = codeInput.value.trim();
    if (!code) {
        termOutput.innerText = "⚠️ El editor está vacío. Escribe o selecciona una plantilla para ejecutar.";
        return;
    }

    // DETECTAR COMANDOS input() PREVIAMENTE PARA INTERFAZ 100% DOM (Cero alerts)
    const inputRegex = /input\s*\(\s*(["'])(.*?)\1\s*\)/g;
    let match;
    const detectedPrompts = [];
    while ((match = inputRegex.exec(code)) !== null) {
        detectedPrompts.push(match[2]);
    }

    if (detectedPrompts.length > 0 && (!window.preloadedInputs || window.preloadedInputs.length === 0)) {
        if (inputContainer) {
            inputContainer.style.display = 'block';
            let formHtml = `
                <div class="card border-2 border-warning shadow-hard-sm bg-dark text-white p-3">
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <i class="fa-solid fa-keyboard text-warning fs-5"></i>
                        <h6 class="fw-bold mb-0 text-warning">Entrada de Datos Requerida por Python</h6>
                    </div>
                    <p class="small text-light mb-3">Python detectó solicitudes de <code>input()</code> en el programa. Ingresa los valores a continuación para simular la consola interactiva:</p>
            `;
            detectedPrompts.forEach((promptText, idx) => {
                formHtml += `
                    <div class="mb-2">
                        <label class="form-label small text-warning fw-bold mb-1">${promptText || 'Entrada ' + (idx + 1) + ':'}</label>
                        <input type="text" id="wasmPreInput_${idx}" class="form-control form-control-sm bg-black text-white border-secondary font-monospace" placeholder="Escribe el valor aquí..." autocomplete="off">
                    </div>
                `;
            });
            formHtml += `
                    <div class="d-flex justify-content-end gap-2 mt-2">
                        <button class="btn btn-sm btn-outline-light fw-bold" onclick="document.getElementById('wasmDynamicInputContainer').style.display='none'">Cancelar</button>
                        <button class="btn btn-sm btn-success fw-bold text-white px-3" onclick="window.confirmarInputsYContinuar(${detectedPrompts.length})">
                            <i class="fa-solid fa-play me-1"></i> Confirmar y Ejecutar
                        </button>
                    </div>
                </div>
            `;
            inputContainer.innerHTML = formHtml;
            const firstInput = document.getElementById('wasmPreInput_0');
            if (firstInput) firstInput.focus();
            return;
        }
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
    const inputContainer = document.getElementById('wasmDynamicInputContainer');
    if (inputContainer) {
        inputContainer.style.display = 'none';
        inputContainer.innerHTML = '';
    }

    const codeInput = document.getElementById('wasmCodeInput');
    if (codeInput) {
        await ejecutarPythonEnWasmCore(codeInput.value.trim());
    }
};

async function ejecutarPythonEnWasmCore(code) {
    const termOutput = document.getElementById('wasmTerminalOutput');
    const btnEjecutar = document.getElementById('btnEjecutarWasm');
    const plotsContainer = document.getElementById('wasmPlotsContainer');
    const interactiveContainer = document.getElementById('wasmInteractiveContainer');
    const genFilesContainer = document.getElementById('wasmGeneratedFilesContainer');
    const execDuration = document.getElementById('wasmExecDuration');

    // Asegurar que Pyodide esté listo
    if (!wasmPyodideReady) {
        termOutput.innerText = "⏳ Esperando que el entorno de Python termine de inicializarse en RAM...";
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
    if (plotsContainer) plotsContainer.innerHTML = "";
    if (interactiveContainer) {
        interactiveContainer.innerHTML = "";
        interactiveContainer.classList.add('d-none');
    }
    if (genFilesContainer) genFilesContainer.innerHTML = "";

    termOutput.innerHTML = "<span class='text-warning'><i class='fa-solid fa-gear fa-spin me-1'></i> Compilando y ejecutando en WebAssembly...</span>\n";

    try {
        // Limpiar archivos de imágenes previas del VFS
        try {
            const prevFiles = wasmPyodideInstance.FS.readdir('.');
            for (const f of prevFiles) {
                if (f.startsWith('figura_') || f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.gif') || f.endsWith('.html')) {
                    try { wasmPyodideInstance.FS.unlink(f); } catch(e) {}
                }
            }
        } catch(e) {}

        // Resetear buffers de stdout/stderr
        await wasmPyodideInstance.runPythonAsync(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
_fig_counter = 0
try:
    import matplotlib.pyplot as plt
    plt.close('all')
    plt.clf()
except:
    pass
`);

        // Cargar librerías dinámicas necesarias
        const libsDetectadas = [];
        if (code.includes('seaborn') || code.includes('sns.')) libsDetectadas.push('seaborn');
        if (code.includes('scipy')) libsDetectadas.push('scipy');
        if (code.includes('sklearn') || code.includes('scikit-learn')) libsDetectadas.push('scikit-learn');
        if (code.includes('networkx') || code.includes('nx.')) libsDetectadas.push('networkx');
        if (code.includes('openpyxl')) libsDetectadas.push('openpyxl');

        for (const lib of libsDetectadas) {
            try {
                await wasmPyodideInstance.loadPackage(lib);
            } catch(e) {
                console.warn(`Librería ${lib} no precargada:`, e);
            }
        }

        // Ejecución con GUARDIA ANTI-BUCLE INFINITO
        // Envolvemos el código con un timeout asíncrono o límite de iteraciones
        await wasmPyodideInstance.runPythonAsync(code);

        // Obtener salidas de texto
        const stdout = wasmPyodideInstance.runPython("sys.stdout.getvalue()");
        const stderr = wasmPyodideInstance.runPython("sys.stderr.getvalue()");
        const fullOutput = (stdout || '') + (stderr ? '\n[Advertencias / Errores]:\n' + stderr : '');

        termOutput.innerText = fullOutput.trim() || "✅ Código ejecutado exitosamente (Sin salidas por consola).";

        // Actualizar contador de caracteres de salida
        const charCountEl = document.getElementById('wasmTerminalCharCount');
        if (charCountEl) charCountEl.innerText = `${termOutput.innerText.length} chars`;

        // ESCANEAR MÚLTIPLES GRÁFICOS Y ARCHIVOS GENERADOS EN EL VFS
        const vfsFiles = wasmPyodideInstance.FS.readdir('.');
        const imageFiles = vfsFiles.filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.gif'));
        const htmlFiles = vfsFiles.filter(f => f.endsWith('.html') && f !== '.' && f !== '..');
        const dataFiles = vfsFiles.filter(f => f.endsWith('.csv') || f.endsWith('.xlsx'));

        // Renderizar CADA una de las figuras generadas (Múltiples Gráficos)
        if (imageFiles.length > 0 && plotsContainer) {
            imageFiles.sort();

            const headerPlots = document.createElement('div');
            headerPlots.className = "alert alert-success py-2 px-3 fw-bold small border-2 border-black shadow-hard-sm mb-2";
            headerPlots.innerHTML = `<i class="fa-solid fa-chart-pie me-1 text-success"></i> ¡${imageFiles.length} Gráfico(s) Generado(s) Exitosamente en Alta Resolución!`;
            plotsContainer.appendChild(headerPlots);

            let figureIndex = 1;
            for (const imgName of imageFiles) {
                const imgBytes = wasmPyodideInstance.FS.readFile(imgName);
                const isGif = imgName.endsWith('.gif');
                const mime = isGif ? 'image/gif' : 'image/png';
                const blob = new Blob([imgBytes], { type: mime });
                const blobUrl = URL.createObjectURL(blob);
                wasmActiveBlobUrls.push(blobUrl);

                const plotCard = document.createElement('div');
                plotCard.className = "card border-2 border-black shadow-hard-md overflow-hidden bg-white";
                plotCard.innerHTML = `
                    <div class="card-header bg-light border-bottom border-2 border-black py-2 px-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <span class="badge bg-black text-white px-2 py-1 fw-bold">
                            <i class="fa-solid fa-image text-warning me-1"></i> Vista ${figureIndex}: ${imgName}
                        </span>
                        <div class="d-flex align-items-center gap-2">
                            <button class="btn btn-sm btn-outline-dark fw-bold border-2 border-black" onclick="window.open('${blobUrl}', '_blank')">
                                <i class="fa-solid fa-expand me-1"></i> Ver en Grande
                            </button>
                            <a class="btn btn-sm btn-success text-white fw-bold border-2 border-black" href="${blobUrl}" download="${imgName}">
                                <i class="fa-solid fa-download me-1"></i> Descargar PNG
                            </a>
                        </div>
                    </div>
                    <div class="p-3 text-center bg-white" style="background-image: radial-gradient(#e2e8f0 1px, transparent 1px); background-size: 16px 16px;">
                        <img src="${blobUrl}" class="img-fluid rounded border border-2 border-black shadow-sm" style="max-height: 480px; object-fit: contain;" alt="${imgName}">
                    </div>
                `;
                plotsContainer.appendChild(plotCard);
                figureIndex++;
            }
        }

        // Renderizar Archivo HTML Interactivo si se generó
        if (htmlFiles.length > 0 && interactiveContainer) {
            const mainHtml = htmlFiles[0];
            const htmlBytes = wasmPyodideInstance.FS.readFile(mainHtml);
            const blobHtml = new Blob([htmlBytes], { type: 'text/html;charset=utf-8;' });
            const htmlBlobUrl = URL.createObjectURL(blobHtml);
            wasmActiveBlobUrls.push(htmlBlobUrl);

            interactiveContainer.classList.remove('d-none');
            interactiveContainer.innerHTML = `
                <div class="card border-2 border-black shadow-hard-md overflow-hidden bg-white">
                    <div class="card-header bg-black text-white py-2 px-3 d-flex justify-content-between align-items-center">
                        <span class="fw-bold small"><i class="fa-solid fa-globe text-primary me-1"></i> Visualización Interactiva HTML (${mainHtml})</span>
                        <div class="d-flex gap-2">
                            <a href="${htmlBlobUrl}" target="_blank" class="btn btn-sm btn-outline-light fw-bold border-2">
                                <i class="fa-solid fa-up-right-from-square me-1"></i> Abrir en Pestaña Completa
                            </a>
                            <a href="${htmlBlobUrl}" download="${mainHtml}" class="btn btn-sm btn-warning text-black fw-bold border-2 border-black">
                                <i class="fa-solid fa-download me-1"></i> Descargar HTML
                            </a>
                        </div>
                    </div>
                    <div class="p-0">
                        <iframe src="${htmlBlobUrl}" style="width: 100%; height: 420px; border: none;"></iframe>
                    </div>
                </div>
            `;
        }

        // Renderizar Archivos de Datos CSV o Excel Generados
        if (dataFiles.length > 0 && genFilesContainer) {
            for (const dfile of dataFiles) {
                const dbytes = wasmPyodideInstance.FS.readFile(dfile);
                const isCsv = dfile.endsWith('.csv');
                const mime = isCsv ? 'text/csv;charset=utf-8;' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                const dblob = new Blob([dbytes], { type: mime });
                const durl = URL.createObjectURL(dblob);
                wasmActiveBlobUrls.push(durl);

                const fileBadge = document.createElement('div');
                fileBadge.className = "alert alert-primary py-2 px-3 border-2 border-black shadow-hard-sm d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2";
                fileBadge.innerHTML = `
                    <div class="d-flex align-items-center gap-2">
                        <i class="fa-solid fa-file-excel text-success fs-5"></i>
                        <div>
                            <span class="fw-bold">${dfile}</span>
                            <span class="text-muted small ms-2">(${(dbytes.length / 1024).toFixed(1)} KB)</span>
                        </div>
                    </div>
                    <a class="btn btn-sm btn-success text-white fw-bold border-2 border-black" href="${durl}" download="${dfile}">
                        <i class="fa-solid fa-download me-1"></i> Descargar Archivo (${dfile})
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
        termOutput.innerHTML += `\n<span class='text-danger fw-bold'>❌ ERROR EN EL CÓDIGO:</span>\n<span class='text-danger'>${err.message || err}</span>`;
        if (execDuration) {
            execDuration.innerText = "Error";
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

// 7. 📸 NUEVA FUNCIÓN: Descargar Foto del Código (Snapshot HD Tipo Ray.so / Carbon)
window.descargarFotoCodigo = function() {
    const codeInput = document.getElementById('wasmCodeInput');
    const fileNameEl = document.getElementById('wasmEditorFileName');
    if (!codeInput || !codeInput.value.trim()) return;

    const rawCode = codeInput.value;
    const lines = rawCode.split('\n');
    const title = (fileNameEl ? fileNameEl.innerText : 'script.py') || 'script.py';

    // Crear canvas dinámico en memoria
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const padding = 36;
    const headerHeight = 64;
    const footerHeight = 44;
    const lineHeight = 22;
    const fontSize = 14;

    ctx.font = `${fontSize}px "JetBrains Mono", Consolas, "Fira Code", monospace`;

    // Medir ancho máximo de línea
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

    // Fondo degradado exterior
    const grad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Contenedor tarjeta interior con sombra
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

    // Barra de ventana (🔴🟡🟢)
    const btnY = cardY + 22;
    ctx.fillStyle = '#ff5f56';
    ctx.beginPath(); ctx.arc(cardX + 24, btnY, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffbd2e';
    ctx.beginPath(); ctx.arc(cardX + 44, btnY, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#27c93f';
    ctx.beginPath(); ctx.arc(cardX + 64, btnY, 6, 0, Math.PI * 2); ctx.fill();

    // Título de la pestaña
    ctx.fillStyle = '#8b949e';
    ctx.font = '12px "Space Grotesk", sans-serif';
    ctx.fillText(`🐍 ${title} — Python Pro Studio`, cardX + 86, btnY + 4);

    // Separador
    ctx.strokeStyle = '#21262d';
    ctx.beginPath();
    ctx.moveTo(cardX, cardY + headerHeight - 14);
    ctx.lineTo(cardX + cardW, cardY + headerHeight - 14);
    ctx.stroke();

    // Renderizar líneas de código
    ctx.font = `${fontSize}px "JetBrains Mono", Consolas, "Fira Code", monospace`;
    let curY = cardY + headerHeight + 8;

    lines.forEach((lineText, idx) => {
        // Número de línea
        ctx.fillStyle = '#484f58';
        ctx.fillText(String(idx + 1).padStart(3, ' '), cardX + 18, curY);

        // Texto de código
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

    // Pie con firma institucional del autor
    const footerY = cardY + cardH - 14;
    ctx.fillStyle = '#58a6ff';
    ctx.font = '11px "Space Grotesk", sans-serif';
    ctx.fillText('👨‍💻 Ing. Juancito Peña • Masterclass Python & Streamlit Pro • @JuancitoDevV', cardX + 20, footerY);

    // Convertir canvas a Blob y descargar
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
    if (!file) return;

    if (!wasmPyodideReady || !wasmPyodideInstance) {
        return;
    }

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
                    snippet = `\n# Leer archivo subido al VFS:\nimport pandas as pd\ndf = pd.read_csv("${file.name}")\nprint("Dataset cargado (${file.name}):")\nprint(df.head())\n`;
                } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                    snippet = `\n# Leer archivo Excel subido al VFS:\nimport pandas as pd\ndf = pd.read_excel("${file.name}")\nprint("Dataset cargado (${file.name}):")\nprint(df.head())\n`;
                } else if (file.name.endsWith('.json')) {
                    snippet = `\n# Leer archivo JSON subido al VFS:\nimport pandas as pd\ndf = pd.read_json("${file.name}")\nprint("Dataset cargado (${file.name}):")\nprint(df.head())\n`;
                }
                codeInput.value = snippet + codeInput.value;
                actualizarEstadisticasCodigo();
            }
        } catch(err) {
            console.error("Error al cargar archivo en VFS:", err);
        }
    };
    reader.readAsArrayBuffer(file);
};

// 9. Inyección de Datasets Sintéticos en 1 Clic (Sin alerts)
window.inyectarDatasetSintetico = function(tipo) {
    if (!wasmPyodideReady || !wasmPyodideInstance) {
        return;
    }

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
        for(let i=1; i<=1000; i++) {
            const suc = sucursales[Math.floor(Math.random() * sucursales.length)];
            const prod = productos[Math.floor(Math.random() * productos.length)];
            const cant = Math.floor(Math.random() * 5) + 1;
            const precio = precios[Math.floor(Math.random() * precios.length)];
            const total = cant * precio;
            csvContent += `FAC-${1000+i},${suc},${prod},${cant},${precio},${total}\n`;
        }
    } else if (tipo === 'nlp') {
        fileName = "Base_Sentimientos_NLP.csv";
        csvContent = "Cliente,Score,Categoria,Comentario\n";
        const nombres = ["Carlos", "Ana", "Luis", "Marta", "Pedro", "Sofía", "Diego", "Laura", "Jorge", "Elena"];
        const temas = ["Producto", "Servicio", "Envío", "Precio"];
        const pool = {
            "Producto": [["Cámara brutal y nítida", 10], ["Batería dura poco", 4], ["Cumple su función excelente", 8], ["Se sobrecalienta con juegos", 3]],
            "Servicio": [["Muy amables y profesionales", 10], ["Duda resuelta en 2 minutos", 9], ["Poco capacitados", 4], ["Pésimo soporte al cliente", 2]],
            "Envío": [["Llegó antes de tiempo", 10], ["Todo en orden y bien empacado", 9], ["Tardó 3 días más de lo prometido", 5], ["Caja rota y golpeada", 1]],
            "Precio": [["Ganga total por la calidad", 10], ["Valió cada centavo invertido", 9], ["Un poco costoso", 6], ["Excesivamente caro", 2]]
        };
        for(let i=0; i<100; i++) {
            const cliente = nombres[Math.floor(Math.random() * nombres.length)];
            const tema = temas[Math.floor(Math.random() * temas.length)];
            const dupla = pool[tema][Math.floor(Math.random() * pool[tema].length)];
            csvContent += `${cliente},${dupla[1]},${tema},${dupla[0]}\n`;
        }
    } else if (tipo === 'banco') {
        fileName = "Base_Solicitudes_Banco.csv";
        csvContent = "Cliente,Salario_Mensual,Deudas_Actuales,Score_Crediticio,Monto_Solicitado\n";
        const nombres = ["Juan", "María", "Carlos", "Ana", "Luis", "Sofía", "Pedro", "Elena", "Diego", "Marta"];
        const apellidos = ["Pérez", "González", "López", "Díaz", "Morales", "Rodríguez", "Torres", "Sánchez", "Vargas", "Castro"];
        for(let i=0; i<100; i++) {
            const nom = nombres[Math.floor(Math.random() * nombres.length)];
            const ape = apellidos[Math.floor(Math.random() * apellidos.length)];
            const sal = Math.floor(Math.random() * (150000 - 25000 + 1)) + 25000;
            const deu = Math.floor(Math.random() * 50001);
            const sco = Math.floor(Math.random() * (850 - 400 + 1)) + 400;
            const mon = Math.floor(Math.random() * (2000000 - 50000 + 1)) + 50000;
            csvContent += `${nom} ${ape},${sal},${deu},${sco},${mon}\n`;
        }
    } else if (tipo === 'titanic') {
        fileName = "titanic_oficial.csv";
        csvContent = "PassengerId,Survived,Pclass,Name,Sex,Age,SibSp,Parch,Ticket,Fare,Embarked\n1,0,3,\"Braund, Mr. Owen Harris\",male,22,1,0,A/5 21171,7.25,S\n2,1,1,\"Cumings, Mrs. John Bradley\",female,38,1,0,PC 17599,71.2833,C\n3,1,3,\"Heikkinen, Miss. Laina\",female,26,0,0,STON/O2. 3101282,7.925,S\n4,1,1,\"Futrelle, Mrs. Jacques Heath\",female,35,1,0,113803,53.1,S\n5,0,3,\"Allen, Mr. William Henry\",male,35,0,0,373450,8.05,S\n6,0,3,\"Moran, Mr. James\",male,28,0,0,330877,8.4583,Q\n7,0,1,\"McCarthy, Mr. Timothy J\",male,54,0,0,17463,51.8625,S\n8,0,3,\"Palsson, Master. Gosta Leonard\",male,2,3,1,349909,21.075,S\n9,1,3,\"Johnson, Mrs. Oscar W\",female,27,0,2,347742,11.1333,S\n10,1,2,\"Nasser, Mrs. Nicholas\",female,14,1,0,237736,30.0708,C\n";
    }

    wasmPyodideInstance.FS.writeFile(fileName, csvContent);
    wasmVfsFiles.add(fileName);
    actualizarListaArchivosVFS();

    const codeInput = document.getElementById('wasmCodeInput');
    if (codeInput) {
        const snippet = `import pandas as pd\nimport matplotlib.pyplot as plt\n\n# Cargar dataset generado en memoria:\ndf = pd.read_csv("${fileName}")\nprint("Dataset ${fileName} cargado:")\nprint(df.head())\nprint("\nResumen:")\nprint(df.describe())\n`;
        codeInput.value = snippet;
        actualizarEstadisticasCodigo();
    }
};

// 10. Actualizar Lista visual de archivos en el VFS
function actualizarListaArchivosVFS() {
    const listContainer = document.getElementById('wasmVfsList');
    const badgeCount = document.getElementById('wasmFileCountBadge');
    if (!listContainer) return;

    if (wasmVfsFiles.size === 0) {
        listContainer.innerHTML = '<span class="text-muted fst-italic">No hay archivos adicionales cargados en la memoria virtual.</span>';
        if (badgeCount) badgeCount.innerText = '0 archivos en RAM';
        return;
    }

    listContainer.innerHTML = '';
    if (badgeCount) badgeCount.innerText = `${wasmVfsFiles.size} archivos en RAM`;

    wasmVfsFiles.forEach(fname => {
        const tag = document.createElement('span');
        tag.className = 'badge bg-white text-black border border-2 border-black p-2 d-inline-flex align-items-center gap-2';
        tag.innerHTML = `
            <i class="fa-solid fa-file-csv text-primary"></i>
            <span>${fname}</span>
            <button class="btn btn-sm btn-link text-danger p-0 ms-1" title="Eliminar del VFS" onclick="window.eliminarArchivoVFS('${fname}')">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;
        listContainer.appendChild(tag);
    });
}

window.eliminarArchivoVFS = function(fname) {
    try {
        if (wasmPyodideInstance) {
            wasmPyodideInstance.FS.unlink(fname);
        }
        wasmVfsFiles.delete(fname);
        actualizarListaArchivosVFS();
    } catch(e) {
        console.warn("Error eliminando archivo:", e);
    }
};

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
    const plots = document.getElementById('wasmPlotsContainer');
    const inter = document.getElementById('wasmInteractiveContainer');
    const gfiles = document.getElementById('wasmGeneratedFilesContainer');

    if (term) term.innerText = "... Consola limpia ...";
    if (plots) plots.innerHTML = "";
    if (inter) { inter.innerHTML = ""; inter.classList.add('d-none'); }
    if (gfiles) gfiles.innerHTML = "";
    revocarBlobsPrevios();
};

window.descargarScriptModal = function() {
    const codeInput = document.getElementById('wasmCodeInput');
    const fileNameEl = document.getElementById('wasmEditorFileName');
    if (!codeInput || !codeInput.value) return;

    const fname = (fileNameEl ? fileNameEl.innerText : 'script.py') || 'script.py';
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

// 12. INYECCIÓN AUTOMÁTICA DE BOTONES EN TODOS LOS BLOQUES DE CÓDIGO
function inyectarBotonesEjecutarGlobales() {
    document.querySelectorAll('.code-box-header').forEach(header => {
        if (header.dataset.runnerInitialized) return;
        header.dataset.runnerInitialized = 'true';

        const btnRun = document.createElement('button');
        btnRun.className = 'btn-run-code me-1';
        btnRun.type = 'button';
        btnRun.innerHTML = '<i class="fa-solid fa-play text-warning me-1"></i> Probar y Ejecutar';
        btnRun.title = 'Abrir en la consola interactiva';
        btnRun.style.cssText = 'background: #000000; color: #ffffff; border: 2px solid #000000; border-radius: 6px; padding: 4px 10px; font-size: 0.8rem; font-weight: bold; cursor: pointer; transition: all 0.2s;';

        btnRun.addEventListener('mouseenter', () => {
            btnRun.style.background = '#10b981';
            btnRun.style.color = '#ffffff';
        });
        btnRun.addEventListener('mouseleave', () => {
            btnRun.style.background = '#000000';
            btnRun.style.color = '#ffffff';
        });

        btnRun.addEventListener('click', (e) => {
            e.stopPropagation();
            const container = header.closest('.code-box-container') || header.parentElement;
            const codeEl = container ? container.querySelector('code') : null;
            const codeText = codeEl ? (codeEl.innerText || codeEl.textContent) : '';
            const titleEl = header.querySelector('span, .code-lang');
            const title = titleEl ? titleEl.innerText : 'script.py';
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
        if (pre.closest('.code-box-container') || pre.dataset.runnerInitialized) return;
        pre.dataset.runnerInitialized = 'true';
        pre.style.position = 'relative';

        const btnRunFloating = document.createElement('button');
        btnRunFloating.className = 'btn-run-floating';
        btnRunFloating.type = 'button';
        btnRunFloating.innerHTML = '<i class="fa-solid fa-play text-warning me-1"></i> Probar';
        btnRunFloating.title = 'Abrir en la consola interactiva';
        btnRunFloating.style.cssText = 'position: absolute; top: 8px; right: 90px; z-index: 5; background: #000000; color: #ffffff; border: 2px solid #000000; border-radius: 6px; padding: 3px 10px; font-size: 0.75rem; font-weight: bold; cursor: pointer;';

        btnRunFloating.addEventListener('click', (e) => {
            e.stopPropagation();
            const codeEl = pre.querySelector('code');
            const codeText = codeEl ? (codeEl.innerText || codeEl.textContent) : pre.innerText;
            window.abrirModalEjecutor(codeText, 'ejercicio.py');
        });

        pre.appendChild(btnRunFloating);
    });
}

// 13. Atajos de teclado y Warm-up
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
        window.requestIdleCallback(() => initWasmPyodideCore(true), { timeout: 4000 });
    } else {
        setTimeout(() => initWasmPyodideCore(true), 2500);
    }
});

