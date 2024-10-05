import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { Subscription, User } from "@prisma/client";

export interface BillingPortalProps {
  subscription: Partial<Subscription>;
  user: KindeUser | null;
}