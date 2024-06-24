import { UserEntity } from "@app/user/entities/user.entity";
import { Request } from "express";

export interface RequestExpressInterface extends Request {
    user?: UserEntity
}