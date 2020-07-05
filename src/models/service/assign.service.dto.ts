import { IsString, IsUUID, IsEmail, IsNumber, IsDate } from 'class-validator';

export default class AssignServiceDto {
 
  @IsString()
  public uuidUser: string;

  @IsString()
  public uuidService: number;

  constructor(){}

}