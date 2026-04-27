import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;
}

export class ChangeProfilePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}