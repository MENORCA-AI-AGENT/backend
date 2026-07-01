import { Injectable } from '@nestjs/common';

/**
 * Provides process-level application messages.
 *
 * Decision: this service remains intentionally small because feature behavior
 * belongs in module-specific application services and use cases.
 */
@Injectable()
export class AppService {
  /**
   * Returns the public smoke-test message for the root endpoint.
   *
   * Decision: using a service for the message keeps the starter test meaningful
   * and preserves the Nest controller-service pattern for future expansion.
   */
  getHello(): string {
    return 'Menorca Travel Agent API';
  }
}
