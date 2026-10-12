# Лабораторна робота № 1

Проєкт демонструє налаштування TypeScript, Vitest, ESLint і Prettier.
Індивідуальний модуль `src/distance.ts` перетворює кілометри в милі та милі
в кілометри й відхиляє від’ємні або нечислові значення.

## Встановлення та запуск

```bash
npm install
npm test
npm run coverage
npm run lint
npm run format:check
```

## Структура

- `src/temperature.ts` — показовий модуль із лекційного прикладу.
- `src/distance.ts` — реалізація завдання варіанта 1.
- `tests/` — автоматизовані тести модулів.
- `vitest.config.ts` — конфігурація тестів і покриття.
- `tsconfig.json` — сувора конфігурація TypeScript.
- `eslint.config.mjs` — правила статичного аналізу.
- `.prettierrc` — правила форматування.
