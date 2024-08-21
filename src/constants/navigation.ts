import { DollarSign, House, Zap } from "lucide-react";

export const DASHBOARD_NAVIGATION = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: House
  },
  {
    name: 'Sites',
    href: '/dashboard/sites',
    icon: Zap
  },
  {
    name: 'Pricing',
    href: '/dashboard/pricing',
    icon: DollarSign
  },

]