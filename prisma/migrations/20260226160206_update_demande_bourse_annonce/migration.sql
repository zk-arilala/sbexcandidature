-- AlterTable
ALTER TABLE "DemandeBourse" ADD COLUMN     "annonce_bourse_externe_id" INTEGER;

-- AddForeignKey
ALTER TABLE "DemandeBourse" ADD CONSTRAINT "DemandeBourse_annonce_bourse_externe_id_fkey" FOREIGN KEY ("annonce_bourse_externe_id") REFERENCES "BourseExterne"("id") ON DELETE SET NULL ON UPDATE CASCADE;
