import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { AuthService } from 'src/auth/auth.service';
import { Todo } from './entities/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ACCESSS_CONTROL } from 'src/user/entities/access.control.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Todo,ACCESSS_CONTROL,User])],
  controllers: [TodosController],
  providers: [TodosService,AuthService],
  exports:[TodosService]
})
export class TodosModule {}
