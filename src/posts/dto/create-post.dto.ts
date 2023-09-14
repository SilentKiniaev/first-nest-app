import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreatePostDto {
    @IsBoolean()
    @IsOptional()
    commentsOff: boolean;

    @IsBoolean()
    @IsOptional()
    hidden: boolean;
}