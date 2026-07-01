import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnvironment } from './shared/config/validate-environment';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';

/**
 * Root module for the monolithic Menorca travel agent backend.
 *
 * Decision: the app stays monolithic but modular; each feature will keep clean
 * architecture boundaries internally while sharing cross-cutting infrastructure
 * such as configuration, guards, and health checks from this root composition.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
    AuthModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
