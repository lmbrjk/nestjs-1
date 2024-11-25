import { CreateArticleDto } from '@app/dto/createArticle.dto';
import { UpdateArticleDto } from '@app/dto/updateArticle.dto';
import { UserEntity } from '@app/user/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from './entities/article.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();

    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    article.slug = this.getSlug(article.title);

    // tipeORM сам подставит id из currentUser в связь между User и Article
    article.author = currentUser;

    return await this.articleRepository.save(article);
  }

  async deleteArticle(
    currentUserId: number,
    slug: string,
  ): Promise<DeleteResult> {
    const currentArticle = await this.getArticleBySlug(slug);

    if (!currentArticle) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (currentArticle.author.id !== currentUserId) {
      throw new HttpException(
        'Only the author can delete an article',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.articleRepository.delete({ slug });
  }

  async updateArticle(
    currentUserId: number,
    slug: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const currentArticle = await this.getArticleBySlug(slug);

    if (!currentArticle) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (currentArticle.author.id !== currentUserId) {
      throw new HttpException(
        'Only the author can delete an article',
        HttpStatus.FORBIDDEN,
      );
    }

    if (updateArticleDto.title !== currentArticle.title) {
      Object.assign(currentArticle, {
        ...updateArticleDto,
        slug: this.getSlug(updateArticleDto.title),
      });
    } else {
      Object.assign(currentArticle, updateArticleDto);
    }

    return await this.articleRepository.save(currentArticle);
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }

  async getArticleBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({
      where: {
        slug,
      },
    });
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      // создает уникальную строку формата 'j8r6mc'
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
