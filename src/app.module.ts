import { Module } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { DatabaseModule } from '@app/database/database.module';
import { TagModule } from '@app/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from '@app/tag/entities/tag.entity';
import ormconfig from './ormconfig';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig), DatabaseModule, TagModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
