import { Injectable } from '@nestjs/common';
import CreatePlanEducationDTO from '../dtos/createPlan-education.dto';

@Injectable()
export class PlanEducationService {
  create(createPlanEducationDTO: CreatePlanEducationDTO) {
    return 'This action adds a new planEducation';
  }

  // findAll() {
  //   return `This action returns all planEducation`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} planEducation`;
  // }

  // update(id: number, updatePlanEducationDto: UpdatePlanEducationDto) {
  //   return `This action updates a #${id} planEducation`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} planEducation`;
  // }
}
