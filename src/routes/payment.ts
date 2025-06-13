import { Router } from 'express';
const router = Router();

// Mock payment data
const mockTransactions = [
  {
    id: 'txn_001',
    date: '2024-11-01',
    description: 'H1B Transfer Setup Fee',
    amount: 3500,
    status: 'completed',
    paymentMethod: 'Credit Card (**** 4242)',
    receiptUrl: '/receipts/setup-fee-2024-11-01.pdf',
    type: 'setup_fee'
  },
  {
    id: 'txn_002',
    date: '2024-11-15',
    description: 'Monthly Service Fee - November',
    amount: 500,
    status: 'completed',
    paymentMethod: 'Credit Card (**** 4242)',
    receiptUrl: '/receipts/monthly-fee-2024-11-15.pdf',
    type: 'monthly_fee'
  },
  {
    id: 'txn_003',
    date: '2024-12-15',
    description: 'Monthly Service Fee - December',
    amount: 500,
    status: 'pending',
    paymentMethod: 'Credit Card (**** 4242)',
    receiptUrl: null,
    type: 'monthly_fee',
    dueDate: '2024-12-15'
  }
];

const mockPaymentMethods = [
  {
    id: 'pm_001',
    type: 'credit_card',
    brand: 'visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2027,
    isDefault: true,
    holderName: 'John Doe'
  },
  {
    id: 'pm_002',
    type: 'bank_account',
    bankName: 'Chase Bank',
    last4: '6789',
    accountType: 'checking',
    isDefault: false,
    holderName: 'John Doe'
  }
];

const mockSavingsData = {
  annualSalary: 170000,
  traditionalModel: {
    employerCut: 42500,
    takeHome: 127500
  },
  h1bConnectModel: {
    setupFee: 3500,
    monthlyFee: 6000,
    totalFees: 9500,
    takeHome: 160500
  },
  annualSavings: 33000,
  projectedSavings: {
    year1: 33000,
    year2: 66000,
    year3: 99000
  }
};

// Get payment overview
router.get('/overview', (req, res) => {
  const totalPaid = mockTransactions
    .filter(txn => txn.status === 'completed')
    .reduce((sum, txn) => sum + txn.amount, 0);
  
  const pendingAmount = mockTransactions
    .filter(txn => txn.status === 'pending')
    .reduce((sum, txn) => sum + txn.amount, 0);
  
  const nextPayment = mockTransactions.find(txn => txn.status === 'pending');
  
  res.json({
    success: true,
    data: {
      totalPaid,
      pendingAmount,
      nextPayment,
      savings: mockSavingsData,
      recentTransactions: mockTransactions.slice(0, 5)
    }
  });
});

// Get all transactions
router.get('/transactions', (req, res) => {
  const { status, type, limit = 10 } = req.query;
  let transactions = mockTransactions;
  
  if (status && status !== 'all') {
    transactions = transactions.filter(txn => txn.status === status);
  }
  
  if (type && type !== 'all') {
    transactions = transactions.filter(txn => txn.type === type);
  }
  
  const limitNum = parseInt(limit as string);
  if (limitNum > 0) {
    transactions = transactions.slice(0, limitNum);
  }
  
  res.json({
    success: true,
    data: transactions
  });
});

// Get payment methods
router.get('/methods', (req, res) => {
  res.json({
    success: true,
    data: mockPaymentMethods
  });
});

// Add payment method
router.post('/methods', (req, res) => {
  const { type, details } = req.body;
  
  const newMethod = {
    id: `pm_${Date.now()}`,
    type,
    ...details,
    isDefault: false,
    addedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: newMethod,
    message: 'Payment method added successfully'
  });
});

// Process payment
router.post('/process', (req, res) => {
  const { amount, description, paymentMethodId } = req.body;
  
  const newTransaction = {
    id: `txn_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    description,
    amount,
    status: 'processing',
    paymentMethod: 'Credit Card (**** 4242)',
    receiptUrl: null,
    type: 'manual_payment'
  };
  
  // Simulate payment processing
  setTimeout(() => {
    (newTransaction as any).status = 'completed';
    (newTransaction as any).receiptUrl = `/receipts/payment-${newTransaction.id}.pdf`;
  }, 2000);
  
  res.json({
    success: true,
    data: newTransaction,
    message: 'Payment processing initiated'
  });
});

// Get savings calculator data
router.get('/savings', (req, res) => {
  const { salary, employerCut, hours, weeks } = req.query;
  
  let calculatedSavings = mockSavingsData;
  
  if (salary) {
    const annualSalary = parseInt(salary as string);
    const cutPercentage = employerCut ? parseFloat(employerCut as string) / 100 : 0.25;
    const employerCutAmount = annualSalary * cutPercentage;
    const h1bConnectFees = 9500; // Fixed fees
    
    calculatedSavings = {
      annualSalary,
      traditionalModel: {
        employerCut: employerCutAmount,
        takeHome: annualSalary - employerCutAmount
      },
      h1bConnectModel: {
        setupFee: 3500,
        monthlyFee: 6000,
        totalFees: h1bConnectFees,
        takeHome: annualSalary - h1bConnectFees
      },
      annualSavings: employerCutAmount - h1bConnectFees,
      projectedSavings: {
        year1: employerCutAmount - h1bConnectFees,
        year2: (employerCutAmount - h1bConnectFees) * 2,
        year3: (employerCutAmount - h1bConnectFees) * 3
      }
    };
  }
  
  res.json({
    success: true,
    data: calculatedSavings
  });
});

// Download receipt
router.get('/receipt/:transactionId', (req, res) => {
  const { transactionId } = req.params;
  const transaction = mockTransactions.find(txn => txn.id === transactionId);
  
  if (!transaction || !transaction.receiptUrl) {
    return res.status(404).json({
      success: false,
      message: 'Receipt not found'
    });
  }
  
  res.json({
    success: true,
    data: {
      transactionId,
      receiptUrl: transaction.receiptUrl,
      downloadUrl: `/receipts/${transactionId}.pdf`
    }
  });
});

// Update auto-pay settings
router.post('/autopay', (req, res) => {
  const { enabled, paymentMethodId } = req.body;
  
  res.json({
    success: true,
    data: {
      autoPayEnabled: enabled,
      paymentMethodId,
      nextPaymentDate: '2024-12-15'
    },
    message: `Auto-pay ${enabled ? 'enabled' : 'disabled'} successfully`
  });
});

export default router; 