// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { Public } from 'src/modules/auth/decorators/public.decorator';
// import CreateTestDTO from '../dtos/createTest.dto';
// import { TestService } from '../services/test.service';

// @Controller('test')
// export class TestController {
//   constructor(private readonly testService: TestService) {}

//   @Public()
//   @Post()
//   create(@Body() createTestDTO: CreateTestDTO) {
//     return this.testService.create(createTestDTO);
//   }

//   @Public()
//   @Get('mean/discipline/:disciplineId/student/:studentId')
//   getMeanOfStudentForDiscipline(studentId: string, disciplineId: string) {
//     return this.testService.calculateMeanOfStudentForDiscipline(
//       studentId,
//       disciplineId,
//     );
//   }

//   // @Get(':id')
//   // findOne(@Param('id') id: string) {
//   //   return this.testService.findOne(+id);
//   // }

//   // @Patch(':id')
//   // update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
//   //   return this.testService.update(+id, updateTestDto);
//   // }

//   // @Delete(':id')
//   // remove(@Param('id') id: string) {
//   //   return this.testService.remove(+id);
//   // }
// }
