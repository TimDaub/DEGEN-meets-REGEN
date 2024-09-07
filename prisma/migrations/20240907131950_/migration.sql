-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "bio" TEXT,
    "custody" TEXT NOT NULL,
    "displayName" TEXT,
    "fid" INTEGER NOT NULL,
    "pfpUrl" TEXT,
    "username" TEXT NOT NULL,
    "verifications" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_custody_key" ON "User"("custody");

-- CreateIndex
CREATE UNIQUE INDEX "User_fid_key" ON "User"("fid");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
