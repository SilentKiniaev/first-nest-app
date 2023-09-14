import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || this.isNative(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);

    return validate(object)
      .then((errors) => {
        if (errors.length > 0) {
          throw new BadRequestException('Validation error');
        }

        return value;
      })
  }

  isNative(metatype): boolean {
    const types: Function[] = [Number, String, Boolean, Array, Object];
    return types.includes(metatype);
  }
}
