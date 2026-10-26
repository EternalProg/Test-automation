import type { RateProvider } from './order-service';

export class HttpRateProvider implements RateProvider {
  constructor(private readonly baseUrl: string) {}

  async getRate(from: string, to: string): Promise<number> {
    const url = new URL('/rate', this.baseUrl);
    url.searchParams.set('from', from);
    url.searchParams.set('to', to);

    const response = await fetch(url);
    if (!response.ok) throw new Error('RATE_UNAVAILABLE');

    const data: unknown = await response.json();
    if (
      typeof data !== 'object' ||
      data === null ||
      !('rate' in data) ||
      typeof data.rate !== 'number'
    ) {
      throw new Error('INVALID_RATE_FORMAT');
    }

    return data.rate;
  }
}
