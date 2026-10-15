# Лабораторна робота № 2

Модульне тестування бізнес-логіки засобами Vitest: матчери,
параметризовані тести, покриття коду.

Виконав: [[CHANGE: ПІБ та група]]

Варіант 1 — `applyLoyaltyPoints(total, points)`: списання бонусів з курсу
1 бал = 1 грн, але не більше ніж 30 % суми; від’ємна кількість балів —
виняток.

## Встановлення та запуск

```bash
npm install
npm test
npm run coverage
npm run lint
npm run format:check
```

## Структура

- `src/order.ts` — показовий модуль розрахунку замовлення
  (`calcSubtotal`, `calcDiscountRate`, `calcShipping`, `calcOrderTotal`)
  та функція варіанта 1 `applyLoyaltyPoints`.
- `tests/order.test.ts` — показові тести за методичкою.
- `tests/loyalty.test.ts` — тести функції варіанта 1.
- `vitest.config.ts` — конфігурація тестів і покриття.
- `tsconfig.json` — сувора конфігурація TypeScript.
- `eslint.config.mjs` — правила статичного аналізу.
- `.prettierrc` — правила форматування.
- `report/build_report.py` — скрипт генерації звіту (каталог `report/`
  не комітиться, файл DOCX лишається локальним).
