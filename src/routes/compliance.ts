import { Router } from 'express';
const router = Router();

// Mock compliance data
const mockComplianceItems = [
  {
    id: '1',
    category: 'immigration',
    title: 'H1B Transfer Filing (I-129)',
    description: 'Submit H1B transfer petition to USCIS with all required documentation',
    status: 'compliant',
    lastUpdated: '2024-11-01',
    priority: 'high',
    documentRequired: true,
    assignedTo: 'Sarah Chen'
  },
  {
    id: '2',
    category: 'immigration',
    title: 'Premium Processing Election',
    description: 'File Form I-907 for expedited processing (15 calendar days)',
    status: 'compliant',
    lastUpdated: '2024-11-01',
    priority: 'medium',
    documentRequired: true,
    assignedTo: 'Sarah Chen'
  },
  {
    id: '3',
    category: 'employment',
    title: 'Labor Condition Application (LCA)',
    description: 'DOL certification for prevailing wage and working conditions',
    status: 'action-required',
    dueDate: '2024-12-15',
    lastUpdated: '2024-11-10',
    priority: 'high',
    documentRequired: true,
    assignedTo: 'Raj Patel'
  }
];

const mockRegulatoryUpdates = [
  {
    id: '1',
    date: '2024-11-15',
    title: 'USCIS Fee Schedule Update - Effective January 2025',
    type: 'fee-update',
    impact: 'medium',
    summary: 'Form I-129 filing fees will increase from $460 to $580. Premium processing remains at $2,805.',
    actionRequired: true,
    deadline: '2025-01-01'
  },
  {
    id: '2',
    date: '2024-11-01',
    title: 'New H1B Specialty Occupation Requirements',
    type: 'rule-change',
    impact: 'high',
    summary: 'Updated guidelines for demonstrating specialty occupation requirements with enhanced documentation standards.',
    actionRequired: true,
    deadline: '2024-12-31'
  }
];

const mockAuditTrail = [
  {
    id: '1',
    timestamp: '2024-11-15 14:30:00',
    user: 'Sarah Chen',
    action: 'Updated Compliance Status',
    category: 'Immigration',
    details: 'Marked H1B Transfer Filing as Compliant - USCIS Receipt Notice received',
    ipAddress: '192.168.1.100'
  },
  {
    id: '2',
    timestamp: '2024-11-15 11:15:00',
    user: 'Raj Patel',
    action: 'Document Upload',
    category: 'Employment',
    details: 'Uploaded LCA certification documents for DOL compliance',
    ipAddress: '192.168.1.101'
  }
];

// Get all compliance items
router.get('/items', (req, res) => {
  const { category, status } = req.query;
  let items = mockComplianceItems;
  
  if (category && category !== 'all') {
    items = items.filter(item => item.category === category);
  }
  
  if (status && status !== 'all') {
    items = items.filter(item => item.status === status);
  }
  
  res.json({ 
    success: true, 
    data: items,
    stats: {
      total: mockComplianceItems.length,
      compliant: mockComplianceItems.filter(item => item.status === 'compliant').length,
      warning: mockComplianceItems.filter(item => item.status === 'warning').length,
      actionRequired: mockComplianceItems.filter(item => item.status === 'action-required').length,
      pending: mockComplianceItems.filter(item => item.status === 'pending').length
    }
  });
});

// Get regulatory updates
router.get('/updates', (req, res) => {
  res.json({ 
    success: true, 
    data: mockRegulatoryUpdates 
  });
});

// Get audit trail
router.get('/audit', (req, res) => {
  res.json({ 
    success: true, 
    data: mockAuditTrail 
  });
});

// Get compliance overview
router.get('/overview', (req, res) => {
  const complianceScore = Math.round((mockComplianceItems.filter(item => item.status === 'compliant').length / mockComplianceItems.length) * 100);
  
  res.json({ 
    success: true, 
    data: {
      score: complianceScore,
      stats: {
        total: mockComplianceItems.length,
        compliant: mockComplianceItems.filter(item => item.status === 'compliant').length,
        warning: mockComplianceItems.filter(item => item.status === 'warning').length,
        actionRequired: mockComplianceItems.filter(item => item.status === 'action-required').length,
        pending: mockComplianceItems.filter(item => item.status === 'pending').length
      },
      recentActivity: mockAuditTrail.slice(0, 5)
    }
  });
});

export default router; 