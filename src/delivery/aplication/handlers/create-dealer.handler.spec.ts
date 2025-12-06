import { CreateDealerHandler } from './create-dealer.handler';
import { CreateDealerCommand } from '../commands/create-dealer.command';
import { Dealer } from 'src/delivery/domain/entities/dealer.entity';

describe('CreateDealerCommandHandler', () => {
  it('debería llamar al repositorio y retornar el objeto creado', async () => {
    // Mock del repositorio con método save
    const mockRepository = {
      save: jest.fn().mockResolvedValue(true),
    };

    const handler = new CreateDealerHandler(mockRepository as any);

    const command = new CreateDealerCommand(
      '123456',      // identityCard
      'Juan',        // firstName
      'Perez',       // lastName
      12345678     // cellPhone válido
    );

    // Ejecutar handler
    await handler.execute(command);

    // Obtener el dealer que se pasó al save
    const savedDealer = mockRepository.save.mock.calls[0][0] as Dealer;

    // Validar usando el método toPersistence()
    expect(savedDealer.toPersistence()).toMatchObject({
      firstName: 'Juan',
      lastName: 'Perez',
      identityCard: '123456',
      cellPhone: 12345678,
    });

    // Validar que save fue llamado una vez
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });
});