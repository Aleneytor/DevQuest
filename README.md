# DevQuest — aprender a pensar, construir y explicar

Campaña personal para desarrollar lógica, interpretar y escribir código, verificar propuestas de agentes de IA y comunicar decisiones en inglés. Las tecnologías son herramientas de práctica; el avance se mide con entregas que puedes explicar y comprobar.

Abre `platform-ui/index.html` en tu navegador. No requiere instalación, compilación ni cuenta. El dictado es opcional y depende del navegador y sus permisos; siempre puedes escribir. Los datos se guardan en este navegador y origen: exporta antes de cambiar de navegador, dispositivo o dirección local.

## Campaña de 16 niveles

| Acto | Niveles | Evidencia principal |
| --- | --- | --- |
| Fundamentos | 1–4 | Entradas y salidas, datos, decisiones, funciones y recorridos |
| Datos en movimiento | 5–8 | Formularios, estado, persistencia y demo del MVP |
| Criterio con IA | 9–12 | Especificación, revisión de diffs, depuración y contraste de afirmaciones |
| La prueba de criterio | 13–16 | Asincronía, modelado, transferencia y defensa del proyecto |

Cada misión recorre: razonar → interpretar → construir → comprobar → explicar → revisar. Primero escribes un plan; después accedes a una lectura breve de otro dominio. Los jefes exigen una referencia de evidencia y una demostración. Consultar sintaxis está permitido; el mentor nunca resuelve tus archivos de práctica.

## Avance que significa algo

- 100 XP por misión normal; 200 XP por jefe. Solo se otorgan al cerrar una entrega con todos los registros y tu confirmación de revisión.
- Las cinco barras cuentan misiones revisadas asociadas a resolver, interpretar, construir, verificar y explicar. No certifican dominio profesional.
- Cada acto completado concede un hito. El rango de campaña sube cada cuatro entregas.
- La racha mide actividad de inglés, no calidad. La revisión incluye standup de 1–3 frases, seguimiento y segundo intento tras feedback.
- La revisión ocurre en el chat del mentor. Copia la entrega desde la plataforma y registra el feedback al volver. No hay evaluación automática del código ni un agente conectado a esta página.
- Los mínimos de texto solo detectan borradores; la revisión humana o del mentor evalúa su calidad.

## Zonas

- `platform-ui/`: aplicación de aprendizaje; la IA puede mejorar su código sin incluir soluciones a ejercicios.
- `workspaces/stage-1-devquest-mini/`: tu MVP y sus mejoras, niveles 1–12. Tú escribes el código.
- `workspaces/stage-2-streaming-crm/`: panel pequeño con datos ficticios, niveles 13–16. Tú escribes el código; el stack puede acordarse con el mentor según el problema.
- `workspaces/stage-3-rust-arena/`: reservado para una profundización opcional futura. Rust no es requisito de la campaña.
- `.antigravity/agents/`: instrucciones para el mentor y el coach.

## Datos y compatibilidad

La campaña usa `devquest_nexus_state_v3` y la versión de currículo `reasoning-v1`. El estado anterior de `devquest_nexus_state_v2` se conserva intacto y se archiva dentro del nuevo respaldo: sus niveles no equivalen a estos retos. Puedes descargar ese historial desde el aviso de migración. Importar un respaldo antiguo conserva la campaña actual. Importar uno actual o reiniciar descarga primero una copia del estado previo.

`PROGRESS.md` es el mapa de referencia del repositorio, no se sincroniza automáticamente con el navegador. Confirma tu nivel en la plataforma o comparte una entrega exportada con tu mentor.

## Verificación local

Con Node.js disponible, ejecuta `node --test platform-ui/tests/platform.test.cjs`. La aplicación no necesita Node para funcionar.