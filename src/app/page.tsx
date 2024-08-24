import {
  LoginLink,
  LogoutLink,
  RegisterLink
} from '@kinde-oss/kinde-auth-nextjs/components';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Button } from '@nextui-org/react';

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const session = await getUser();

  return (
    <div className="flex gap-4 p-4">
      {session ? (
        <Button>
          <LogoutLink>Log out</LogoutLink>
        </Button>
      ) : (
        <>
          <Button color="primary">
            <LoginLink>Sign in</LoginLink>
          </Button>
          <Button>
            <RegisterLink>Sign up</RegisterLink>
          </Button>
        </>
      )}
    </div>
  );
}
