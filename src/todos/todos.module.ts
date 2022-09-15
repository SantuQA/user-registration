import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { AuthService } from 'src/auth/auth.service';
import { Todo } from './entities/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ACCESSS_CONTROL } from 'src/user/entities/access.control.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Todo,ACCESSS_CONTROL])],
  controllers: [TodosController],
  providers: [TodosService,AuthService],
  exports:[TodosService]
})
export class TodosModule {}
