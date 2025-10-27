<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

---
# API de Mecánicas Pokémon

Esta guía explica en detalle cómo funciona el backend y cómo integrarlo desde un frontend.

## Resumen de las mecánicas

- Generación de Pokémon salvaje aleatorio desde PokeAPI.
- Vida calculada como `hp_base × 5`.
- Batallas por turnos con ataques simultáneos y efectividad por tipos, considerando doble tipo e inmunidades.
- 2 curas iniciales por jugador (guardadas en `Player.potions`), que se pueden usar al final de cada turno.
- Captura permitida solo si el jugador gana; máximo 10 Pokémon capturados por jugador.

## Arquitectura (Backend)

- Framework: NestJS + TypeORM (PostgreSQL).
- Entidades principales:
  - `Player`: `id`, `username`, `potions`.
  - `Pokemon`: catálogo local con `apiId`, `name`, `spriteUrl`, `type1`, `type2`, `baseHp`, `baseAttack`, `baseDefense`, `baseSpeed`.
  - `PlayerPokemon`: relación jugador-pokémon capturado, con `currentHp` y `nickname`.
  - `Battle`: snapshot de stats/tipos y estado de HP durante el combate.
  - `BattleLog`: registros por turno (daños, HP tras el turno, uso de poción).
- Servicios clave:
  - `PokeapiService`: obtiene datos de PokeAPI y calcula `hp × 5`.
  - `TypeEffectivenessService`: calcula multiplicadores por tipo (dual-type e inmunidades).
  - `BattlesService`: orquesta inicio de batalla, turnos, curas y captura.
  - `PlayerPokemonService`: valida y crea capturas (límite 10, no duplicados).

## Flujo típico desde el Frontend

1) Registrar/Iniciar sesión del jugador

- Registrar: `POST /api/players/register` body `{ "username": "ash" }`.
  - Respuesta: `Player` con `potions = 2`.
- Login: `POST /api/players/login` body `{ "username": "ash" }`.
  - Respuesta: `{ playerId, token }` (token simple base64 del id; en producción usar JWT).

2) Obtener un Pokémon salvaje

- `GET /api/wild-pokemon/random`
  - Respuesta ejemplo:
  ```json
  {
    "id": 25,
    "name": "pikachu",
    "spriteUrl": "https://...",
    "type1": "electric",
    "type2": null,
    "hp": 175,
    "attack": 55,
    "defense": 40,
    "speed": 90
  }
  ```

3) Iniciar una batalla

- `POST /api/battles/start`
  - Body: `{ "playerId": number, "playerPokemonId": number }`.
  - Respuesta ejemplo:
  ```json
  {
    "battleId": 123,
    "player": { "hp": 200, "baseHp": 200 },
    "wildPokemon": {
      "id": 25,
      "name": "pikachu",
      "spriteUrl": "https://...",
      "type1": "electric",
      "type2": null,
      "hp": 175
    }
  }
  ```

4) Ejecutar un turno

- `POST /api/battles/turn`
  - Body: `{ "battleId": 123, "usePotion": true | false }`.
  - Lógica:
    - Ambos atacan simultáneamente (se calcula daño con stats y efectividad por tipos, incluyendo doble tipo e inmunidades).
    - Si `usePotion=true` y el jugador tiene `potions > 0`, se cura el 50% del HP base tras el intercambio y se descuenta 1 poción.
    - Se guarda un `BattleLog` del turno: daños, HP resultantes, `used_potion`.
  - Respuesta ejemplo:
  ```json
  {
    "playerHp": 150,
    "wildHp": 120,
    "winner": null,
    "potions": 1
  }
  ```
  - Si termina: `winner` será `"player"`, `"wild"` o `"draw"`.

5) Capturar al finalizar

- `POST /api/battles/capture`
  - Body: `{ "battleId": 123, "nickname": "Sparky" }`.
  - Requiere que `winner = 'player'`.
  - Valida límite 10 y duplicados, crea `PlayerPokemon` con `currentHp = baseHp`.

6) Consultar información del jugador

- `GET /api/players/{id}`: datos básicos del jugador (incluye `potions`).
- `GET /api/players/{id}/pokemon`: lista de pokémon capturados con datos completos del pokémon.

## Integración Frontend (paso a paso)

1. Autenticación simple:
   - Guarda en el cliente `{ playerId, token }` devuelto por `/api/players/login`.
   - Incluir `playerId` en las peticiones que lo requieran.

2. UI para encuentro y batalla:
   - Botón “Buscar salvaje”: llama `GET /api/wild-pokemon/random` para mostrar el salvaje.
   - Selector de Pokémon del jugador: muestra `GET /api/players/{id}/pokemon` y elige `playerPokemonId`.
   - Botón “Iniciar batalla”: `POST /api/battles/start` con `playerId` y `playerPokemonId`.
   - Vista de turno: mostrar HP de ambos, tipos, y botón “Usar cura”.
   - Al presionar “Siguiente turno”: `POST /api/battles/turn` con `battleId` y `usePotion` según el botón.
   - Si `winner='player'`, mostrar botón “Capturar”: `POST /api/battles/capture`.

3. Manejo de estado en el cliente:
   - Guarda `battleId` hasta finalizar.
   - Actualiza HP y `potions` con la respuesta de cada turno.
   - Deshabilita acciones si `winner` deja de ser `null`.

4. Errores comunes a manejar en UI:
   - 400: “Battle already ended”, “Player already has 10 Pokémon”, “Player already has this Pokémon”.
   - 404: “Player not found”, “Pokemon not found”, “Battle not found”.

## Detalles de la lógica de daño

- Fórmula base simplificada: `(attack / defense) * 100 * factor_random(0.85..1.0)`.
- Multiplicador por tipo:
  - Se calcula contra `type1` y `type2` del defensor y se multiplican ambos.
  - Inmunidades (0×) prevalecen.

## Configuración del entorno

- Base de datos: PostgreSQL (ver `app.module.ts`).
- Sincronización de esquema habilitada (`synchronize: true`) para desarrollo.
- Dependencias HTTP: `@nestjs/axios` para PokeAPI.

## Consejos de producción

- Reemplazar el token simple por JWT.
- Deshabilitar `synchronize` y usar migraciones.
- Añadir rate limiting y caching para PokeAPI.

## Preguntas y soporte

Si necesitas ajustar el balance de daño o curas, o unificar la tabla de tipos (usar solo BD o solo el servicio estático), avísame y adapto el backend en consecuencia.
