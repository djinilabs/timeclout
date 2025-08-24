import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface AgreementDialogProperties {
  isOpen: boolean;
  onAgree: () => void;
  onDisagree: () => void;
}

export const AgreementDialog = ({
  isOpen,
  onAgree,
  onDisagree,
}: AgreementDialogProperties) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAgree = async () => {
    setIsLoading(true);
    try {
      // Store agreement in localStorage
      localStorage.setItem("tt3-agreement-accepted", "true");
      localStorage.setItem("tt3-agreement-date", new Date().toISOString());
      onAgree();
    } catch (error) {
      console.error("Failed to save agreement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisagree = () => {
    onDisagree();
  };

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-2xl w-full max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Welcome to TT3
            </DialogTitle>
            <div className="w-6" /> {/* Spacer for centering */}
          </div>

          {/* Content - Scrollable */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600">
                Welcome to TT3! Before you can use our team scheduling and leave
                management platform, we need your agreement to our terms and
                privacy practices.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  What we need your consent for:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • <strong>Cookies:</strong> We use cookies to enhance your
                    experience and provide essential functionality
                  </li>
                  <li>
                    • <strong>Terms of Service:</strong> Our service terms that
                    govern your use of TT3
                  </li>
                  <li>
                    • <strong>Privacy Policy:</strong> How we collect, use, and
                    protect your personal information
                  </li>
                </ul>
              </div>

              <div className="mt-6 space-y-3">
                <p className="text-sm text-gray-600">
                  By clicking &quot;I Agree&quot;, you confirm that you have
                  read and agree to our:
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/terms-of-service"
                    target="_blank"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    to="/privacy-statement"
                    target="_blank"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Privacy Statement
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200 flex-shrink-0">
            <button
              type="button"
              onClick={handleDisagree}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              I Disagree
            </button>
            <button
              type="button"
              onClick={handleAgree}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "I Agree"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
