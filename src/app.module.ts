import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { AccountsModule } from './accounts/accounts.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    UsersModule,  
    AuthModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        synchronize: configService.get<string>('nodeEnv') === 'develop',
        autoLoadEntities: true
      }),
      inject: [ConfigService],
    }),
    PostsModule,
    AccountsModule,
    CloudinaryModule.forRootAsync({  
      useFactory: (configService: ConfigService) => ({
        cloud_name: configService.get<string>('cloudinary.cloud_name'),
        api_key: configService.get<string>('cloudinary.api_key'),
        api_secret: configService.get<string>('cloudinary.api_secret'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
