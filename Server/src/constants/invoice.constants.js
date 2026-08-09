export const INVOICE_STATUS = Object.freeze({
  DRAFT: 'draft',
  SENT: 'sent',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
});

export const PAYMENT_STATUS = Object.freeze({
  UNPAID: 'unpaid',
  PARTIALLY_PAID: 'partially_paid',
  PAID: 'paid',
});

// Pagination defaults
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

// Maximum items returned in one request
export const MAX_LIMIT = 100;

// Default sorting
export const DEFAULT_SORT = '-createdAt';