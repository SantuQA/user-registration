import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: DB_HOST,
      port: Number(DB_PORT),
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [User],
      synchronize: false,
      useUnifiedTopology: true,
      authMechanism: 'DEFAULT',
      authSource: 'admin',
      logging: true
    }) ,
    AuthModule,
    
  ]
})
export class AppModule {}
