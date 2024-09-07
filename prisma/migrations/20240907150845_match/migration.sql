-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "user1Fid" INTEGER NOT NULL,
    "user2Fid" INTEGER NOT NULL,
    "matchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Match_user1Fid_user2Fid_key" ON "Match"("user1Fid", "user2Fid");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_user1Fid_fkey" FOREIGN KEY ("user1Fid") REFERENCES "User"("fid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_user2Fid_fkey" FOREIGN KEY ("user2Fid") REFERENCES "User"("fid") ON DELETE RESTRICT ON UPDATE CASCADE;
