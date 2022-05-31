import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Admin } from 'src/modules/admin/entities/admin.entity';
import { Class } from 'src/modules/class/entities/class.entity';
import { Discipline } from 'src/modules/discipline/entities/discipline.entity';
import { Manager } from 'src/modules/manager/entities/manager.entity';
import { School } from 'src/modules/school/entities/school.entity';
import { Student } from 'src/modules/student/entities/student.entity';
import { Teacher } from 'src/modules/teacher/entities/teacher.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Action } from './models/actions';

import { PrismaAbility, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Waitlist } from 'src/modules/waitlist/entities/waitlist.entity';
import { RefreshToken } from 'src/modules/refresh-token/entities/refreshToken.entity';
import { HomeWork } from 'src/modules/home-work/entities/homeWork.entity';
import { Submission } from 'src/modules/submission/entities/submission.entity';
import { Address } from 'src/modules/address/entities/address.entity';
import { DisciplineScheduleService } from 'src/modules/discipline-schedule/discipline-schedule.service';
import { Content, Lesson, Period } from '@prisma/client';
import { PlanEducation } from 'src/modules/plan-education/entities/plan-education.entity';

//Definir tipos da minha aplicação.

export type AppSubjects = Subjects<{
  Admin: Admin;
  Manager: Manager;
  Teacher: Teacher;
  Student: Student;
  School: School;
  Class: Class;
  Discipline: Discipline;
  WaitList: Waitlist;
  RefreshToken: RefreshToken;
  User: User;
  HomeWork: HomeWork;
  Submission: Submission;
  PlanEducation: PlanEducation;
  Period: Period; //Criar entity
  Content: Content; //Criar entity
  Lesson: Lesson; //Criar entity
  DisciplineSchedules: DisciplineScheduleService;
  Address: Address;
  all: 'all';
}>;

export type AppAbility = PrismaAbility<[string, AppSubjects]>;

@Injectable()
export class CaslAbilityFactory {
  private AppAbility = PrismaAbility as AbilityClass<AppAbility>;
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder(this.AppAbility);

    if (user.type === 'Admin') {
      can(Action.Manage, 'User'); // read-write access to everything
    } else if (user.type === 'Manager') {
      can(Action.Create, 'User');
      can(Action.Create, 'Class');
      can(Action.Create, 'Discipline');
      can(Action.ReadMany, 'User', { userId: user.id });
      can(Action.ReadUnique, 'User', { userId: user.id });
      can(Action.Delete, 'User', { userId: user.id });
      can(Action.Delete, 'Class', { userId: user.id });
      can(Action.Delete, 'Discipline', { userId: user.id });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  createForWaitlist(user: User, school: School) {
    const { can, build } = new AbilityBuilder(this.AppAbility);

    if (user.type === 'Admin') {
      can(Action.Manage, 'Waitlist'); // read-write access to everything
    } else if (user.type === 'Manager') {
      can(Action.Create, 'Waitlist');
      can(Action.ReadMany, 'Waitlist', { schoolId: school.id });
      can(Action.ReadUnique, 'Waitlist', { schoolId: school.id });
      can(Action.Delete, 'Waitlist', { userId: user.id });
    } else if (user.type === 'Teacher') {
      can(Action.Create, 'Waitlist');
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  createForSchool(user: User, school: School) {
    const { can, build } = new AbilityBuilder(this.AppAbility);

    if (user.type === 'Admin') {
      can(Action.Manage, 'School'); // read-write access to everything
    } else if (user.type === 'Manager') {
      can(Action.ReadMany, 'School', { userId: user.id, schoolId: school.id });
      can(Action.ReadUnique, 'School', {
        userId: user.id,
        schoolId: school.id,
      });
    } else if (user.type === 'Teacher') {
      can(Action.ReadMany, 'School', { userId: user.id, schoolId: school.id });
      can(Action.ReadUnique, 'School', {
        userId: user.id,
        schoolId: school.id,
      });
    } else if (user.type === 'Student') {
      can(Action.ReadUnique, 'School', {
        userId: user.id,
        schoolId: school.id,
      });
    }

    return build({
      detectSubjectType: (object) => object.__caslSubjectType__,
    });
  }
}
