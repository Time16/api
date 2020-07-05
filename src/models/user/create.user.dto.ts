import { IsString, IsUUID, IsEmail, IsNumber } from 'class-validator';

export default class CreateUserDto {
 
  @IsUUID(4)
  public uuid: string;

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