-- Create required extensions for UUID generation (Supabase already enables these by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE "Role" AS ENUM ('ARTIST', 'MODEL', 'CLIENT');
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- Core tables
CREATE TABLE "User" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "supabaseId" UUID UNIQUE,
  "email" TEXT UNIQUE,
  "handle" TEXT UNIQUE NOT NULL,
  "name" TEXT,
  "role" "Role" NOT NULL DEFAULT 'ARTIST',
  "bio" TEXT,
  "location" TEXT NOT NULL DEFAULT 'Florence, Italy',
  "dayRate" INTEGER,
  "avatarUrl" TEXT,
  "heroImageUrl" TEXT,
  "isFeatured" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Tag" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "UserTag" (
  "userId" UUID NOT NULL,
  "tagId" INTEGER NOT NULL,
  "assignedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "UserTag_pkey" PRIMARY KEY ("userId", "tagId"),
  CONSTRAINT "UserTag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "UserTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "PortfolioImage" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "url" TEXT NOT NULL,
  "caption" TEXT,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "userId" UUID NOT NULL,
  CONSTRAINT "PortfolioImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "AvailabilitySlot" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL,
  "start" TIMESTAMPTZ NOT NULL,
  "end" TIMESTAMPTZ NOT NULL,
  "timezone" TEXT NOT NULL DEFAULT 'Europe/Rome',
  "notes" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "AvailabilitySlot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Booking" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "talentId" UUID NOT NULL,
  "clientId" UUID NOT NULL,
  "projectName" TEXT NOT NULL,
  "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
  "start" TIMESTAMPTZ NOT NULL,
  "end" TIMESTAMPTZ NOT NULL,
  "budget" INTEGER,
  "notes" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Booking_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Booking_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Message" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "bookingId" UUID NOT NULL,
  "senderId" UUID NOT NULL,
  "content" TEXT NOT NULL,
  "sentAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "readAt" TIMESTAMPTZ,
  CONSTRAINT "Message_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Indexes for relations & lookups
CREATE INDEX "PortfolioImage_userId_displayOrder_idx" ON "PortfolioImage" ("userId", "displayOrder");
CREATE INDEX "AvailabilitySlot_userId_start_idx" ON "AvailabilitySlot" ("userId", "start");
CREATE INDEX "Booking_talentId_start_idx" ON "Booking" ("talentId", "start");
CREATE INDEX "Booking_clientId_start_idx" ON "Booking" ("clientId", "start");
CREATE INDEX "Message_bookingId_sentAt_idx" ON "Message" ("bookingId", "sentAt");
