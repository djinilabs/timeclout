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
              <Button
                onClick={handleSignIn}
                className="w-full justify-center relative inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 hover:scale-110 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-teal-600 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-teal-600 disabled:hover:scale-100 transition duration-300"
                aria-label="Sign in to your account"
              >
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
