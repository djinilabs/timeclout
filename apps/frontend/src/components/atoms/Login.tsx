import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, signIn } from "next-auth/react";
import { Trans } from "@lingui/react/macro";
import { Button } from "../particles/Button";

const Login: FC = () => {
  const { status } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "authenticated") {
      navigate("/");
    }
  }, [status, navigate]);

  const handleSignIn = () => {
    signIn(undefined, {
      callbackUrl: window.location.href,
    });
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          <Trans>Sign in to your account</Trans>
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <Button onClick={handleSignIn} className="w-full justify-center">
                <Trans>Sign in</Trans>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
