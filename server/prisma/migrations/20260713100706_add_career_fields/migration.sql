/*
  Warnings:

  - Added the required column `category` to the `Career` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Career" ADD COLUMN     "automationRisk" INTEGER,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "certifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "companiesHiring" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "dailyWork" TEXT,
ADD COLUMN     "futureDemand" INTEGER,
ADD COLUMN     "growthRate" INTEGER,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "learningResources" JSONB,
ADD COLUMN     "personalityTraits" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "preferredInterests" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "projectIdeas" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "requiredSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "requiredSubjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "roadmap" JSONB,
ADD COLUMN     "salaryGlobalMax" INTEGER,
ADD COLUMN     "salaryGlobalMin" INTEGER,
ADD COLUMN     "salaryIndiaMax" INTEGER,
ADD COLUMN     "salaryIndiaMin" INTEGER,
ADD COLUMN     "workEnvironment" TEXT;
