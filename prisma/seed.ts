import { MemberRole, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const organizationId = '4ed44888-9f0d-48b3-aa5c-749870f7ec0f';

async function main() {
  //#region ORGANIZATION
  await prisma.organization.upsert({
    where: { id: organizationId },
    update: {},
    create: {
      id: organizationId,
      name: 'The Dance Organization',
    },
  });
  //#endregion
  //#region ADMIN USERS
  await prisma.member.upsert({
    where: { id: '1fa5ed7f-d807-47c3-94c4-88d50c267457' },
    update: {},
    create: {
      id: '1fa5ed7f-d807-47c3-94c4-88d50c267457',
      organizationId,
      firstName: 'John',
      lastName: 'Smith',
      role: MemberRole.ADMIN,
    },
  });
  await prisma.member.upsert({
    where: { id: '20dce726-b168-4e1b-82eb-32e5e389ab36' },
    update: {},
    create: {
      id: '20dce726-b168-4e1b-82eb-32e5e389ab36',
      organizationId,
      firstName: 'Tom',
      lastName: 'Jones',
      role: MemberRole.ADMIN,
    },
  });
  //#endregion
  //#region TEACHERS
  await prisma.member.upsert({
    where: { id: 'a7c8d9e0-f1a2-3b4c-5d6e-7f8a9b0c1d2e' },
    update: {},
    create: {
      id: 'a7c8d9e0-f1a2-3b4c-5d6e-7f8a9b0c1d2e',
      organizationId,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: MemberRole.TEACHER,
    },
  });
  await prisma.member.upsert({
    where: { id: 'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e' },
    update: {},
    create: {
      id: 'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e',
      organizationId,
      firstName: 'Michael',
      lastName: 'Chen',
      role: MemberRole.TEACHER,
    },
  });
  await prisma.member.upsert({
    where: { id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f' },
    update: {},
    create: {
      id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
      organizationId,
      firstName: 'Emily',
      lastName: 'Rodriguez',
      role: MemberRole.TEACHER,
    },
  });
  await prisma.member.upsert({
    where: { id: 'd5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a' },
    update: {},
    create: {
      id: 'd5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a',
      organizationId,
      firstName: 'David',
      lastName: 'Williams',
      role: MemberRole.TEACHER,
    },
  });
  //#endregion
  //#region DANCERS
  await prisma.member.upsert({
    where: { id: 'e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b' },
    update: {},
    create: {
      id: 'e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b',
      organizationId,
      firstName: 'Emma',
      lastName: 'Taylor',
      role: MemberRole.DANCER,
    },
  });
  await prisma.dancer.upsert({
    where: { memberId: 'e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b' },
    update: {},
    create: {
      memberId: 'e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b',
      dateOfBirth: new Date('2009-04-15'),
    },
  });
  await prisma.member.upsert({
    where: { id: 'f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c' },
    update: {},
    create: {
      id: 'f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c',
      organizationId,
      firstName: 'Noah',
      lastName: 'Martinez',
      role: MemberRole.DANCER,
    },
  });
  await prisma.dancer.upsert({
    where: { memberId: 'f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c' },
    update: {},
    create: {
      memberId: 'f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c',
      dateOfBirth: new Date('2010-07-22'),
    },
  });
  await prisma.member.upsert({
    where: { id: 'a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d' },
    update: {},
    create: {
      id: 'a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d',
      organizationId,
      firstName: 'Olivia',
      lastName: 'Wilson',
      role: MemberRole.DANCER,
    },
  });
  await prisma.dancer.upsert({
    where: { memberId: 'a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d' },
    update: {},
    create: {
      memberId: 'a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d',
      dateOfBirth: new Date('2011-03-10'),
    },
  });
  await prisma.member.upsert({
    where: { id: 'b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e' },
    update: {},
    create: {
      id: 'b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e',
      organizationId,
      firstName: 'Lucas',
      lastName: 'Garcia',
      role: MemberRole.DANCER,
    },
  });
  await prisma.dancer.upsert({
    where: { memberId: 'b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e' },
    update: {},
    create: {
      memberId: 'b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e',
      dateOfBirth: new Date('2013-09-05'),
    },
  });
  await prisma.member.upsert({
    where: { id: 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f' },
    update: {},
    create: {
      id: 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f',
      organizationId,
      firstName: 'Sophia',
      lastName: 'Anderson',
      role: MemberRole.DANCER,
    },
  });
  await prisma.dancer.upsert({
    where: { memberId: 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f' },
    update: {},
    create: {
      memberId: 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f',
      dateOfBirth: new Date('2014-01-30'),
    },
  });
  await prisma.member.upsert({
    where: { id: 'd6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a' },
    update: {},
    create: {
      id: 'd6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a',
      organizationId,
      firstName: 'Ethan',
      lastName: 'Brown',
      role: MemberRole.DANCER,
    },
  });
  await prisma.dancer.upsert({
    where: { memberId: 'd6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a' },
    update: {},
    create: {
      memberId: 'd6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a',
      dateOfBirth: new Date('2015-11-12'),
    },
  });
  await prisma.member.upsert({
    where: { id: 'e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b' },
    update: {},
    create: {
      id: 'e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b',
      organizationId,
      firstName: 'Isabella',
      lastName: 'Nguyen',
      role: MemberRole.DANCER,
    },
  });
  await prisma.dancer.upsert({
    where: { memberId: 'e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b' },
    update: {},
    create: {
      memberId: 'e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b',
      dateOfBirth: new Date('2017-06-18'),
    },
  });
  await prisma.member.upsert({
    where: { id: 'f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c' },
    update: {},
    create: {
      id: 'f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c',
      organizationId,
      firstName: 'Mason',
      lastName: 'Thompson',
      role: MemberRole.DANCER,
    },
  });
  await prisma.dancer.upsert({
    where: { memberId: 'f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c' },
    update: {},
    create: {
      memberId: 'f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c',
      dateOfBirth: new Date('2019-02-25'),
    },
  });
  await prisma.member.upsert({
    where: { id: 'a9b0c1d2-e3f4-5a6b-7c8d-9e0f1a2b3c4d' },
    update: {},
    create: {
      id: 'a9b0c1d2-e3f4-5a6b-7c8d-9e0f1a2b3c4d',
      organizationId,
      firstName: 'Ava',
      lastName: 'Lee',
      role: MemberRole.DANCER,
    },
  });
  await prisma.dancer.upsert({
    where: { memberId: 'a9b0c1d2-e3f4-5a6b-7c8d-9e0f1a2b3c4d' },
    update: {},
    create: {
      memberId: 'a9b0c1d2-e3f4-5a6b-7c8d-9e0f1a2b3c4d',
      dateOfBirth: new Date('2021-05-08'),
    },
  });
  await prisma.member.upsert({
    where: { id: 'b0c1d2e3-f4a5-6b7c-8d9e-0f1a2b3c4d5e' },
    update: {},
    create: {
      id: 'b0c1d2e3-f4a5-6b7c-8d9e-0f1a2b3c4d5e',
      organizationId,
      firstName: 'Jackson',
      lastName: 'Park',
      role: MemberRole.DANCER,
    },
  });
  await prisma.dancer.upsert({
    where: { memberId: 'b0c1d2e3-f4a5-6b7c-8d9e-0f1a2b3c4d5e' },
    update: {},
    create: {
      memberId: 'b0c1d2e3-f4a5-6b7c-8d9e-0f1a2b3c4d5e',
      dateOfBirth: new Date('2018-08-14'),
    },
  });
  //#endregion
  //#region LOCATIONS
  await prisma.location.upsert({
    where: { id: '8073d76d-838f-489c-a275-977d232b18d5' },
    update: {},
    create: {
      id: '8073d76d-838f-489c-a275-977d232b18d5',
      organizationId,
      name: 'Main Street Location',
      address: '10 Main Street',
      city: 'Whitby',
      province: 'Ontario',
      country: 'Canada',
    },
  });
  //#endregion
  //#region ROOMS
  await prisma.room.upsert({
    where: { id: '39a2cc62-888b-4fd9-ae7c-41b46c755c6b' },
    update: {},
    create: {
      id: '39a2cc62-888b-4fd9-ae7c-41b46c755c6b',
      organizationId,
      name: 'Studio A',
      locationId: '8073d76d-838f-489c-a275-977d232b18d5',
    },
  });
  await prisma.room.upsert({
    where: { id: 'f3b9d3e1-a8c0-4e9b-9f7d-76c53e8f4e2a' },
    update: {},
    create: {
      id: 'f3b9d3e1-a8c0-4e9b-9f7d-76c53e8f4e2a',
      organizationId,
      name: 'Studio B',
      locationId: '8073d76d-838f-489c-a275-977d232b18d5',
    },
  });
  await prisma.room.upsert({
    where: { id: '2c6f7b8a-5d4e-3f2c-1a9b-8c7d6e5f4a3b' },
    update: {},
    create: {
      id: '2c6f7b8a-5d4e-3f2c-1a9b-8c7d6e5f4a3b',
      organizationId,
      name: 'Studio C',
      locationId: '8073d76d-838f-489c-a275-977d232b18d5',
    },
  });
  await prisma.room.upsert({
    where: { id: '9d8c7b6a-5e4f-3d2c-1b9a-8e7f6d5c4b3a' },
    update: {},
    create: {
      id: '9d8c7b6a-5e4f-3d2c-1b9a-8e7f6d5c4b3a',
      organizationId,
      name: 'Studio D',
      locationId: '8073d76d-838f-489c-a275-977d232b18d5',
    },
  });
  //#endregion
}
main()
  .then(async () => {
    console.log('Seed successful.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
