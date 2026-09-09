ALTER TABLE "chatbot_rules" ADD COLUMN "title_en" TEXT;
ALTER TABLE "chatbot_rules" ADD COLUMN "keywords_en" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "chatbot_rules" ADD COLUMN "response_en" TEXT;
ALTER TABLE "chatbot_rules" ADD COLUMN "quick_replies_en" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
