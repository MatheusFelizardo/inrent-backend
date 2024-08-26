import { Module } from '@nestjs/common';
import { join } from 'path';
// Config
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guard/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

// Modules
import { AuthModule } from './auth/auth.module';
import { PropertiesModule } from './properties/properties.module';
import { ContractsModule } from './contracts/contracts.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { PaymentsModule } from './payments/payments.module';
import { DashboardsModule } from './dashboards/dashboards.module';

// Datasource
import { dataSourceOptions } from './db/data-source';
import { MessagesGateway } from './messages/messages.gatway';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/public',
      renderPath: '/',
      serveStaticOptions: {
        index: false,
      },
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    PropertiesModule,
    ContractsModule,
    UsersModule,
    MessagesModule,
    PaymentsModule,
    DashboardsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    MessagesGateway,
  ],
})
export class AppModule {}
