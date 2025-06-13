import { Router } from 'express';
const router = Router();

// Mock advisor data
const mockAdvisors = [
  {
    id: 'advisor_001',
    name: 'Sarah Chen',
    title: 'Senior Immigration Attorney',
    rating: 4.9,
    reviewCount: 127,
    experience: '8+ years',
    specialties: ['H1B Transfers', 'USCIS Procedures', 'Immigration Law'],
    languages: ['English', 'Mandarin'],
    background: 'Former USCIS officer with extensive experience in H1B transfer processes',
    avatar: '/avatars/sarah-chen.jpg',
    availability: {
      nextAvailable: '2024-11-20',
      timezone: 'PST'
    }
  },
  {
    id: 'advisor_002',
    name: 'Raj Patel',
    title: 'Immigration Law Specialist',
    rating: 4.8,
    reviewCount: 89,
    experience: '6+ years',
    specialties: ['Employment Law', 'DOL Compliance', 'Legal Documentation'],
    languages: ['English', 'Hindi', 'Gujarati'],
    background: 'Expert in employment-based immigration with focus on H1B compliance',
    avatar: '/avatars/raj-patel.jpg',
    availability: {
      nextAvailable: '2024-11-18',
      timezone: 'EST'
    }
  },
  {
    id: 'advisor_003',
    name: 'Maria Rodriguez',
    title: 'Client Success Manager',
    rating: 4.9,
    reviewCount: 156,
    experience: '5+ years',
    specialties: ['Client Relations', 'Process Management', 'Timeline Coordination'],
    languages: ['English', 'Spanish'],
    background: 'Specialized in guiding clients through complex immigration processes',
    avatar: '/avatars/maria-rodriguez.jpg',
    availability: {
      nextAvailable: '2024-11-17',
      timezone: 'CST'
    }
  }
];

const mockConsultationTypes = [
  {
    id: 'discovery',
    name: 'Discovery Call',
    duration: 30,
    price: 0,
    description: 'FREE consultation to understand your H1B transfer needs',
    recommended: true,
    features: ['Initial assessment', 'Timeline overview', 'Q&A session']
  },
  {
    id: 'strategy',
    name: 'Strategy Session',
    duration: 60,
    price: 150,
    description: 'Detailed planning session for your H1B transfer strategy',
    recommended: false,
    features: ['Detailed case review', 'Strategic planning', 'Document checklist', 'Timeline planning']
  },
  {
    id: 'urgent',
    name: 'Urgent Consultation',
    duration: 45,
    price: 200,
    description: 'Priority consultation with 24-hour response time',
    recommended: false,
    features: ['Priority scheduling', '24hr response', 'Urgent case review', 'Expedited planning']
  }
];

const mockAvailability: Record<string, string[]> = {
  '2024-11-17': ['09:00', '10:30', '14:00', '15:30'],
  '2024-11-18': ['09:00', '11:00', '13:00', '16:00'],
  '2024-11-19': ['10:00', '11:30', '14:30', '16:30'],
  '2024-11-20': ['09:30', '11:00', '13:30', '15:00'],
  '2024-11-21': ['10:00', '14:00', '15:30', '17:00'],
  '2024-11-22': ['09:00', '10:30', '13:00', '14:30']
};

const mockBookings = [
  {
    id: 'booking_001',
    advisorId: 'advisor_001',
    consultationType: 'discovery',
    date: '2024-11-20',
    time: '10:00',
    status: 'confirmed',
    clientInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0123',
      company: 'Tech Corp',
      currentStatus: 'H1B on other employer',
      urgency: 'medium'
    },
    createdAt: '2024-11-15T10:30:00Z'
  }
];

// Get all advisors
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: mockAdvisors
  });
});

// Get specific advisor
router.get('/:advisorId', (req, res) => {
  const { advisorId } = req.params;
  const advisor = mockAdvisors.find(a => a.id === advisorId);
  
  if (!advisor) {
    return res.status(404).json({
      success: false,
      message: 'Advisor not found'
    });
  }
  
  res.json({
    success: true,
    data: advisor
  });
});

// Get consultation types
router.get('/consultation/types', (req, res) => {
  res.json({
    success: true,
    data: mockConsultationTypes
  });
});

// Get advisor availability
router.get('/:advisorId/availability', (req, res) => {
  const { advisorId } = req.params;
  const { date } = req.query;
  
  if (date) {
    const dayAvailability = mockAvailability[date as string] || [];
    return res.json({
      success: true,
      data: {
        date,
        timeSlots: dayAvailability
      }
    });
  }
  
  res.json({
    success: true,
    data: mockAvailability
  });
});

// Book consultation
router.post('/book', (req, res) => {
  const { advisorId, consultationType, date, time, clientInfo } = req.body;
  
  const advisor = mockAdvisors.find(a => a.id === advisorId);
  const consultation = mockConsultationTypes.find(c => c.id === consultationType);
  
  if (!advisor || !consultation) {
    return res.status(400).json({
      success: false,
      message: 'Invalid advisor or consultation type'
    });
  }
  
  const booking = {
    id: `booking_${Date.now()}`,
    advisorId,
    advisorName: advisor.name,
    consultationType,
    consultationName: consultation.name,
    date,
    time,
    duration: consultation.duration,
    price: consultation.price,
    status: 'confirmed',
    clientInfo,
    createdAt: new Date().toISOString(),
    meetingLink: `https://meet.h1bconnect.com/${Date.now()}`,
    confirmationCode: `H1B${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  };
  
  res.json({
    success: true,
    data: booking,
    message: 'Consultation booked successfully'
  });
});

// Get user bookings
router.get('/bookings/user/:userId', (req, res) => {
  const { userId } = req.params;
  
  // In a real implementation, filter by user ID
  res.json({
    success: true,
    data: mockBookings
  });
});

// Cancel booking
router.post('/bookings/:bookingId/cancel', (req, res) => {
  const { bookingId } = req.params;
  
  res.json({
    success: true,
    data: {
      bookingId,
      status: 'cancelled',
      refundAmount: 0, // Free consultations
      cancellationReason: req.body.reason || 'User requested'
    },
    message: 'Booking cancelled successfully'
  });
});

// Reschedule booking
router.post('/bookings/:bookingId/reschedule', (req, res) => {
  const { bookingId } = req.params;
  const { newDate, newTime } = req.body;
  
  res.json({
    success: true,
    data: {
      bookingId,
      newDate,
      newTime,
      status: 'rescheduled',
      updatedAt: new Date().toISOString()
    },
    message: 'Booking rescheduled successfully'
  });
});

// Get advisor reviews
router.get('/:advisorId/reviews', (req, res) => {
  const { advisorId } = req.params;
  
  const mockReviews = [
    {
      id: 'review_001',
      clientName: 'Anonymous Client',
      rating: 5,
      comment: 'Sarah was incredibly helpful and guided me through the entire H1B transfer process seamlessly.',
      date: '2024-11-10',
      consultationType: 'strategy'
    },
    {
      id: 'review_002',
      clientName: 'Anonymous Client',
      rating: 5,
      comment: 'Professional, knowledgeable, and responsive. Highly recommend!',
      date: '2024-11-08',
      consultationType: 'discovery'
    }
  ];
  
  res.json({
    success: true,
    data: mockReviews
  });
});

export default router; 