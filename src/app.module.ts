import { Module } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { DatabaseModule } from '@app/database/database.module';
import { TagModule } from '@app/tag/tag.module';

@Module({
  imports: [DatabaseModule, TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
