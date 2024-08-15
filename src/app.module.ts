import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PropertiesModule } from './properties/properties.module';
import { ContractsModule } from './contracts/contracts.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { PaymentsModule } from './payments/payments.module';
import { DashboardsModule } from './dashboards/dashboards.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guard/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { Property } from './properties/entities/property.entity';
import { PropertyPhotos } from './properties/entities/property-photos.entity';
import { Profile } from './users/entities/profile.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Profile, Property, PropertyPhotos],
      synchronize: true,
    }),
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
