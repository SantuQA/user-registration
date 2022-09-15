import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ACCESSS_CONTROL } from '../entities/access.control.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserControllerAccessDto{
    @ApiProperty()
    userId: string;
    @ApiProperty()
    access_controller: ACCESSS_CONTROL[];
}
  