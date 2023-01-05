import { PrismaService } from 'src/modules/prisma';

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
