-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "role" TEXT;

-- CreateTable
CREATE TABLE "McpEvent" (
    "id" TEXT NOT NULL,
    "tool" TEXT NOT NULL,
    "payload" JSONB,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "McpEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "McpEvent_createdAt_idx" ON "McpEvent"("createdAt");
