import path from 'path';
import { Verifier, VerifierOptions } from '@pact-foundation/pact';

describe.skip('Pact Provider Verification (delivery-provider)', () => {
	it('validates the expectations of delivery-consumer', async () => {
		const pactFile = path.resolve(
			process.cwd(),
			'pacts',
			'delivery-consumer-delivery-provider.json',
		);

		const opts: VerifierOptions = {
			providerBaseUrl: 'http://localhost:3000',
			pactUrls: [pactFile],
			provider: 'delivery-provider',
			logLevel: 'WARN',
			publishVerificationResult: false,
			providerVersion: '1.0.0',
		};

		const verifier = new Verifier(opts);
		await verifier.verifyProvider(opts);
	}, 300000);
});
