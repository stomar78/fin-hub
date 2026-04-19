-- CreateTable
CREATE TABLE "AssessmentReport" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "filePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentReport_leadId_key" ON "AssessmentReport"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentReport_token_key" ON "AssessmentReport"("token");

-- AddForeignKey
ALTER TABLE "AssessmentReport" ADD CONSTRAINT "AssessmentReport_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
