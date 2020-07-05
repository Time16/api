import { IsString, IsUUID, IsEmail, IsNumber, IsDate, IsOptional } from 'class-validator';

export default class CreateServiceDto {
 
  @IsString()
  public name: string;

  @IsNumber()
  public latitudeO: string;

  @IsNumber()
  public longitudeO: string;

  @IsNumber()
  public latitudeD: string;

  @IsNumber()
  public longitudeD: string;

  @IsString()
  public status: number;

  @IsNumber()
  public price: string;

  @IsNumber()
  public estimated_time: string;

  @IsNumber()
  public spent_time: string;

  @IsNumber()
  public initial_time: string;

  @IsNumber()
  public final_time: string;

  @IsOptional()
  @IsDate()
  public date: Date;

  

  constructor(){}

}