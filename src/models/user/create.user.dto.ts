import { IsString, IsUUID, IsEmail, IsNumber } from 'class-validator';

export default class CreateUserDto {
 
  @IsString()
  public name: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public rg: string;

  @IsNumber()
  public CPF: number;
  

  constructor(){}

}