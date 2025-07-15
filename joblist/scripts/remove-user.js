import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function removeUser() {
  try {
    const email = 'marina.papadimitriou@outlook.com';
    
    console.log(`Looking for user with email: ${email}`);
    
    // Find the user first
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        subscription: true,
        applications: true,
        createdListings: true,
        assignedJobs: true,
        messages: true,
        reviewsReceived: true,
        reviewsGiven: true,
        tokenPurchases: true
      }
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('Found user:', {
      email: user.email,
      name: user.name,
      role: user.role
    });

    // Delete related records first to avoid foreign key constraints
    console.log('Deleting related records...');
    
    // Delete profile first
    if (user.profile) {
      await prisma.profile.delete({
        where: { userId: user.id }
      });
      console.log('Profile deleted');
    }
    
    // Delete subscription
    if (user.subscription) {
      await prisma.subscription.delete({
        where: { userId: user.id }
      });
      console.log('Subscription deleted');
    }
    
    // Delete token purchases
    if (user.tokenPurchases.length > 0) {
      await prisma.tokenPurchase.deleteMany({
        where: { userId: user.id }
      });
      console.log('Token purchases deleted');
    }
    
    // Delete messages
    if (user.messages.length > 0) {
      await prisma.message.deleteMany({
        where: { senderId: user.id }
      });
      console.log('Messages deleted');
    }
    
    // Delete applications
    if (user.applications.length > 0) {
      await prisma.application.deleteMany({
        where: { workerId: user.id }
      });
      console.log('Applications deleted');
    }
    
    // Delete reviews
    if (user.reviewsReceived.length > 0) {
      await prisma.review.deleteMany({
        where: { reviewedId: user.id }
      });
      console.log('Reviews received deleted');
    }
    
    if (user.reviewsGiven.length > 0) {
      await prisma.review.deleteMany({
        where: { reviewerId: user.id }
      });
      console.log('Reviews given deleted');
    }
    
    // Update job listings to remove assigned worker
    if (user.assignedJobs.length > 0) {
      await prisma.jobListing.updateMany({
        where: { assignedWorkerId: user.id },
        data: { assignedWorkerId: null }
      });
      console.log('Job assignments removed');
    }
    
    // Delete created listings
    if (user.createdListings.length > 0) {
      await prisma.jobListing.deleteMany({
        where: { customerId: user.id }
      });
      console.log('Created listings deleted');
    }
    
    // Now delete the user
    await prisma.user.delete({
      where: { email }
    });

    console.log('User successfully removed from database');
  } catch (error) {
    console.error('Error removing user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeUser(); 