import { User } from "@app/decorators/user.decorator";
import { AuthGuard } from "@app/guards/auth.guard";
import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthUserDto } from "./dto/authUser.dto";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserEntity } from "./entities/user.entity";
import { UserResponseInterface } from "./types/userResponse.interface";
import { UserService } from "./user.service";

@Controller()
export class UserController {
    
    constructor(private readonly userService: UserService){}

    @Post('users')
    @UsePipes(new ValidationPipe())
    async createUser(@Body("user") createUserDto: CreateUserDto): Promise<UserResponseInterface>{
        const user = await this.userService.createUser(createUserDto)
        return this.userService.buildUserResponse(user)
    }

    @Post('users/login')
    @UsePipes(new ValidationPipe())
    async authUser(@Body("user") authUserDto: AuthUserDto): Promise<UserResponseInterface>{
        const user = await this.userService.authUser(authUserDto)
        return this.userService.buildUserResponse(user)
    }

    @Get('user')
    @UseGuards(AuthGuard)
    async currentUser(@User() user: UserEntity): Promise<UserResponseInterface>{
        return this.userService.buildUserResponse(user)
    }
}