-- DropForeignKey
ALTER TABLE "public"."Guest" DROP CONSTRAINT "Guest_event_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Module" DROP CONSTRAINT "Module_page_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Page" DROP CONSTRAINT "Page_event_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."Page" ADD CONSTRAINT "Page_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Guest" ADD CONSTRAINT "Guest_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Module" ADD CONSTRAINT "Module_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
