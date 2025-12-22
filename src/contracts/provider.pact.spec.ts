import path from 'path';
import { Verifier } from '@pact-foundation/pact';

describe('Pact Provider Verification (delivery-provider)', () => {
  it('validates the expectations of delivery-consumer', async () => {
    const pactFile = path.resolve(process.cwd(), 'pacts', 'delivery-consumer-delivery-provider.json');

    const opts = {
      providerBaseUrl: 'http://localhost:3000',
      pactUrls: [pactFile],
      provider: 'delivery-provider',
      publishVerificationResult: false
    } as any;

    const verifier = new Verifier();
    await verifier.verifyProvider(opts);
  }, 300000);
});
