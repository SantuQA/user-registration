import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';
import { TodosModule } from './todos/todos.module';
import { Todo } from './todos/entities/todo.entity';
import { ConfigModule } from '@nestjs/config';
import { User_Permission } from './user/entities/user.permission.entity';
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
@Module({
  imports: [
    /* ConfigModule.forRoot({isGlobal: true}),
     TypeOrmModule.forRoot({
      type: 'mongodb',
      host: DB_HOST,
      port: Number(DB_PORT),
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [User,Todo],
      synchronize: false,
      useUnifiedTopology: true,
      authMechanism: 'DEFAULT',
      authSource: 'admin',
      logging: true
    }) */  
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: '68.183.207.242',
      port: Number(27444),
      username: 'root',
      password: '4DConnect9876$4321!',
      database: 'test-project',
      entities: [User,Todo,User_Permission],
      synchronize: false,
      useUnifiedTopology: true,
      authMechanism: 'DEFAULT',
      authSource: 'admin',
      logging: true
    }),
    AuthModule,
    
  ]
})
export class AppModule {}
