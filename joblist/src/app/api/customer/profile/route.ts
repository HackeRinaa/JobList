import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        createdListings: {
          include: {
            applications: {
              include: {
                worker: {
                  include: {
                    profile: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Format customer data
    const customerData = {
      id: user.id,
      name: user.name || '',
      email: user.email,
      phone: user.profile?.phone || '',
      location: user.profile?.location || '',
      city: user.profile?.city || '',
      postalCode: user.profile?.postalCode || '',
      imageUrl: user.profile?.imageUrl || '',
    };

    // Format listings data
    const listings = user.createdListings.map(listing => ({
      id: listing.id,
      title: listing.title,
      category: listing.category,
      location: listing.location,
      description: listing.description,
      postedDate: listing.createdAt.toISOString().split('T')[0],
      budget: listing.budget,
      status: listing.status.toLowerCase(),
      applications: listing.applications.map(app => ({
        id: app.id,
        workerName: app.worker.name || 'Unknown Worker',
        workerId: app.worker.id,
        message: app.message || '',
        estimatedPrice: app.estimatedPrice || '',
        status: app.status.toLowerCase(),
        profession: app.worker.profile?.profession || '',
        rating: app.worker.profile?.rating || 0,
        completedJobs: app.worker.profile?.completedJobs || 0,
        bio: app.worker.profile?.bio || '',
        phone: app.worker.profile?.phone || '',
        email: app.worker.email || '',
      })),
      assignedWorkerId: listing.assignedWorkerId,
    }));

    // For now, return demo data for completed listings and saved professionals
    // In a real app, these would come from the database
    const completedListings = [
      {
        id: "1",
        title: "Επισκευή πλυντηρίου",
        category: "APPLIANCE_REPAIR",
        location: "Αθήνα, Κολωνάκι",
        description: "Επισκευή πλυντηρίου Samsung",
        completionDate: "2024-05-10",
        budget: "80€",
        workerName: "Γιώργος Παπαδόπουλος",
        workerId: "worker1",
        rating: 5,
        feedback: "Άριστη δουλειά, επαγγελματική συμπεριφορά"
      },
      {
        id: "2",
        title: "Εγκατάσταση φωτιστικών",
        category: "ELECTRICIAN",
        location: "Αθήνα, Γλυφάδα",
        description: "Εγκατάσταση 5 φωτιστικών οροφής",
        completionDate: "2024-05-08",
        budget: "150€",
        workerName: "Νίκος Αντωνίου",
        workerId: "worker2",
        rating: 4,
        feedback: "Καλή δουλειά, μικρή καθυστέρηση"
      }
    ];

    const savedProfessionals = [
      {
        id: "1",
        name: "Γιώργος Παπαδόπουλος",
        profession: "Υδραυλικός",
        location: "Αθήνα, Κολωνάκι",
        rating: 4.8,
        completedJobs: 127,
        phone: "6912345678",
        email: "giorgos@example.com",
        bio: "Επαγγελματίας υδραυλικός με 15 χρόνια εμπειρίας. Εξειδίκευση σε επισκευές και εγκαταστάσεις σε κατοικίες και επαγγελματικούς χώρους.",
      },
      {
        id: "2",
        name: "Νίκος Αντωνίου",
        profession: "Ηλεκτρολόγος",
        location: "Αθήνα, Γλυφάδα",
        rating: 4.6,
        completedJobs: 98,
        phone: "6923456789",
        email: "nikos@example.com",
        bio: "Πιστοποιημένος ηλεκτρολόγος με εμπειρία σε οικιακές και βιομηχανικές εγκαταστάσεις. Άμεση εξυπηρέτηση και ποιοτική δουλειά.",
      }
    ];

    return NextResponse.json({
      customer: customerData,
      listings,
      completedListings,
      savedProfessionals,
    });

  } catch (error) {
    console.error('Error fetching customer profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, location, city, postalCode, imageUrl, email } = body;

    // Get user email from request body or headers
    const userEmail = email || request.headers.get('x-user-email');

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { profile: true }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: {
        name: name || undefined,
        profile: {
          upsert: {
            create: {
              phone: phone || '',
              location: location || '',
              city: city || '',
              postalCode: postalCode || '',
              imageUrl: imageUrl || '',
            },
            update: {
              phone: phone || undefined,
              location: location || undefined,
              city: city || undefined,
              postalCode: postalCode || undefined,
              imageUrl: imageUrl || undefined,
            }
          }
        }
      },
      include: {
        profile: true
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.profile?.phone,
        location: updatedUser.profile?.location,
        city: updatedUser.profile?.city,
        postalCode: updatedUser.profile?.postalCode,
        imageUrl: updatedUser.profile?.imageUrl,
      }
    });

  } catch (error) {
    console.error('Error updating customer profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 