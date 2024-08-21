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

// Entities
import { User } from './users/entities/user.entity';
import { Property } from './properties/entities/property.entity';
import { PropertyPhotos } from './properties/entities/property-photos.entity';
import { Profile } from './users/entities/profile.entity';
import { Labels } from './properties/entities/labels.entity';
import { PhotoLabels } from './properties/entities/photo-labels.entity';
import { dataSourceOptions } from './db/data-source';

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
  ],
})
export class AppModule {}
