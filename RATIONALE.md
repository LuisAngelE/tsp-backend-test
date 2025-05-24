# Justificación del Diseño e Implementación del Proyecto TSP con NestJS y TypeScript

## Introducción

Este proyecto tiene como objetivo implementar una solución para el problema del Viajante de Comercio (Traveling Salesman Problem - TSP) utilizando TypeScript y principios de programación orientada a objetos (OOP). La solución se integra en una API RESTful desarrollada con NestJS, ofreciendo dos endpoints: uno para generar ciudades aleatorias y otro para resolver la ruta más corta entre ellas.

---

## Diseño y Estructura del Proyecto

### Separación de responsabilidades

- **`WorldGenerator`**  
  Encargada de generar ciudades con coordenadas aleatorias dentro de un plano 2D definido.

- **`TspSolver`**  
  Contiene la lógica para resolver el problema TSP utilizando una heurística aproximada.

- **`TspService`**  
  Actúa como capa intermedia entre los controladores y las clases de dominio, orquestando el flujo de datos y lógica.

### Estructura Modular

La estructura del proyecto sigue una arquitectura orientada a dominios (Domain-Driven Design), lo que facilita la mantenibilidad y escalabilidad futura.

### DTOs (Data Transfer Objects)

Se utilizan DTOs para validar y tipar tanto las solicitudes como las respuestas de los endpoints, lo que aumenta la robustez y claridad de la API.

### Resumen de Clases

| Clase            | Responsabilidad Principal                                 |
| ---------------- | --------------------------------------------------------- |
| `WorldGenerator` | Generar ciudades y sus coordenadas                        |
| `TspSolver`      | Calcular la ruta más corta usando un algoritmo heurístico |
| `TspService`     | Orquestar lógica entre generación y solución del TSP      |

---

## Algoritmo para Resolver el TSP

### Elección del algoritmo

Se optó por el **heurístico del vecino más cercano (Nearest Neighbor)** debido a:

- **Simplicidad:** Fácil de implementar y entender.
- **Eficiencia:** Complejidad O(N²), adecuada para entre 10 y 20 ciudades.
- **Resultados razonables:** Produce soluciones suficientemente buenas en tiempos reducidos.

### Descripción del algoritmo

1. Se parte desde la primera ciudad.
2. En cada paso, se elige la ciudad no visitada más cercana.
3. Se mantiene un conjunto `visited` para evitar repeticiones.
4. Al terminar, se regresa a la ciudad de origen.
5. Se acumula la distancia total y se devuelve junto con la ruta.

### Limitaciones

- No garantiza la ruta óptima global.
- Puede no ser eficaz con grandes cantidades de ciudades o distribuciones particulares.
- Futuras versiones podrían usar metaheurísticas más avanzadas (ej. algoritmo genético, búsqueda tabú, etc.).

---

## Cálculo de Distancias

- Las ciudades se ubican en un plano 2D limitado por los parámetros `worldBoundX` y `worldBoundY`.
- Se usa la distancia Euclidiana para calcular las distancias entre ciudades:

\[
d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}
\]

- Las distancias se precalculan y se almacenan como un arreglo de objetos `{from, to, distance}` para optimizar el rendimiento.

---

## API Endpoints

### 1. `POST /api/tsp/generate-cities`

Genera un conjunto de ciudades con nombres únicos y coordenadas aleatorias, y calcula todas las distancias entre pares.

**Request:**

```json
{
    "numCities": 10,
    "worldBoundX": 100,
    "worldBoundY": 100
}
```

**Response:**

```json
{
    "cities": ["A", "B", "C"],
    "distances": [
        {
            "from": "A",
            "to": "B",
            "distance": 31.62
        },
        {
            "from": "A",
            "to": "C",
            "distance": 66.1
        },
        {
            "from": "B",
            "to": "C",
            "distance": 45.4
        }
    ]
}
```

---

### 2. `POST /api/tsp/solve`

Recibe las ciudades y sus distancias para resolver el TSP y devuelve la ruta ordenada junto con la distancia total.

**Request:**

```json
{
    "cities": ["A", "B", "C"],
    "distances": [
        {
            "from": "A",
            "to": "B",
            "distance": 31.62
        },
        {
            "from": "A",
            "to": "C",
            "distance": 66.1
        },
        {
            "from": "B",
            "to": "C",
            "distance": 45.4
        }
    ]
}
```

**Response:**

```json
{
    "route": ["A", "B", "C", "A"],
    "totalDistance": 143.12
}
```

---

## Principios de OOP Aplicados

- **Encapsulamiento:** Cada clase oculta su lógica interna y expone solo métodos públicos relevantes.
- **Responsabilidad única:** Cada clase tiene una única responsabilidad claramente definida.
- **Modularidad:** El diseño favorece la separación de funcionalidades y la fácil extensión.
- **Reutilización:** Las clases pueden ser utilizadas en otros contextos o proyectos.

---

## Pruebas Unitarias

Se implementaron pruebas unitarias para garantizar la confiabilidad del sistema, incluyendo:

- Generación de ciudades dentro de los límites definidos.
- Cálculo correcto de distancias Euclidianas.
- Funcionamiento del algoritmo con distintos tamaños de entrada.

Estas pruebas permiten detectar errores rápidamente y facilitan futuras refactorizaciones.

---

## Posibles Mejoras Futuras

- Implementar algoritmos más sofisticados como:
    - Genético
    - Simulated Annealing
    - Branch and Bound
- Optimizar el almacenamiento de distancias (por ejemplo, usando una matriz de adyacencia).
- Paralelizar la ejecución del solver.
- Permitir elegir entre distintos algoritmos a través de parámetros del endpoint.

---

## Conclusión

Este proyecto demuestra un equilibrio entre claridad de diseño, modularidad y eficiencia. La elección de un algoritmo heurístico simple permitió centrarse en una buena arquitectura y buenas prácticas de desarrollo. La solución es extensible y puede evolucionar hacia métodos más avanzados sin necesidad de reescribir todo el sistema.
