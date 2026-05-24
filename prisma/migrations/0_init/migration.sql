-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('draft', 'ready_to_publish', 'published', 'archived', 'under_review');

-- CreateEnum
CREATE TYPE "ArticleVisibility" AS ENUM ('public', 'unlisted', 'private');

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "agent_id" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" JSONB,
    "content_text" TEXT,
    "cover_image" TEXT,
    "status" "ArticleStatus" NOT NULL DEFAULT 'draft',
    "visibility" "ArticleVisibility" NOT NULL DEFAULT 'public',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "published_at" TIMESTAMP(3),
    "read_time_minutes" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "auto_saved_at" TIMESTAMP(3),
    "search_vector" tsvector,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleStats" (
    "id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "comment_count" INTEGER NOT NULL DEFAULT 0,
    "save_count" INTEGER NOT NULL DEFAULT 0,
    "share_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ArticleStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_search_vector_idx" ON "Article" USING GIN ("search_vector");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleStats_article_id_key" ON "ArticleStats"("article_id");

-- AddForeignKey
ALTER TABLE "ArticleStats" ADD CONSTRAINT "ArticleStats_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create Search Vector Concatenation Function
CREATE OR REPLACE FUNCTION article_search_vector_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.content_text, '')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Attach Trigger to runs BEFORE INSERT OR UPDATE on Article table
CREATE OR REPLACE TRIGGER article_search_vector_update
BEFORE INSERT OR UPDATE ON "Article"
FOR EACH ROW
EXECUTE FUNCTION article_search_vector_trigger();
