import path from 'path';
import { Pact, Matchers } from '@pact-foundation/pact';
import axios from 'axios';

const { like, uuid } = Matchers;

describe('Pact Consumer tests (delivery-consumer -> delivery-provider)', () => {
	describe('when a request to create a package is made', () => {
		const provider = new Pact({
			consumer: 'delivery-consumer',
			provider: 'delivery-provider',
			port: 1234,
			log: path.resolve(process.cwd(), 'logs', 'pact-create.log'),
			dir: path.resolve(process.cwd(), 'pacts'),
		});

		beforeAll(async () => {
			await provider.setup();
		});

		beforeEach(async () => {
			await provider.addInteraction({
				state: 'provider accepts a new package',
				uponReceiving: 'a request to create a package',
				withRequest: {
					method: 'POST',
					path: '/packages',
					headers: { 'Content-Type': 'application/json' },
					body: {
						recipientName: like('Juan Perez'),
						address: like('Calle Falsa 123'),
						cellPhone: like('+34123456789'),
					},
				},
				willRespondWith: {
					status: 201,
					headers: { 'Content-Type': 'application/json' },
					body: {
						id: uuid('b3c4a9b0-0000-4000-8000-000000000000'),
						recipientName: like('Juan Perez'),
					},
				},
			});
		});

		afterEach(async () => {
			try {
				await provider.verify();
			} catch (err: unknown) {
				const error = err as Error & { details?: unknown };
				console.error(
					'Pact verification failed!',
					error?.message ? error.message : err,
				);
				if (error?.details) console.error('Details:', error.details);
				throw err;
			}
		});

		afterAll(async () => {
			await provider.finalize();
		});

		it('creates a package and returns id (mocked)', async () => {
			const reqBody = {
				recipientName: 'Juan Perez',
				address: 'Calle Falsa 123',
				cellPhone: '+34123456789',
			};
			try {
				const res = await axios.post(
					'http://localhost:1234/packages',
					reqBody,
					{ headers: { 'Content-Type': 'application/json' } },
				);
				expect(res.status).toBe(201);
				expect(res.data).toHaveProperty('id');
			} catch (err: unknown) {
				const error = err as Error;
				console.error(
					'Axios error on create-package call:',
					error?.message ? error.message : err,
				);
				throw err;
			}
		});
	});

	describe('when a request to assign a package to a dealer is made', () => {
		const provider = new Pact({
			consumer: 'delivery-consumer',
			provider: 'delivery-provider',
			port: 1235,
			log: path.resolve(process.cwd(), 'logs', 'pact-assign.log'),
			dir: path.resolve(process.cwd(), 'pacts'),
		});

		beforeAll(async () => {
			await provider.setup();
		});

		beforeEach(async () => {
			await provider.addInteraction({
				state: 'package exists and dealer exists',
				uponReceiving: 'a request to assign a package',
				withRequest: {
					method: 'POST',
					path: '/packages/assign',
					headers: { 'Content-Type': 'application/json' },
					body: {
						packageId: uuid('11111111-1111-4111-8111-111111111111'),
						dealerId: uuid('22222222-2222-4222-8222-222222222222'),
					},
				},
				willRespondWith: {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
					body: {
						success: like(true),
					},
				},
			});
		});

		afterEach(async () => {
			try {
				await provider.verify();
			} catch (err: unknown) {
				const error = err as Error & { details?: unknown };
				console.error(
					'Pact verification failed!',
					error?.message ? error.message : err,
				);
				if (error?.details) console.error('Details:', error.details);
				throw err;
			}
		});

		afterAll(async () => {
			await provider.finalize();
		});

		it('assigns a package to a dealer (mocked)', async () => {
			const reqBody = {
				packageId: '11111111-1111-4111-8111-111111111111',
				dealerId: '22222222-2222-4222-8222-222222222222',
			};
			try {
				const res = await axios.post(
					'http://localhost:1235/packages/assign',
					reqBody,
					{ headers: { 'Content-Type': 'application/json' } },
				);
				expect(res.status).toBe(200);
				expect(res.data).toHaveProperty('success');
			} catch (err: unknown) {
				const error = err as Error;
				console.error(
					'Axios error on assign-package call:',
					error?.message ? error.message : err,
				);
				throw err;
			}
		});
	});
});
