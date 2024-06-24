import { RequestExpressInterface } from "@app/types/expressRequest.interface";
import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthUserDto } from "./dto/authUser.dto";
import { CreateUserDto } from "./dto/createUser.dto";
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
    async currentUser(@Req() request: RequestExpressInterface): Promise<UserResponseInterface>{
        return this.userService.buildUserResponse(request.user)
    }
}