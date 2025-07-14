import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestCustomer() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'marina03@outlook.com.gr' }
    });

    if (existingUser) {
      console.log('User already exists:', existingUser);
      return;
    }

    // Create test customer
    const customer = await prisma.user.create({
      data: {
        email: 'marina03@outlook.com.gr',
        name: 'Marina Papadimitriou',
        role: 'CUSTOMER',
        profile: {
          create: {
            phone: '6912345678',
            location: 'Αθήνα, Κολωνάκι',
            city: 'Αθήνα',
            postalCode: '10673',
            bio: 'Test customer profile'
          }
        }
      },
      include: {
        profile: true
      }
    });

    console.log('Test customer created:', customer);

    // Create some test job listings
    const jobListing1 = await prisma.jobListing.create({
      data: {
        title: 'Επισκευή υδραυλικών',
        category: 'PLUMBER',
        location: 'Αθήνα, Κολωνάκι',
        description: 'Διαρροή στο μπάνιο, χρειάζεται άμεση επισκευή',
        budget: 'Αναμένεται προσφορά',
        customerId: customer.id,
        status: 'PENDING'
      }
    });

    const jobListing2 = await prisma.jobListing.create({
      data: {
        title: 'Εγκατάσταση κλιματιστικού',
        category: 'HVAC_TECHNICIAN',
        location: 'Αθήνα, Γλυφάδα',
        description: 'Εγκατάσταση κλιματιστικού 12άρι inverter',
        budget: 'Αναμένεται προσφορά',
        customerId: customer.id,
        status: 'PENDING'
      }
    });

    console.log('Test job listings created:', { jobListing1, jobListing2 });

  } catch (error) {
    console.error('Error creating test customer:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestCustomer(); 