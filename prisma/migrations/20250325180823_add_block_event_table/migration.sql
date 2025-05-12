-- CreateTable
CREATE TABLE "BlockEvent" (
    "eventId" TEXT NOT NULL,
    "description" TEXT,
    "isFullDay" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BlockEvent_pkey" PRIMARY KEY ("eventId")
);

-- AddForeignKey
ALTER TABLE "BlockEvent" ADD CONSTRAINT "BlockEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert records for all existing BLOCK events
INSERT INTO "BlockEvent" ("eventId")
SELECT "id" FROM "Event"
WHERE "type" = 'BLOCK';