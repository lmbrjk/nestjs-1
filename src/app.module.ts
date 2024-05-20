import { Module } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { DatabaseModule } from '@app/database/database.module';
import { TagModule } from '@app/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from '@app/tag/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'nest',
    entities: [TagEntity],
    // entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }), DatabaseModule, TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
