import { afterEach, describe, expect, it, vi } from 'vitest';
import { withRetry } from '../src/retry';

describe('withRetry', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('повторює дію після помилки та повертає успішний результат', async () => {
    vi.useFakeTimers();
    const action = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('TIMEOUT'))
      .mockResolvedValueOnce('ok');

    const promise = withRetry(action, 3, 1000);
    await vi.advanceTimersByTimeAsync(1000);

    await expect(promise).resolves.toBe('ok');
    expect(action).toHaveBeenCalledTimes(2);
  });

  it('після вичерпання спроб передає останню помилку', async () => {
    vi.useFakeTimers();
    const action = vi
      .fn<() => Promise<string>>()
      .mockRejectedValue(new Error('TIMEOUT'));

    const promise = withRetry(action, 3, 1000);
    const assertion = expect(promise).rejects.toThrow('TIMEOUT');
    await vi.advanceTimersByTimeAsync(2000);

    await assertion;
    expect(action).toHaveBeenCalledTimes(3);
  });
});
