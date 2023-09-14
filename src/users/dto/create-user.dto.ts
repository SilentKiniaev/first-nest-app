import { MaxLength, MinLength, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto {
    @MinLength(5)
    @MaxLength(32)
    username: string;

    @IsString()
    password: string;

    @IsString()
    @IsOptional()
    @MaxLength(32)
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(128)
    description: string;

    @IsBoolean()
    @IsOptional()
    isPrivate: boolean;
}