// Reading fragments use external domains and never implement workspace exercises.
window.DQ_CURRICULUM_VERSION = "reasoning-v1";
window.DQ_SKILLS = [
  { id: "solve", label: "Resolver", icon: "◇" },
  { id: "read", label: "Interpretar", icon: "⌘" },
  { id: "build", label: "Construir", icon: "⌁" },
  { id: "verify", label: "Verificar", icon: "◎" },
  { id: "explain", label: "Explicar", icon: "↗" }
];
window.DQ_ACTS = [
  { name: "Fundamentos", subtitle: "De una idea a una acción", reward: "Pienso en pasos" },
  { name: "Datos en movimiento", subtitle: "Construye tu DevQuest Mini", reward: "Conecto causa y efecto" },
  { name: "Criterio con IA", subtitle: "Pregunta, inspecciona y comprueba", reward: "Reviso con evidencia" },
  { name: "La prueba de criterio", subtitle: "Transfiere lo aprendido", reward: "Defiendo mis decisiones" }
];

window.DQ_CURRICULUM = [
  {
    name: "Dibuja el objetivo", topic: "Entradas · acciones · resultados", skills: ["solve", "build", "explain"],
    goal: "Construye el HUD estático de DevQuest Mini: formulario, lista y contador. Todavía sin JavaScript.",
    outcome: "Puedes señalar dónde entra la información y dónde aparecerá el resultado.",
    concept: "Descomponer es separar lo que recibes, lo que haces y lo que entregas. Describe el comportamiento antes de decidir qué piezas necesitas.",
    analogy: "Antes de jugar, localizas minimapa, habilidades y marcador. El HUD conecta acciones y resultados.",
    planPrompt: "Enumera qué introduce el usuario, qué acción inicia el proceso y qué debería ver. Describe el recorrido antes de hablar de etiquetas.",
    reading: "const order = { drink: 'tea', quantity: 2 };\nconst receipt = order.drink;\nconsole.log(receipt);",
    quiz: { question: "En esta cafetería, ¿qué aparece en consola?", options: ["2", "tea", "order"], correct: 1, explanation: "receipt recibe el valor de drink. La cantidad existe, pero esta lectura no la utiliza." },
    checklist: ["Crear una estructura estática con HTML semántico y CSS propio", "Incluir Title, Category, Learning Note y Assistance con etiquetas asociadas", "Distinguir formulario, lista vacía y contador inicial"],
    testPrompt: "Recorre el formulario con Tab y pulsa sus etiquetas. Compara el foco esperado con lo observado.",
    agentTask: "Pide al agente revisar si la pantalla representa el flujo que describiste, sin modificar tus archivos.",
    hints: ["¿Qué necesita escribir o elegir el usuario?", "¿Dónde verá el resultado de su acción?", "¿Puedes recorrer todos los controles con el teclado?"],
    englishPrompt: "Describe what a user can enter and what your screen will show.", followup: "What does your screen not do yet?", transfer: "Explicar el recorrido de una persona por tu interfaz."
  },
  {
    name: "Dale forma a los datos", topic: "Valores · tipos · objetos", skills: ["solve", "read", "build"],
    goal: "Representa una misión como datos y muestra una de sus propiedades en tu HUD.", outcome: "Un cambio en tus datos produce un cambio que puedes señalar en pantalla.",
    concept: "Un objeto agrupa propiedades. El tipo de cada valor determina qué operaciones tienen sentido: un texto describe, un número cuenta y un booleano representa dos estados.",
    analogy: "Nombre, oro y estar vivo pertenecen al mismo campeón, pero responden preguntas diferentes.",
    planPrompt: "Describe las propiedades de una misión, sus tipos y qué propiedad mostrarás. Distingue el dato del nodo que lo presenta.",
    reading: "const pet = { name: 'Milo', asleep: false };\nconst label = pet.name;\npet.name = 'Luna';\nconsole.log(label, pet.name);",
    quiz: { question: "¿Qué valores se imprimen, en orden?", options: ["Luna Luna", "Milo Milo", "Milo Luna"], correct: 2, explanation: "label conserva el texto recibido antes del cambio; no mantiene una conexión automática con la propiedad." },
    checklist: ["Crear app.js y enlazarlo al HTML", "Modelar id, title, category, learningNote, assistance y completed", "Mostrar una propiedad en el DOM y comprobar un cambio de valor"],
    testPrompt: "Cambia un valor en memoria. Compara la pantalla antes y después de actualizar el nodo.", agentTask: "Pide una pregunta para distinguir objeto, propiedad y representación visual.",
    hints: ["¿Qué valor responde sí o no?", "¿Cambiar el objeto cambia por sí solo la pantalla?", "¿Qué referencia corresponde al dato y cuál al nodo?"],
    englishPrompt: "Describe one property of your quest and explain its type.", followup: "Does changing a value update the screen automatically? Why?", transfer: "Distinguir los datos de su representación."
  },
  {
    name: "Toma una decisión", topic: "Condiciones · booleanos · límites", skills: ["solve", "read", "verify"],
    goal: "Haz que una misión de prueba se vea diferente según esté pendiente o completada.", outcome: "Una misma tarjeta muestra dos estados controlados por una regla.",
    concept: "Una condición selecciona un camino. Describe cuándo es verdadera y comprueba también el camino contrario y los límites.", analogy: "Lanzar una habilidad depende de tener maná y terminar el enfriamiento. Una condición incumplida cambia la decisión.",
    planPrompt: "Describe el resultado para completed verdadero y falso. Separa la decisión de su apariencia.", reading: "const age = 12;\nconst allowed = age >= 12;\nconsole.log(allowed ? 'enter' : 'wait');",
    quiz: { question: "¿Qué sucede exactamente en el límite de 12?", options: ["enter", "wait", "El resultado es 12"], correct: 0, explanation: "La comparación incluye la igualdad. Probar el límite distingue >= de >." },
    checklist: ["Definir las apariencias pendiente y completada", "Usar el booleano para decidir qué estado presentar", "Probar ambos valores sin cambiar a mano el HTML de la tarjeta"],
    testPrompt: "Registra ambos estados. ¿Puedes reconocerlos sin depender únicamente del color?", agentTask: "Pide un caso límite de una regla y predice su resultado.",
    hints: ["¿Qué pregunta de sí o no controla la apariencia?", "¿Estás comparando un booleano con un texto?", "¿Qué se mantiene igual entre ambos estados?"],
    englishPrompt: "Explain the rule that changes your quest's appearance.", followup: "What would happen if completed were the text 'false'?", transfer: "Convertir una regla en decisiones comprobables."
  },
  {
    name: "Una regla, muchas veces", topic: "Funciones · parámetros · recorridos", skills: ["solve", "read", "build"],
    goal: "Muestra varias misiones desde un array mediante una función de renderizado.", outcome: "Añades un objeto y aparece sin copiar otra tarjeta a mano.",
    concept: "Una función da nombre a una tarea. Un recorrido aplica una operación a cada elemento. Identifica qué recibe la tarea y qué produce o modifica.", analogy: "La tienda dibuja cada espacio del inventario aplicando la misma regla a distintos ítems.",
    planPrompt: "Describe cómo representarás varias misiones, qué harás con cada una y qué pasará al renderizar dos veces.", reading: "function double(value) {\n  return value * 2;\n}\nconst scores = [2, 4];\nconsole.log(scores.map(double));",
    quiz: { question: "¿Cuál es el resultado?", options: ["[2, 4, 2, 4]", "[4, 8]", "12"], correct: 1, explanation: "La función recibe cada número y devuelve su doble. El resultado es otra colección." },
    checklist: ["Representar al menos tres misiones distintas en un array", "Crear una función que dibuje la colección completa", "Probar dos renderizados seguidos y una colección vacía"],
    testPrompt: "Prueba con cero, una y tres misiones. Renderiza dos veces y compara las cantidades.", agentTask: "Pide al agente hacerte seguir una iteración, sin escribir tu función.",
    hints: ["¿Qué unidad de trabajo se repite?", "¿Qué queda del renderizado anterior?", "¿Qué debería verse con el array vacío?"],
    englishPrompt: "Explain what your rendering function receives and changes.", followup: "Why should calling it twice not duplicate the list?", transfer: "Reutilizar una regla sobre una colección."
  },
  {
    name: "Conecta la acción", topic: "Eventos · validación · flujo", skills: ["solve", "build", "verify"],
    goal: "Conecta el formulario con la creación de una misión válida y su aparición en pantalla.", outcome: "Una acción recorre entrada → validación → datos → pantalla.",
    concept: "Un evento inicia un flujo. Validar decide qué entradas aceptas antes de cambiar los datos. Rechazar una entrada debe dejar el estado coherente.", analogy: "Comprar es una intención: la tienda comprueba primero si tienes oro y espacio.",
    planPrompt: "Enumera el camino válido y el inválido. Incluye qué se conserva y qué se limpia al final.", reading: "const nickname = '   ';\nconst cleaned = nickname.trim();\nconsole.log(cleaned.length > 0);",
    quiz: { question: "¿Queda un nombre después de limpiar esta entrada?", options: ["Sí: tiene tres espacios", "Sí: es un string", "No: la comparación da false"], correct: 2, explanation: "trim elimina los espacios de los extremos. Aquí no queda ningún carácter." },
    checklist: ["Capturar el envío sin perder el estado de la página", "Validar los campos antes de crear una misión con identidad propia", "Mostrar la nueva misión y limpiar el formulario tras una creación válida"],
    testPrompt: "Prueba un título válido, uno vacío y uno con espacios. Compara las cantidades esperadas y observadas.", agentTask: "Presenta tus criterios de aceptación y pide una entrada que olvidaste considerar.",
    hints: ["¿Cuándo decides si la entrada es aceptable?", "¿Una entrada inválida debería modificar el array?", "¿Qué hace el formulario de forma predeterminada?"],
    englishPrompt: "Describe a valid submission and an invalid one.", followup: "Why is a string of spaces not a useful title?", transfer: "Conectar una intención con un flujo seguro."
  },
  {
    name: "Una fuente de verdad", topic: "Identidad · estado · conteos", skills: ["read", "build", "verify"],
    goal: "Permite alternar una misión y derivar el contador de las completadas.", outcome: "La tarjeta y el contador cuentan la misma historia.",
    concept: "La identidad permite encontrar una entidad aunque cambie de posición. Un valor derivado se calcula desde los datos actuales y evita duplicar el mismo hecho.", analogy: "El marcador refleja los objetivos asegurados; cambiar solo su dibujo no cambia la partida.",
    planPrompt: "Describe cómo identificarás la misión pulsada, qué dato cambiará y de dónde saldrá el contador. Incluye desmarcar.", reading: "const items = [{ packed: true }, { packed: false }];\nconst count = items.filter(item => item.packed).length;\nconsole.log(count, '7' === 7);",
    quiz: { question: "¿Qué resultados aparecen?", options: ["1 false", "2 true", "1 true"], correct: 0, explanation: "Solo un elemento cumple la condición. La igualdad estricta distingue texto y número." },
    checklist: ["Cambiar el estado de la misión seleccionada y de ninguna otra", "Actualizar su apariencia al marcar y desmarcar", "Calcular el contador desde el estado actual"],
    testPrompt: "Alterna una misión dos veces y luego otra. Registra tarjeta y contador en cada paso.", agentTask: "Pide una revisión de identidad y tipos mediante preguntas.",
    hints: ["¿Posición e identidad significan lo mismo?", "¿Los identificadores comparados tienen el mismo tipo?", "¿El contador se calcula o mantiene una copia?"],
    englishPrompt: "Explain how a click affects the data and the counter.", followup: "What happens when you click the same quest again?", transfer: "Rastrear un cambio sin perder coherencia."
  },
  {
    name: "Que sobreviva al regreso", topic: "Persistencia · formatos · recuperación", skills: ["solve", "build", "verify"],
    goal: "Conserva las misiones al recargar y contempla una primera visita sin datos.", outcome: "Cierras, vuelves y encuentras tus misiones en el mismo estado.",
    concept: "La memoria de ejecución y el almacenamiento tienen vidas distintas. Guardar y recuperar exige un formato y una decisión para datos ausentes o ilegibles.", analogy: "Una configuración guardada dura más que una sesión. Al volver necesitas recuperar una configuración válida.",
    planPrompt: "Enumera cuándo cambian los datos, cuándo los guardarás y cómo iniciarás con y sin información previa.", reading: "const original = { volume: 3 };\nconst text = JSON.stringify(original);\nconst restored = JSON.parse(text);\nconsole.log(typeof text, restored.volume);",
    quiz: { question: "¿Qué muestra la consola?", options: ["object 3", "string 3", "string undefined"], correct: 1, explanation: "El formato guardado es texto. Al interpretarlo recuperas una estructura con la propiedad volume." },
    checklist: ["Guardar después de cada cambio que deba persistir", "Recuperar y mostrar el estado al iniciar", "Comprobar una primera visita y decidir cómo informar un fallo de lectura"],
    testPrompt: "Crea, completa y recarga. Después prueba sin datos guardados usando un entorno de prueba o un respaldo.", agentTask: "Pide un escenario de fallo de almacenamiento y razona la experiencia del usuario.",
    hints: ["¿Cuándo se modifica el estado?", "¿Qué formato acepta tu almacenamiento?", "¿No tener datos indica un error o una primera visita?"],
    englishPrompt: "Explain what is saved and how the screen recovers it.", followup: "What should happen if there is no saved data?", transfer: "Pensar en la vida de los datos y sus fallos."
  },
  {
    name: "Boss · Sigue el recorrido", topic: "Integración · trazado · evidencia", skills: ["solve", "read", "verify", "explain"], boss: true,
    goal: "Demuestra el MVP completo y explica el recorrido de una misión hasta una recarga.", outcome: "Relacionas cada resultado visible con el dato y la decisión que lo causaron.",
    concept: "Comprender un sistema implica seguir un caso de principio a fin y comprobar los acuerdos entre sus piezas.", analogy: "En la revisión de partida explicas la secuencia: visión, decisión, acción y resultado.",
    planPrompt: "Traza entrada, validación, creación, renderizado, alternancia, contador, guardado y recuperación de una misión.", reading: "let fuel = 5;\nfunction drive(distance) { fuel -= distance; }\ndrive(2);\ndrive(1);\nconsole.log(fuel);",
    quiz: { question: "¿Cuál es el estado final?", options: ["5: las funciones no cambian datos", "1: solo cuenta la última llamada", "2: ambas llamadas afectan el mismo estado"], correct: 2, explanation: "El estado compartido cambia en cada llamada. Seguir la secuencia explica el resultado." },
    checklist: ["Demostrar las cinco funciones del MVP en el navegador", "Señalar el recorrido en tu código con una explicación propia", "Probar lista vacía, entrada inválida, alternancia y recarga; guardar captura o commit"],
    testPrompt: "Registra una secuencia completa y un caso que tuviste que corregir.", agentTask: "Pide una pregunta imprevista y un cambio pequeño del requisito; explica el impacto antes de programar.",
    hints: ["¿Qué inicia la secuencia?", "¿Qué piezas leen y cuáles modifican datos?", "¿Puedes explicar un fallo con una observación?"],
    englishPrompt: "Give a short demo of your app and one thing you verified.", followup: "Where would you look first if the counter were wrong?", transfer: "Defender el comportamiento de una aplicación completa."
  },
  {
    name: "Dale una misión al agente", topic: "Contexto · alcance · aceptación", skills: ["solve", "verify", "explain"],
    goal: "Define una mejora pequeña de DevQuest Mini y revisa el plan del agente antes de implementarla tú.", outcome: "Tienes una tarea acotada con criterios observables para darla por terminada.",
    concept: "Una petición útil comunica problema, contexto, límites y resultados comprobables. El plan del agente también necesita revisión.", analogy: "Una llamada útil indica objetivo, recursos y condición de retirada. 'Jueguen mejor' no basta.",
    planPrompt: "Elige una mejora pequeña. Escribe comportamiento, límites y tres criterios de aceptación.", reading: "const request = { scope: 'search', allowDelete: false };\nconst proposal = { action: 'delete' };\nconsole.log(request.allowDelete && proposal.action === 'delete');",
    quiz: { question: "¿La condición permite la propuesta de borrado?", options: ["No: el resultado es false", "Sí: mencionar delete lo permite", "Sí: toda propuesta amplía el alcance"], correct: 0, explanation: "El permiso es falso. Una propuesta no amplía por sí sola el alcance acordado." },
    checklist: ["Escribir contexto, objetivo, límites y tres criterios observables", "Solicitar un plan sin código y detectar una suposición", "Implementar tú la mejora y contrastarla con los criterios"],
    testPrompt: "Compara cada criterio con una observación e identifica algo fuera de alcance.", agentTask: "Pide preguntas y un plan sin código. Acepta o corrige cada paso con una razón.",
    hints: ["¿Cómo sabrás que terminó?", "¿Qué información está suponiendo el agente?", "¿El plan respeta tus límites de práctica?"],
    englishPrompt: "Describe the task you gave your agent and an acceptance criterion.", followup: "What did you deliberately keep out of scope?", transfer: "Dirigir una tarea sin delegar tu criterio."
  },
  {
    name: "Lee antes de aceptar", topic: "Dependencias · efectos · diffs", skills: ["read", "verify", "explain"],
    goal: "Revisa un diff de tu mejora y explica el efecto de los cambios antes de darla por terminada.", outcome: "Justificas las líneas cambiadas por su efecto en el comportamiento.",
    concept: "Revisar requiere identificar entradas, resultados y efectos. Un diff pequeño ayuda a conectar intención y consecuencias.", analogy: "Cambiar un ítem altera estadísticas concretas. Su nombre no explica qué ganaste y qué perdiste.",
    planPrompt: "Identifica las funciones afectadas, sus entradas y sus efectos. Predice un comportamiento que podría romperse.", reading: "const prices = [3, 1, 2];\nconst ordered = prices.sort();\nconsole.log(prices[0], ordered[0]);",
    quiz: { question: "Para estos números de un dígito, ¿qué se imprime?", options: ["3 1", "1 1", "3 3"], correct: 1, explanation: "sort modifica el array original y devuelve esa misma referencia. Revisa efectos además del valor devuelto." },
    checklist: ["Leer tu diff y relacionar los cambios con un criterio", "Identificar una lectura y una modificación de datos", "Detectar un cambio innecesario o justificar por qué todos aportan"],
    testPrompt: "Contrasta una predicción del diff con el navegador. Conserva la referencia del diff o commit.", agentTask: "Pide una revisión en modo lectura y comprueba una suposición señalada.",
    hints: ["¿La operación devuelve, modifica o hace ambas cosas?", "¿Quién más usa esos datos?", "¿Cada cambio tiene una razón?"],
    englishPrompt: "Explain a change in your diff and its effect on the user.", followup: "What could break elsewhere because of that change?", transfer: "Leer cambios y anticipar sus efectos."
  },
  {
    name: "Investiga el fallo", topic: "Reproducción · hipótesis · experimentos", skills: ["solve", "read", "verify"],
    goal: "Investiga un fallo reproducible usando observaciones y una hipótesis cada vez.", outcome: "Explicas la causa y qué prueba demuestra la corrección.",
    concept: "Depurar empieza con un caso reproducible. Una hipótesis propone una causa; un experimento debe poder confirmarla o descartarla.", analogy: "Antes de culpar al daño, revisas nivel, objetos y secuencia en la repetición.",
    planPrompt: "Describe esperado, observado, pasos mínimos y una posible causa. Sin bug pendiente, acuerda una alteración temporal que tú harás y revertirás.", reading: "const label = '10';\nconst next = label + 1;\nconsole.log(next);",
    quiz: { question: "¿Qué resultado te invita a inspeccionar el tipo?", options: ["11", "NaN", "101"], correct: 2, explanation: "Con este string, + concatena texto. Inspeccionar el tipo permite explicar el resultado." },
    checklist: ["Reproducir un fallo con pasos mínimos", "Comprobar una hipótesis inspeccionando valores, tipos o ejecución", "Corregir tú la causa y repetir el caso y otro que ya funcionaba"],
    testPrompt: "Registra antes y después con la misma entrada y la observación que comprobó tu hipótesis.", agentTask: "Comparte reproducción e hipótesis. Pide una pregunta diagnóstica por turno, sin parches.",
    hints: ["¿Puedes repetirlo con menos pasos?", "¿Qué observación contradice tu expectativa?", "¿Tu experimento podría demostrar que estabas equivocado?"],
    englishPrompt: "Explain a bug, its cause, and your verification after the fix.", followup: "What evidence ruled out another possible cause?", transfer: "Depurar con evidencia en lugar de adivinar."
  },
  {
    name: "Boss · Comprueba al copiloto", topic: "Afirmaciones · contraejemplos · regresión", skills: ["read", "verify", "explain"], boss: true,
    goal: "Acepta, limita o rechaza una afirmación del agente sobre tu app mediante una prueba.", outcome: "Tu decisión cita una observación y declara lo que sigue sin verificarse.",
    concept: "Una respuesta razonable aún necesita comprobarse. Un contraejemplo invalida una afirmación general; una prueba exitosa cubre sus condiciones concretas.", analogy: "Ganar una pelea no demuestra que la misma entrada funcione sin visión o con otros enfriamientos.",
    planPrompt: "Solicita una revisión y separa afirmaciones verificables de opiniones. Elige una afirmación para probarla.", reading: "function first(values) { return values[0]; }\nconsole.log(first([]));",
    quiz: { question: "Alguien dice que first siempre devuelve un número. ¿Qué aporta este caso?", options: ["Un contraejemplo: devuelve undefined", "Demuestra que siempre devuelve cero", "Demuestra que todos los casos funcionan"], correct: 0, explanation: "La colección vacía contradice 'siempre'. Falta decidir qué debe ocurrir si no hay elementos." },
    checklist: ["Registrar una afirmación concreta del agente", "Probar un caso normal, uno límite y uno inválido cuando aplique", "Documentar tu decisión, sus resultados y una limitación"],
    testPrompt: "Registra afirmación, prueba y observación. Explica qué condiciones no comprobaste.", agentTask: "Pide una conclusión con supuestos y pregunta qué evidencia le haría cambiar de opinión.",
    hints: ["¿La afirmación dice siempre o nunca?", "¿Cuál es el contraejemplo más pequeño?", "¿Qué sigue sin verificarse?"],
    englishPrompt: "Explain whether you accepted the agent's claim, with one observation.", followup: "What remains unverified?", transfer: "Aceptar propuestas por razones comprobables."
  },
  {
    name: "Cruza la frontera", topic: "Asincronía · contratos · fallos", skills: ["solve", "read", "build", "verify"],
    goal: "Construye un panel pequeño con una operación asíncrona de prueba y estados de carga, éxito y error.", outcome: "La pantalla comunica lo que sucede aunque el resultado tarde o falle.",
    concept: "Una operación asíncrona puede terminar después que el resto del flujo. Define datos esperados, fallos y representación de la espera.", analogy: "Entrar en cola no significa que empezó la partida: hay espera, confirmación o cancelación.",
    planPrompt: "Usa datos ficticios, sin credenciales ni servicios de pago. Describe cómo provocarás espera, resultado válido y rechazo.", reading: "console.log('A');\nPromise.resolve('B').then(value => console.log(value));\nconsole.log('C');",
    quiz: { question: "¿En qué orden se imprimen?", options: ["A B C", "A C B", "B A C"], correct: 1, explanation: "El callback de then se ejecuta después del código síncrono de este fragmento." },
    checklist: ["Crear un panel propio de práctica con datos ficticios en stage-2-streaming-crm", "Representar espera, éxito y error", "Simular respuestas válidas y fallidas sin servicios externos"],
    testPrompt: "Provoca cada estado y compara su apariencia con lo esperado. Considera una respuesta de formato inesperado.", agentTask: "Pide revisar el contrato y los fallos antes de discutir bibliotecas.",
    hints: ["¿Qué se ve mientras esperas?", "¿Fallo y respuesta vacía significan lo mismo?", "¿Qué compruebas antes de usar los datos?"],
    englishPrompt: "Explain how your screen handles waiting, success, and failure.", followup: "What if the response had the wrong shape?", transfer: "Razonar sobre resultados que llegan después."
  },
  {
    name: "Elige con una razón", topic: "Modelado · relaciones · decisiones", skills: ["solve", "read", "explain"],
    goal: "Modela una cuenta y sus perfiles ficticios; justifica tu representación según las necesidades del panel.", outcome: "Defiendes tu modelo por las consultas y cambios que debe permitir.",
    concept: "Modelar es decidir entidades, identidades y relaciones. Compara tus decisiones con necesidades concretas y posibles inconsistencias.", analogy: "Duplicar el inventario de un campeón en dos marcadores exige sincronizar ambas copias.",
    planPrompt: "Dibuja entidades y relaciones. Explica qué se repetiría y qué pasa al renombrar o retirar una cuenta.", reading: "const author = { id: 4, name: 'Ada' };\nconst book = { title: 'Patterns', authorId: 4 };\nconsole.log(book.authorId === author.id);",
    quiz: { question: "¿Qué conecta el libro con su autora?", options: ["Su posición en un array", "El título", "La coincidencia de identificadores"], correct: 2, explanation: "authorId expresa una relación por identidad, independiente del nombre." },
    checklist: ["Dibujar cuenta, perfiles y sus relaciones", "Mostrar datos ficticios y una consulta útil en tu panel", "Comparar dos modelos y explicar un beneficio y un costo del elegido"],
    testPrompt: "Prueba un cambio de nombre y una referencia inexistente. Compara esperado y observado.", agentTask: "Pide alternativas sin implementación. Decide según tus consultas y documenta un compromiso.",
    hints: ["¿Qué identifica una entidad si cambia de nombre?", "¿Dónde se repite información?", "¿Qué pasa con los perfiles si falta su cuenta?"],
    englishPrompt: "Explain your data model and one trade-off.", followup: "What requirement would make you reconsider?", transfer: "Elegir estructuras por sus consecuencias."
  },
  {
    name: "Transfiere la habilidad", topic: "Problema nuevo · adaptación", skills: ["solve", "read", "build", "verify"],
    goal: "Aplica lo aprendido a una regla nueva del panel: un filtro o una alerta con datos ficticios.", outcome: "Resuelves una variación sin depender de los nombres del ejercicio anterior.",
    concept: "Transferir es reconocer una estructura conocida en otro contexto. Define reglas y ejemplos antes de buscar la sintaxis necesaria.", analogy: "Rotar con otro campeón exige reconocer el mapa aunque cambien las habilidades.",
    planPrompt: "Elige una sola regla. Define entradas, resultado y límites; resuelve un ejemplo manualmente.", reading: "const temperatures = [18, 25, 30];\nconst warm = temperatures.filter(value => value >= 25);\nconsole.log(warm.length);",
    quiz: { question: "¿Cuántos elementos cumplen la regla?", options: ["2", "1", "3"], correct: 0, explanation: "25 y 30 cumplen >= 25. La estructura de selección puede aplicarse a distintos dominios." },
    checklist: ["Definir la regla y resolver un ejemplo a mano", "Implementar tú una función y conectar su resultado a la pantalla", "Probar un caso normal, uno de frontera y uno sin coincidencias"],
    testPrompt: "Compara el cálculo manual con tu función y prueba una variante nueva.", agentTask: "Pide un cambio pequeño de requisito y predice qué lógica debe adaptarse.",
    hints: ["¿Qué idea ya usaste antes?", "¿Qué ocurre justo en el límite?", "¿Puedes describir la regla sin nombrar un lenguaje?"],
    englishPrompt: "Explain an idea you reused in a new problem.", followup: "Which part changed, and which stayed the same?", transfer: "Aplicar fundamentos en otro contexto."
  },
  {
    name: "Boss · Defiende tu proyecto", topic: "Demostración · revisión · comunicación", skills: ["solve", "read", "build", "verify", "explain"], boss: true,
    goal: "Presenta el proyecto, interpreta su código y resuelve un cambio pequeño razonado primero.", outcome: "Muestras, interpretas, compruebas y explicas decisiones con palabras propias.",
    concept: "La evidencia de aprendizaje combina comportamiento observable, explicación y adaptación. Declarar límites también forma parte de una buena entrega.", analogy: "La revisión final explica cómo decidiste y cómo ajustarías la siguiente partida.",
    planPrompt: "Prepara una demo, un recorrido de datos y tres comprobaciones. El mentor elegirá después una variación pequeña.", reading: "function average(values) {\n  return values.reduce((sum, value) => sum + value, 0) / values.length;\n}\nconsole.log(average([]));",
    quiz: { question: "¿Qué caso debe discutir esta revisión?", options: ["Siempre devuelve cero", "La colección vacía produce NaN: falta decidir su manejo", "El nombre garantiza un promedio válido"], correct: 1, explanation: "La suma y la cantidad son cero. 0/0 produce NaN; hace falta definir el comportamiento deseado." },
    checklist: ["Demostrar el proyecto y señalar una ruta de datos en tu código", "Responder una pregunta nueva e implementar tú una variación razonada", "Entregar comprobaciones, una limitación y un commit en inglés revisado"],
    testPrompt: "Registra el cambio, las pruebas antes y después y lo pendiente. Añade la referencia de tu entrega.", agentTask: "Pide una revisión final con lectura, cambio de requisito, evidencia y seguimiento en inglés.",
    hints: ["¿Defiendes tu decisión con un caso concreto?", "¿Qué evidencia te haría cambiar de opinión?", "¿Qué puedes explicar ahora que antes no podías?"],
    englishPrompt: "Present your project: what it does, a decision, and a limitation. Use 1–3 sentences.", followup: "What would you improve next, and why?", transfer: "Defender una entrega con criterio e inglés claro."
  }
].map((level, index) => ({ ...level, id: index + 1, act: Math.floor(index / 4), xp: level.boss ? 200 : 100, workspace: index < 12 ? "workspaces/stage-1-devquest-mini/" : "workspaces/stage-2-streaming-crm/" }));

window.DQ_ENGLISH_DRILLS = [
  { title: "Daily standup", badge: "Explain", context: "Cuenta una acción real, su resultado y tu siguiente paso. Después responde sin leer la plantilla.", template: "I worked on [task]. I checked [result]. Next, I will [step].", prompt: "Follow-up: What is still unclear?" },
  { title: "Describe a bug", badge: "Verify", context: "Distingue lo que observaste de lo que suponías y cita una comprobación.", template: "I expected [result], but observed [behavior]. I checked [evidence] and found [cause].", prompt: "Follow-up: How did you verify the fix?" },
  { title: "Review your agent", badge: "Decide", context: "Acepta o cuestiona una propuesta con una razón concreta.", template: "The agent suggested [idea]. I accepted / questioned it because [reason]. I verified [case].", prompt: "Follow-up: What assumption could be wrong?" },
  { title: "Explain a trade-off", badge: "Reason", context: "Explica con palabras sencillas para que otra persona siga tu razonamiento.", template: "I chose [approach] because [need]. The downside is [cost]. I would reconsider if [condition].", prompt: "Follow-up: What alternative did you consider?" }
];
