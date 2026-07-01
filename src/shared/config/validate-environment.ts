import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentDto } from './environment.dto';

/**
 * Validates process environment values before the Nest application is created.
 *
 * Decision: failing fast during startup is safer than discovering malformed
 * provider URLs or token settings when a user is already making a travel request.
 */
export function validateEnvironment(
  config: Record<string, unknown>,
): EnvironmentDto {
  const validatedConfig = plainToInstance(EnvironmentDto, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: true,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
