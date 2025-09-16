import { BookingStatus, PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const tagSeeds = [
  "Editorial",
  "Runway",
  "Fashion Week",
  "Portrait",
  "Fine Art",
  "Commercial",
  "Art Direction",
];

const talentSeeds = [
  {
    handle: "giulia-rossi",
    email: "giulia.rossi@example.com",
    name: "Giulia Rossi",
    role: Role.MODEL,
    bio: "Florentine model blending couture heritage with contemporary editorial work. Frequent collaborator with Gucci Garden and Palazzo Pitti showcases.",
    location: "Florence, Italy",
    dayRate: 750,
    isFeatured: true,
    heroImageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2",
    tags: ["Editorial", "Runway", "Fashion Week"],
    portfolioImages: [
      {
        url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
        caption: "Runway finale at Fortezza da Basso",
        displayOrder: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        caption: "Editorial shoot in Oltrarno",
        displayOrder: 2,
      },
      {
        url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg",
        caption: "Palazzo evening wear look",
        displayOrder: 3,
      },
    ],
    availability: [
      {
        start: new Date("2025-03-12T08:00:00+01:00"),
        end: new Date("2025-03-12T16:00:00+01:00"),
        timezone: "Europe/Rome",
        notes: "Open for fashion editorial in Tuscany",
      },
      {
        start: new Date("2025-03-18T10:00:00+01:00"),
        end: new Date("2025-03-18T18:00:00+01:00"),
        timezone: "Europe/Rome",
      },
    ],
  },
  {
    handle: "luca-bianchi",
    email: "luca.bianchi@example.com",
    name: "Luca Bianchi",
    role: Role.ARTIST,
    bio: "Portrait photographer capturing the light of Tuscany with medium format film and experimental lighting setups.",
    location: "Florence, Italy",
    dayRate: 950,
    isFeatured: true,
    heroImageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    tags: ["Portrait", "Commercial", "Fine Art"],
    portfolioImages: [
      {
        url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
        caption: "Portrait series in Santa Croce",
        displayOrder: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        caption: "Studio lighting test",
        displayOrder: 2,
      },
      {
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
        caption: "Editorial for Firenze Magazine",
        displayOrder: 3,
      },
    ],
    availability: [
      {
        start: new Date("2025-03-14T09:00:00+01:00"),
        end: new Date("2025-03-14T17:00:00+01:00"),
        timezone: "Europe/Rome",
      },
      {
        start: new Date("2025-03-21T12:00:00+01:00"),
        end: new Date("2025-03-21T19:00:00+01:00"),
        timezone: "Europe/Rome",
      },
    ],
  },
  {
    handle: "marta-conti",
    email: "marta.conti@example.com",
    name: "Marta Conti",
    role: Role.MODEL,
    bio: "Muse for Italian ateliers with experience across campaign work, runway, and artist collaborations.",
    location: "Florence, Italy",
    dayRate: 680,
    isFeatured: true,
    heroImageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
    tags: ["Commercial", "Runway", "Editorial"],
    portfolioImages: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
        caption: "Boutique campaign in Via Tornabuoni",
        displayOrder: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1530023367847-a683933f4177",
        caption: "Fine art collaboration",
        displayOrder: 2,
      },
    ],
    availability: [
      {
        start: new Date("2025-03-16T09:30:00+01:00"),
        end: new Date("2025-03-16T13:30:00+01:00"),
        timezone: "Europe/Rome",
      },
    ],
  },
];

const clientSeed = {
  handle: "studio-aurora",
  email: "productions@studioaurora.it",
  name: "Studio Aurora Productions",
  role: Role.CLIENT,
  location: "Florence, Italy",
  bio: "Boutique production studio crafting editorial stories across Tuscany.",
  dayRate: null,
  isFeatured: false,
};

async function createTags() {
  await prisma.tag.deleteMany({});
  await prisma.tag.createMany({
    data: tagSeeds.map((name) => ({ name })),
    skipDuplicates: true,
  });
  return prisma.tag.findMany();
}

async function createUsers() {
  const tags = await createTags();

  const client = await prisma.user.upsert({
    where: { handle: clientSeed.handle },
    create: {
      ...clientSeed,
    },
    update: {
      ...clientSeed,
    },
  });

  const talents: Array<typeof client> = [];

  for (const seed of talentSeeds) {
    const user = await prisma.user.upsert({
      where: { handle: seed.handle },
      create: {
        handle: seed.handle,
        email: seed.email,
        name: seed.name,
        role: seed.role,
        bio: seed.bio,
        location: seed.location,
        dayRate: seed.dayRate ?? undefined,
        isFeatured: seed.isFeatured,
        heroImageUrl: seed.heroImageUrl,
      },
      update: {
        email: seed.email,
        name: seed.name,
        role: seed.role,
        bio: seed.bio,
        location: seed.location,
        dayRate: seed.dayRate ?? undefined,
        isFeatured: seed.isFeatured,
        heroImageUrl: seed.heroImageUrl,
      },
    });

    await prisma.userTag.deleteMany({ where: { userId: user.id } });
    const tagLookup = new Map(tags.map((tag) => [tag.name, tag.id]));
    await prisma.userTag.createMany({
      data: seed.tags
        .map((tagName) => tagLookup.get(tagName))
        .filter((tagId): tagId is number => Boolean(tagId))
        .map((tagId) => ({ userId: user.id, tagId })),
    });

    await prisma.portfolioImage.deleteMany({ where: { userId: user.id } });
    await prisma.portfolioImage.createMany({
      data: seed.portfolioImages.map((image) => ({
        userId: user.id,
        url: image.url,
        caption: image.caption,
        displayOrder: image.displayOrder,
      })),
    });

    await prisma.availabilitySlot.deleteMany({ where: { userId: user.id } });
    await prisma.availabilitySlot.createMany({
      data: seed.availability.map((slot) => ({
        userId: user.id,
        start: slot.start,
        end: slot.end,
        timezone: slot.timezone ?? "Europe/Rome",
        notes: slot.notes ?? null,
      })),
    });

    talents.push(user);
  }

  return { client, talents };
}

async function createBookings(clientId: string, talents: Array<{ id: string; handle: string }>) {
  if (talents.length < 2) return;

  const [giulia, luca] = talents;

  const bookings = await Promise.all([
    prisma.booking.upsert({
      where: { id: "11111111-1111-1111-1111-111111111111" },
      create: {
        id: "11111111-1111-1111-1111-111111111111",
        clientId,
        talentId: giulia.id,
        projectName: "Spring couture editorial",
        status: BookingStatus.CONFIRMED,
        start: new Date("2025-03-22T09:00:00+01:00"),
        end: new Date("2025-03-22T18:00:00+01:00"),
        budget: 2400,
        notes: "Shoot at Villa Cora with two looks prepared.",
      },
      update: {
        status: BookingStatus.CONFIRMED,
      },
    }),
    prisma.booking.upsert({
      where: { id: "22222222-2222-2222-2222-222222222222" },
      create: {
        id: "22222222-2222-2222-2222-222222222222",
        clientId,
        talentId: luca.id,
        projectName: "Portrait session for Palazzo Vecchio",
        status: BookingStatus.PENDING,
        start: new Date("2025-03-25T11:00:00+01:00"),
        end: new Date("2025-03-25T15:00:00+01:00"),
        budget: 1800,
        notes: "Focus on natural light compositions.",
      },
      update: {},
    }),
  ]);

  await prisma.message.deleteMany({});
  await prisma.message.createMany({
    data: [
      {
        bookingId: bookings[0].id,
        senderId: clientId,
        content:
          "Ciao Giulia! Sharing the moodboard shortly, let us know if the timing still works.",
      },
      {
        bookingId: bookings[0].id,
        senderId: giulia.id,
        content: "Grazie! Timing is perfect, I will arrive 30 minutes early for prep.",
      },
      {
        bookingId: bookings[1].id,
        senderId: clientId,
        content: "Luca, could we integrate a few 35mm shots for behind-the-scenes?",
      },
    ],
  });
}

async function main() {
  await prisma.message.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.portfolioImage.deleteMany();
  await prisma.userTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  const { client, talents } = await createUsers();
  await createBookings(
    client.id,
    talents.map((talent) => ({ id: talent.id, handle: talent.handle })),
  );

  console.log("Seeded Firenze Connect demo data.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
