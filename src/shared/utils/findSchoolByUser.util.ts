import { PrismaService } from 'src/database/prisma.service';

export const findSchoolByUser = async (userId: string) => {
  const prisma = new PrismaService();
  const school = await prisma.school.findFirst({
    where: {
      OR: [
        {
          students: {
            some: {
              userId,
            },
          },
        },
        {
          teachers: {
            some: {
              userId,
            },
          },
        },
      ],
    },
    select: {
      name: true,
    },
  });

  return school;
};
