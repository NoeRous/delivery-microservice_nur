import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryController } from '../delivery.controller';
import { CommandBus } from '@nestjs/cqrs';

describe('DeliveryController', () => {
  let controller: DeliveryController;
  let commandBusMock: { execute: jest.Mock };

  beforeEach(async () => {
    commandBusMock = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryController],
      providers: [
        {
          provide: CommandBus,
          useValue: commandBusMock,
        },
      ],
    }).compile();

    controller = module.get<DeliveryController>(DeliveryController);
  });

  it('debería crear un dealer correctamente', async () => {
    commandBusMock.execute.mockResolvedValue({ id: '123' });

    const result = await controller.createDealer({
      identityCard: '123456',
      firstName: 'Juan',
      lastName: 'Perez',
      cellPhone: 789000,
    });

    expect(result).toEqual({
      message: 'Dealer created successfully',
      dealer: { id: '123' },
    });

    expect(commandBusMock.execute).toHaveBeenCalledTimes(1);
  });

  it('debería marcar un paquete como entregado', async () => {
    const id = 'PKG001';

    const result = await controller.markAsDelivered(id);

    expect(commandBusMock.execute).toHaveBeenCalled();
    expect(result).toEqual({
      status: true,
      message: `Paquete ${id} marcado como entregado.`,
    });
  });
});
