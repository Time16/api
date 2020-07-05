import { IsString, IsUUID, IsEmail, IsNumber } from 'class-validator';

export default class CreateAdressDto {
 
  @IsString()
  public street: string;

  @IsString()
  public neighborhood: string;

  @IsNumber()
  public number: number;

  @IsString()
  public city: string;

  @IsString()
  public state: string;

  @IsNumber()
  public zip_code: number;
  

  constructor(){}

}
