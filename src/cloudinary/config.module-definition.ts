import { ConfigurableModuleBuilder } from '@nestjs/common';
import { CloudinaryModuleOptions } from './interfaces/cloudinary-module-options.interface';

export const { 
    ConfigurableModuleClass: ConfigurableCloudinaryModule, 
    MODULE_OPTIONS_TOKEN: CLOUDIANRY_CONFIG_OPTIONS,
    OPTIONS_TYPE: CLOUDINARY_OPTIONS_TYPE,
    ASYNC_OPTIONS_TYPE: CLOUDINARY_ASYNC_OPTIONS_TYPE
} = 
    new ConfigurableModuleBuilder<CloudinaryModuleOptions>()
        .setClassMethodName('forRoot')
        .build();