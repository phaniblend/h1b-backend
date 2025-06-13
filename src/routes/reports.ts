import { Router } from 'express';
const router = Router();

// Mock analytics data
const mockMetrics = [
  {
    id: '1',
    title: 'Total Savings Achieved',
    value: '$34,700',
    change: '+$2,100 vs traditional',
    trend: 'up',
    category: 'financial'
  },
  {
    id: '2',
    title: 'Transfer Progress',
    value: '78%',
    change: '+12% this month',
    trend: 'up',
    category: 'progress'
  },
  {
    id: '3',
    title: 'Processing Time',
    value: '24 days',
    change: '6 days faster than average',
    trend: 'up',
    category: 'timeline'
  },
  {
    id: '4',
    title: 'Compliance Score',
    value: '97%',
    change: '+2% improvement',
    trend: 'up',
    category: 'compliance'
  }
];

const mockFinancialData = {
  totalPayments: 4500,
  projectedSavings: 104100,
  savingsRate: 94.4,
  annualSalary: 170000,
  employerCutSaved: 42500,
  h1bConnectFees: 9500,
  netSavings: 33000,
  roi: 347,
  paymentHistory: [
    {
      id: '1',
      date: '2024-11-01',
      description: 'Setup Fee',
      amount: 3500,
      status: 'paid',
      receiptUrl: '/receipts/setup-fee-2024-11-01.pdf'
    },
    {
      id: '2',
      date: '2024-11-15',
      description: 'Monthly Service Fee',
      amount: 500,
      status: 'paid',
      receiptUrl: '/receipts/monthly-fee-2024-11-15.pdf'
    },
    {
      id: '3',
      date: '2024-12-15',
      description: 'Monthly Service Fee',
      amount: 500,
      status: 'due',
      receiptUrl: null
    }
  ]
};

const mockComplianceData = [
  { label: 'Immigration (USCIS)', value: 95, category: 'immigration' },
  { label: 'Employment (DOL)', value: 98, category: 'employment' },
  { label: 'Tax (IRS)', value: 100, category: 'tax' },
  { label: 'Corporate', value: 96, category: 'corporate' }
];

const mockTimeline = [
  {
    id: '1',
    date: '2024-11-15',
    title: 'USCIS Receipt Notice',
    description: 'Form I-129 petition received and processing initiated',
    status: 'completed',
    category: 'filing'
  },
  {
    id: '2',
    date: '2024-11-10',
    title: 'Premium Processing Filed',
    description: 'Form I-907 submitted for expedited processing',
    status: 'completed',
    category: 'filing'
  },
  {
    id: '3',
    date: '2024-11-01',
    title: 'Initial Payment Processed',
    description: 'Setup fee of $3,500 successfully processed',
    status: 'completed',
    category: 'payment'
  },
  {
    id: '4',
    date: '2024-12-01',
    title: 'USCIS Interview (if required)',
    description: 'Potential interview scheduling based on case complexity',
    status: 'pending',
    category: 'milestone'
  },
  {
    id: '5',
    date: '2024-12-15',
    title: 'Expected Approval',
    description: 'Target completion date for H1B transfer approval',
    status: 'pending',
    category: 'milestone'
  }
];

const mockTransferProgress = [
  { label: 'Application Filed', value: 100 },
  { label: 'Premium Processing', value: 100 },
  { label: 'USCIS Review', value: 85 },
  { label: 'Approval Pending', value: 60 },
  { label: 'Transfer Complete', value: 0 }
];

// Get overview analytics
router.get('/overview', (req, res) => {
  res.json({
    success: true,
    data: {
      metrics: mockMetrics,
      transferProgress: mockTransferProgress,
      summary: {
        transferCompletion: 78,
        annualSavings: 33000,
        complianceScore: 97,
        processingTime: 24,
        roi: 347
      }
    }
  });
});

// Get financial analytics
router.get('/financial', (req, res) => {
  res.json({
    success: true,
    data: mockFinancialData
  });
});

// Get compliance analytics
router.get('/compliance', (req, res) => {
  res.json({
    success: true,
    data: {
      scores: mockComplianceData,
      timeline: mockTimeline,
      overallScore: 97
    }
  });
});

// Get performance metrics
router.get('/metrics', (req, res) => {
  const { timeRange = '6months', category = 'all' } = req.query;
  
  let filteredMetrics = mockMetrics;
  if (category !== 'all') {
    filteredMetrics = mockMetrics.filter(metric => metric.category === category);
  }
  
  res.json({
    success: true,
    data: {
      metrics: filteredMetrics,
      timeRange,
      category,
      generatedAt: new Date().toISOString()
    }
  });
});

// Generate custom report
router.post('/generate', (req, res) => {
  const { sections, format, timeRange } = req.body;
  
  // Simulate report generation
  const reportId = `report_${Date.now()}`;
  const reportData = {
    id: reportId,
    format: format || 'pdf',
    sections: sections || ['financial', 'compliance', 'timeline'],
    timeRange: timeRange || '6months',
    generatedAt: new Date().toISOString(),
    downloadUrl: `/api/reports/download/${reportId}`,
    status: 'generated'
  };
  
  res.json({
    success: true,
    data: reportData
  });
});

// Download report (mock)
router.get('/download/:reportId', (req, res) => {
  const { reportId } = req.params;
  
  // In a real implementation, this would serve the actual file
  res.json({
    success: true,
    data: {
      reportId,
      message: 'Report download would start in production',
      downloadUrl: `/reports/${reportId}.pdf`
    }
  });
});

// Get available report templates
router.get('/templates', (req, res) => {
  const templates = [
    {
      id: 'financial',
      name: 'Financial Summary',
      description: 'Complete payment and savings report',
      format: 'pdf',
      icon: 'FileText'
    },
    {
      id: 'compliance',
      name: 'Compliance Report',
      description: 'Legal compliance and audit trail',
      format: 'pdf',
      icon: 'BarChart3'
    },
    {
      id: 'tax',
      name: 'Tax Summary',
      description: 'Tax-ready expense documentation',
      format: 'pdf',
      icon: 'PieChart'
    },
    {
      id: 'timeline',
      name: 'Timeline Report',
      description: 'Complete transfer timeline',
      format: 'pdf',
      icon: 'Clock'
    },
    {
      id: 'team',
      name: 'Team Activity',
      description: 'Advisor and support interactions',
      format: 'pdf',
      icon: 'Users'
    },
    {
      id: 'complete',
      name: 'Complete Package',
      description: 'All reports in one download',
      format: 'zip',
      icon: 'Briefcase'
    }
  ];
  
  res.json({
    success: true,
    data: templates
  });
});

export default router; 