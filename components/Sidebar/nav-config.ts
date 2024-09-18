// protected property is used in middleware.ts to protect routes and add (.*) to it.
export const navLinks = [
  {
    name: 'Products',
    path: '/products',
    protected: true,
  },
  {
    name: 'Receipts',
    path: '/receipts',
    protected: true,
  },
  {
    name: 'Subscriptions & Bills',
    path: '/subscriptions-bills',
    protected: true,
  },
];
