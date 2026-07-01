import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

/**
 * Serves the minimal public API landing endpoint.
 *
 * Decision: keeping this controller tiny gives Swagger and smoke tests a stable
 * root endpoint while business capabilities move into feature modules.
 */
@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Returns a simple API status message.
   *
   * Decision: this method intentionally avoids business logic; it is only a
   * low-cost smoke endpoint for confirming the Nest process is responding.
   */
  @Get()
  @ApiOkResponse({ type: String })
  getHello(): string {
    return this.appService.getHello();
  }
}
