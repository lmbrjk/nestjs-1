import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { DatabaseModule } from '@app/database/database.module';
import { TagModule } from '@app/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './ormconfig';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './user/middlewares/auth.middleware';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig), DatabaseModule, TagModule, UserModule, ArticleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(AuthMiddleware).forRoutes({
      // применяем AuthMiddleware для всех роутов
      path: '*',
      method: RequestMethod.ALL
    })
  }
}
