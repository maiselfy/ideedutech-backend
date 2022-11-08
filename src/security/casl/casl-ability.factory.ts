import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Action } from './models/actions';
import { PrismaAbility, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import {
  Address,
  Admin,
  Class,
  Content,
  Discipline,
  DisciplineSchedules,
  HomeWork,
  Lesson,
  Manager,
  Period,
  RefreshToken,
  RegisterClass,
  School,
  Student,
  EvaluativeDelivery,
  Teacher,
  User,
  WaitList,
  LackOfClass,
  Schedule,
  Gradebook,
  ReportCard,
  ReportAverage,
  Sponsor,
} from '@prisma/client';

// Definir tipos da minha aplicação.

export type AppSubjects = Subjects<{
  Admin: Admin;
  Manager: Manager;
  Teacher: Teacher;
  Student: Student;
  School: School;
  Class: Class;
  Discipline: Discipline;
  WaitList: WaitList;
  RefreshToken: RefreshToken;
  User: User;
  HomeWork: HomeWork;
  EvaluativeDelivery: EvaluativeDelivery;
  Period: Period; //Criar entity
  Content: Content; //Criar entity
  Lesson: Lesson; //Criar entity
  DisciplineSchedules: DisciplineSchedules;
  Address: Address;
  RegisterClass: RegisterClass;
  LackOfClass: LackOfClass;
  Schedule: Schedule;
  Gradebook: Gradebook;
  ReportCard: ReportCard;
  ReportAverage: ReportAverage;
  Sponsor: Sponsor;
  all: 'all';
}>;

export type AppAbility = PrismaAbility<[string, AppSubjects]>;

@Injectable()
export class CaslAbilityFactory {
  private AppAbility = PrismaAbility as AbilityClass<AppAbility>;
  createForUser(user) {
    const { can, build } = new AbilityBuilder(this.AppAbility);

    console.log(user);

    if (user.type === 'admin') {
      can(Action.Manage, 'User'); // read-write access to everything
    } else if (user.type === 'manager') {
      can(Action.Create, 'User');
      can(Action.Create, 'Student');
      can(Action.ReadUnique, 'Class');
      can(Action.ReadMany, 'Class');
      // can(Action.ReadMany, 'User', { id: user.id });
      // can(Action.ReadUnique, 'User', { id: user.id });
      // can(Action.Delete, 'User', { id: user.id });
    }

    return build({
      detectSubjectType: (object) => object.__caslSubjectType__,
    });
  }

  createForAdmin() {
    const { can, build } = new AbilityBuilder(this.AppAbility);

    can(Action.Manage, 'all');

    return build({
      detectSubjectType: (object) => object.__caslSubjectType__,
    });
  }

  // createForWaitlist(user, school) {
  //   const { can, build } = new AbilityBuilder(this.AppAbility);

  //   if (user.type === 'Admin') {
  //     can(Action.Manage, 'Waitlist'); // read-write access to everything
  //   } else if (user.type === 'Manager') {
  //     can(Action.Create, 'Waitlist');
  //     can(Action.ReadMany, 'Waitlist', { schoolId: school.id });
  //     can(Action.ReadUnique, 'Waitlist', { schoolId: school.id });
  //     can(Action.Delete, 'Waitlist', { userId: user.id });
  //   } else if (user.type === 'Teacher') {
  //     can(Action.Create, 'Waitlist');
  //   }

  //   return build({
  //     detectSubjectType: (item) =>
  //       item.constructor as ExtractSubjectType<Subjects>,
  //   });
  // }

  // createForSchool(user, school) {
  //   const { can, build } = new AbilityBuilder(this.AppAbility);

  //   if (user.type === 'Admin') {
  //     can(Action.Manage, 'School'); // read-write access to everything
  //   } else if (user.type === 'Manager') {
  //     can(Action.ReadMany, 'School', { userId: user.id, schoolId: school.id });
  //     can(Action.ReadUnique, 'School', {
  //       userId: user.id,
  //       schoolId: school.id,
  //     });
  //   } else if (user.type === 'Teacher') {
  //     can(Action.ReadMany, 'School', { userId: user.id, schoolId: school.id });
  //     can(Action.ReadUnique, 'School', {
  //       userId: user.id,
  //       schoolId: school.id,
  //     });
  //   } else if (user.type === 'Student') {
  //     can(Action.ReadUnique, 'School', {
  //       userId: user.id,
  //       schoolId: school.id,
  //     });
  //   }

  //   return build({
  //     detectSubjectType: (object) => object.__caslSubjectType__,
  //   });
  // }

  // createForClass(user, classSchool) {
  //   const { can, build } = new AbilityBuilder(this.AppAbility);

  //   if (user.type === 'Admin') {
  //     can(Action.Manage, 'Class'); // read-write access to everything
  //   } else if (user.type === 'Manager') {
  //     can(Action.Create, 'Class', {
  //       userId: user.id,
  //       classSchoolId: classSchool.id,
  //     });
  //     can(Action.ReadMany, 'Class', {
  //       userId: user.id,
  //       classSchoolId: classSchool.id,
  //     });
  //     can(Action.ReadUnique, 'Class', {
  //       userId: user.id,
  //       classSchoolId: classSchool.id,
  //     });
  //     can(Action.Update, 'Class', {
  //       userId: user.id,
  //       classSchoolId: classSchool.id,
  //     });
  //     can(Action.Delete, 'Class', {
  //       userId: user.id,
  //       classSchoolId: classSchool.id,
  //     });
  //   } else if (user.type === 'Teacher') {
  //     can(Action.ReadMany, 'Class', {
  //       userId: user.id,
  //       classSchoolId: classSchool.id,
  //     });
  //     can(Action.ReadUnique, 'Class', {
  //       userId: user.id,
  //       classSchoolId: classSchool.id,
  //     });
  //   } else if (user.type === 'Student') {
  //     can(Action.ReadMany, 'Class', {
  //       userId: user.id,
  //       classSchoolId: classSchool.id,
  //     });
  //     can(Action.ReadUnique, 'Class', {
  //       userId: user.id,
  //       classSchoolId: classSchool.id,
  //     });
  //   }

  //   return build({
  //     detectSubjectType: (object) => object.__caslSubjectType__,
  //   });
  // }

  // createForDiscipline(user, discipline) {
  //   const { can, build } = new AbilityBuilder(this.AppAbility);

  //   if (user.type === 'Admin') {
  //     can(Action.Manage, 'Discipline'); // read-write access to everything
  //   } else if (user.type === 'Manager') {
  //     can(Action.Create, 'Discipline', {
  //       userId: user.id,
  //       disciplineId: discipline.id,
  //     });
  //     can(Action.ReadMany, 'Discipline', {
  //       userId: user.id,
  //       disciplineId: discipline.id,
  //     });
  //     can(Action.ReadUnique, 'Discipline', {
  //       userId: user.id,
  //       disciplineId: discipline.id,
  //     });
  //     can(Action.Update, 'Discipline', {
  //       userId: user.id,
  //       disciplineId: discipline.id,
  //     });
  //     can(Action.Delete, 'Discipline', {
  //       userId: user.id,
  //       disciplineId: discipline.id,
  //     });
  //   } else if (user.type === 'Teacher') {
  //     can(Action.ReadMany, 'Discipline', {
  //       userId: user.id,
  //       disciplineId: discipline.id,
  //     });
  //     can(Action.ReadUnique, 'Discipline', {
  //       userId: user.id,
  //       disciplineId: discipline.id,
  //     });
  //     can(Action.Update, 'Discipline', {
  //       userId: user.id,
  //       disciplineId: discipline.id,
  //     });
  //   } else if (user.type === 'Student') {
  //     can(Action.ReadMany, 'Discipline', {
  //       userId: user.id,
  //       disciplineId: discipline.id,
  //     });
  //     can(Action.ReadUnique, 'Discipline', {
  //       userId: user.id,
  //       disciplineId: discipline.id,
  //     });
  //   }

  //   return build({
  //     detectSubjectType: (object) => object.__caslSubjectType__,
  //   });
  // }

  // createForAddress(user, address) {
  //   const { can, build } = new AbilityBuilder(this.AppAbility);

  //   if (user.type === 'Admin') {
  //     can(Action.Manage, 'Address'); // read-write access to everything
  //   } else if (user.type === 'Manager') {
  //     can(Action.Create, 'Address', { userId: user.id, addressId: address.id });
  //     can(Action.ReadMany, 'Address', {
  //       userId: user.id,
  //       addressId: address.id,
  //     });
  //     can(Action.ReadUnique, 'Address', {
  //       userId: user.id,
  //       addressId: address.id,
  //     });
  //     can(Action.Update, 'Address', { userId: user.id, address: address.id });
  //     can(Action.Delete, 'Address', { userId: user.id, addressId: address.id });
  //   } else if (user.type === 'Teacher') {
  //     can(Action.ReadMany, 'Address', {
  //       userId: user.id,
  //       addressId: address.id,
  //     });
  //     can(Action.ReadUnique, 'Address', {
  //       userId: user.id,
  //       addressId: address.id,
  //     });
  //     can(Action.Update, 'Address', {
  //       userId: user.id,
  //       addressId: address.id,
  //     });
  //   } else if (user.type === 'Student') {
  //     can(Action.ReadMany, 'Address', {
  //       userId: user.id,
  //       addressId: address.id,
  //     });
  //     can(Action.ReadUnique, 'Address', {
  //       userId: user.id,
  //       addressId: address.id,
  //     });
  //   }

  //   return build({
  //     detectSubjectType: (object) => object.__caslSubjectType__,
  //   });
  // }
}
