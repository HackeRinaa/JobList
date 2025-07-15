// Remove all users from the database using Prisma
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Delete all related records first
    const deletedProfiles = await prisma.profile.deleteMany({});
    const deletedSubscriptions = await prisma.subscription.deleteMany({});
    const deletedTokenPurchases = await prisma.tokenPurchase.deleteMany({});

    // Now delete all users
    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`Deleted ${deletedProfiles.count} profiles, ${deletedSubscriptions.count} subscriptions, ${deletedTokenPurchases.count} token purchases, and ${deletedUsers.count} users from the database.`);
  } catch (error) {
    console.error('Error deleting users and related data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 