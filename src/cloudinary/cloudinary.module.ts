import { Module, DynamicModule, Provider, Inject } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from './cloudinary.service';
import { ConfigurableCloudinaryModule, CLOUDIANRY_CONFIG_OPTIONS, CLOUDINARY_ASYNC_OPTIONS_TYPE } from './config.module-definition';
import { CloudinaryModuleOptions } from './interfaces/cloudinary-module-options.interface';
import { CLOUDIANRY_MODULE_OPTIONS, CLOUDINARY } from './constants';

@Module({
  imports: [],
  providers: [
    CloudinaryService,
  ],
  exports: [CloudinaryService],
})
export class CloudinaryModule /* extends ConfigurableCloudinaryModule */ {
  // static forRootAsync(options: typeof CLOUDINARY_ASYNC_OPTIONS_TYPE): DynamicModule {
  //   return {
  //     ...super.forRootAsync(options)
  //   }
  // }

  static forRoot(options: CloudinaryModuleOptions): DynamicModule {
    const configModuleProvider: Provider = {
      provide: CLOUDIANRY_MODULE_OPTIONS,
      useValue: options
    }

    return {
      module: CloudinaryModule,
      providers: [
        CloudinaryService, 
        configModuleProvider, 
        this.createConnectionProvider()
      ],
      exports: [CloudinaryService],
    };
  }

  static forRootAsync(options: Record<string, any>): DynamicModule {
    const configModuleProvider: Provider = {
      inject: options.inject,
      provide: CLOUDIANRY_MODULE_OPTIONS,
      useFactory: options.useFactory
    }

    return {
      module: CloudinaryModule,
      imports: options.imports,
      providers: [
        configModuleProvider,
        this.createConnectionProvider(),
        CloudinaryService,
      ],
      exports: [CloudinaryService],
    };
  }

  private static createConnectionProvider (): Provider {
    return {
      inject: [CLOUDIANRY_MODULE_OPTIONS],
      provide: CLOUDINARY,
      useFactory: (configs: CloudinaryModuleOptions) => {
        return cloudinary.config({
            cloud_name: configs.cloud_name,
            api_key: configs.api_key,
            api_secret: configs.api_secret,
            secure: true
        })
      }
    }
  }
}
