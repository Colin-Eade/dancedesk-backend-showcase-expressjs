-- DropForeignKey
ALTER TABLE "ClassDancers" DROP CONSTRAINT "ClassDancers_memberId_fkey";

-- AddForeignKey
ALTER TABLE "ClassDancers" ADD CONSTRAINT "ClassDancers_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Dancer"("memberId") ON DELETE CASCADE ON UPDATE CASCADE;
