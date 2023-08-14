import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { LeaguesModule } from './games/games.modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User, Match, Vote, Feedback } from './typeorm/entities/';
import { PassportModule } from '@nestjs/passport';
import { FeedbackModule } from './feedback/feedback.module';
@Module({
  imports: [
    LeaguesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PGHOST'),
        port: parseInt(configService.get('PGPORT')),
        username: configService.get('PGUSER'),
        password: configService.get('PGPASSWORD'),
        database: configService.get('PGDATABASE'),
        entities: [User, Match, Vote, Feedback],
        synchronize: true,
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),
    PassportModule.register({ session: true }),
    AuthModule,
    FeedbackModule,
  ],
})
export class AppModule {}
