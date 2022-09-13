import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Request
  
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/auth-guard.jwt';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserCurrent } from './user.decorator';
import { SessionGuard } from 'src/auth/session.guard';
import { UpdatePermissionDto } from './dto/update-user-permission';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

 
  @UseGuards(SessionGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto,@Request() req) {
    const user = req.user;
    //console.log(user);
    if (user.userType == 'ADMIN' ) {
      //console.log('ADMIN');
      return this.userService.create(createUserDto);
    } else {
      //console.log('NOT ADMIN');
      throw new NotFoundException('You are not authorised for create uesr!');
    }
    
    
    //return this.userService.create(createUserDto);
    /* {
      "username": "santunew",
      "password": "passwrod",
      "retypedPassword": "password",
      "firstName": "santu",
      "lastName": "mondal",
      "email": "santunew@gmail.com",
      "userType": "A"
    } */
  }
  @UseGuards(SessionGuard)
  @Post('permission')
  updateUserPermission(@Body() updatePermissionDto: UpdatePermissionDto,@Request() req) {
    const user = req.user;
    console.log(user);
    if (user.userType == 'ADMIN' ) {
      console.log('ADMIN');
      return this.userService.createUserPermission(updatePermissionDto);
    } else {
      //console.log('NOT ADMIN');
      throw new NotFoundException('You are not authorised make user permission!');
    }
    
    
    //return this.userService.create(createUserDto);
    /* {
      "username": "santunew",
      "password": "passwrod",
      "retypedPassword": "password",
      "firstName": "santu",
      "lastName": "mondal",
      "email": "santunew@gmail.com",
      "userType": "A"
    } */
  }

  
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.userService.findAll();
  }

 
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    const user = this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
