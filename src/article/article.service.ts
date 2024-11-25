import { CreateArticleDto } from '@app/dto/createArticle.dto';
import { UpdateArticleDto } from '@app/dto/updateArticle.dto';
import { UserEntity } from '@app/user/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from './entities/article.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAllArticles(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        // % - обознает что до tag и после него может быть что угодно, т.е это не точное вхождение
        // например если query.tag = 'dragon' то найдутся и dragon и dragons
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: {
          id: currentUserId,
        },
      });
      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id,
      });
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }

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
