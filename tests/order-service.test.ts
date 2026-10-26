import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OrderService } from '../src/order-service';
import type {
  Notifier,
  OrderRecord,
  OrderRepository,
  RateProvider,
} from '../src/order-service';
import { InMemoryOrderRepository } from './fakes/in-memory-repository';

describe('OrderService — заглушки та шпигуни', () => {
  let rates: RateProvider;
  let repo: OrderRepository;
  let notifier: Notifier;
  let service: OrderService;

  beforeEach(() => {
    rates = { getRate: vi.fn().mockResolvedValue(41) };
    repo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
    };
    notifier = { send: vi.fn().mockResolvedValue(undefined) };
    service = new OrderService(rates, repo, notifier);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('конвертує суму за отриманим курсом', async () => {
    const record = await service.placeOrder({
      id: 'A-1',
      amountUsd: 100,
      email: 'u@e.com',
    });

    expect(record.amountUah).toBeCloseTo(4100, 2);
  });

  it('надсилає лист із гривневою сумою та адресою замовника', async () => {
    await service.placeOrder({
      id: 'A-2',
      amountUsd: 10,
      email: 'client@e.com',
    });

    expect(notifier.send).toHaveBeenCalledTimes(1);
    expect(notifier.send).toHaveBeenCalledWith(
      'client@e.com',
      expect.stringContaining('410'),
    );
  });

  it('не звертається до залежностей за некоректної суми', async () => {
    await expect(
      service.placeOrder({ id: 'A-3', amountUsd: 0, email: 'u@e.com' }),
    ).rejects.toThrow('INVALID_AMOUNT');

    expect(rates.getRate).not.toHaveBeenCalled();
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('виконує одне збереження замовлення', async () => {
    await service.placeOrder({
      id: 'A-4',
      amountUsd: 10,
      email: 'u@e.com',
    });

    expect(repo.save).toHaveBeenCalledTimes(1);
  });

  it('збережене замовлення можна прочитати зі сховища', async () => {
    const statefulRepo = new InMemoryOrderRepository();
    const statefulService = new OrderService(rates, statefulRepo, notifier);

    await statefulService.placeOrder({
      id: 'A-5',
      amountUsd: 50,
      email: 'u@e.com',
    });

    const saved = await statefulRepo.findById('A-5');
    expect(saved?.amountUah).toBeCloseTo(2050, 2);
    expect(statefulRepo.size).toBe(1);
  });

  it('не зберігає замовлення й не надсилає листа, якщо курс недоступний', async () => {
    const statefulRepo = new InMemoryOrderRepository();
    rates.getRate = vi.fn().mockRejectedValue(new Error('RATE_UNAVAILABLE'));
    const failingService = new OrderService(rates, statefulRepo, notifier);

    await expect(
      failingService.placeOrder({
        id: 'A-6',
        amountUsd: 100,
        email: 'u@e.com',
      }),
    ).rejects.toThrow('RATE_UNAVAILABLE');

    expect(await statefulRepo.findById('A-6')).toBeUndefined();
    expect(notifier.send).not.toHaveBeenCalled();
  });

  it('передає помилку сховища та не надсилає листа', async () => {
    repo.save = vi.fn().mockRejectedValue(new Error('STORAGE_UNAVAILABLE'));

    await expect(
      service.placeOrder({ id: 'A-7', amountUsd: 10, email: 'u@e.com' }),
    ).rejects.toThrow('STORAGE_UNAVAILABLE');

    expect(notifier.send).not.toHaveBeenCalled();
  });
});

describe('OrderService — фіксація системного часу', () => {
  let service: OrderService;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-15T10:00:00.000Z'));
    service = new OrderService(
      { getRate: vi.fn().mockResolvedValue(41) },
      {
        save: vi.fn().mockResolvedValue(undefined),
        findById: vi.fn<() => Promise<OrderRecord | undefined>>(),
      },
      { send: vi.fn().mockResolvedValue(undefined) },
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('записує зафіксований момент створення замовлення', async () => {
    const record = await service.placeOrder({
      id: 'A-8',
      amountUsd: 20,
      email: 'u@e.com',
    });

    expect(record.createdAt).toBe('2026-03-15T10:00:00.000Z');
  });
});
