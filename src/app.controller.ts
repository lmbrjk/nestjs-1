import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateDto } from './dto/create.dto';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('get/:id')
  getHello(@Param('id', ParseIntPipe) id: number) {

    if(id < 2){
      throw new BadRequestException('Errorrrr!!!')
    }

    return id;
  }

  @UsePipes(new ValidationPipe)
  @Post('create')
  createSomething(@Body() dto: CreateDto) {
   console.log("create")
  }
}
