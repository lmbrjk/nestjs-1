import { hash } from "bcrypt";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    email: string
    
    @Column({default: ''})
    bio: string

    @Column({default: ''})
    image: string

    // исключаем из find() и findOne() password
    // чтобы его добавить нужно будет применять select
    @Column({select: false})
    password: string

    @BeforeInsert()
    async hashPassword(){
        this.password = await hash(this.password, 10)
    }
}