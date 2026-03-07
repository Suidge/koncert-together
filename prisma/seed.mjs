import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  const artist = await prisma.artist.upsert({
    where: { slug: "seventeen" },
    update: {},
    create: {
      slug: "seventeen",
      name: "SEVENTEEN",
      nameKo: "세븐틴",
      description: "Self-producing K-pop group with large-scale global touring."
    }
  });

  const venue = await prisma.venue.upsert({
    where: { slug: "kspo-dome" },
    update: {},
    create: {
      slug: "kspo-dome",
      name: "KSPO Dome",
      city: "Seoul",
      country: "South Korea",
      timezone: "Asia/Seoul"
    }
  });

  const tour = await prisma.tour.upsert({
    where: { slug: "seventeen-world-tour-2026" },
    update: {},
    create: {
      slug: "seventeen-world-tour-2026",
      name: "SEVENTEEN World Tour",
      year: 2026,
      artistId: artist.id
    }
  });

  const event = await prisma.event.upsert({
    where: { slug: "svt-seoul-2026" },
    update: {},
    create: {
      slug: "svt-seoul-2026",
      title: "SEVENTEEN World Tour in Seoul",
      description:
        "Opening night for the Seoul leg. Includes fanclub presale and official ticket entry.",
      startAt: new Date("2026-04-18T19:00:00+09:00"),
      status: "ON_SALE",
      sourceLabel: "Official artist notice",
      sourceUrl: "https://example.com/seventeen-seoul",
      purchaseHint: "Fanclub members should complete presale verification before checkout.",
      artistId: artist.id,
      tourId: tour.id,
      venueId: venue.id,
      ticketLinks: {
        create: [
          {
            label: "Official Ticket",
            href: "https://example.com/tickets/seventeen-seoul",
            type: "OFFICIAL"
          },
          {
            label: "Fanclub Presale",
            href: "https://example.com/fanclub/seventeen-seoul",
            type: "FANCLUB"
          }
        ]
      }
    }
  });

  await prisma.sourceSnapshot.create({
    data: {
      eventId: event.id,
      sourceType: "official_notice",
      sourceLabel: "Official artist notice",
      sourceUrl: "https://example.com/seventeen-seoul",
      rawPayload: {
        title: "SEVENTEEN World Tour in Seoul",
        city: "Seoul"
      },
      normalized: {
        eventSlug: event.slug,
        status: event.status
      }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
