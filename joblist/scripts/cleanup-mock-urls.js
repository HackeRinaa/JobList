import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupMockUrls() {
  try {
    console.log('Cleaning up mock image URLs...');

    // Find all profiles with mock URLs
    const profilesWithMockUrls = await prisma.profile.findMany({
      where: {
        imageUrl: {
          contains: 'your-storage-service.com'
        }
      }
    });

    console.log(`Found ${profilesWithMockUrls.length} profiles with mock URLs`);

    // Update them to use a placeholder image
    const placeholderUrl = 'https://via.placeholder.com/150x150?text=Profile';
    
    for (const profile of profilesWithMockUrls) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: { imageUrl: placeholderUrl }
      });
      console.log(`Updated profile ${profile.id}`);
    }

    console.log('Cleanup completed successfully!');
  } catch (error) {
    console.error('Error cleaning up mock URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupMockUrls(); 