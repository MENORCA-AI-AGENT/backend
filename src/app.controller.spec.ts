import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * Unit tests for the root app controller.
 *
 * Decision: the test remains focused on controller-service wiring so broader
 * business behavior can be tested inside each feature module.
 */
describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return the API smoke-test message', () => {
      expect(appController.getHello()).toBe('Menorca Travel Agent API');
    });
  });
});
