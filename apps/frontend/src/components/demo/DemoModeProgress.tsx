import { Trans } from "@lingui/react/macro";

interface DemoModeProgressProps {
  currentStep: string;
  progress: number;
  message?: string;
}

export const DemoModeProgress: React.FC<DemoModeProgressProps> = ({
  currentStep,
  progress,
  message,
}) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          <Trans>Setting Up Your Demo Account</Trans>
        </h2>
        <p className="text-gray-600">
          <Trans>Please wait while we create your company structure...</Trans>
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            <Trans>Progress</Trans>
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-teal-600 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Step */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          <Trans>Current Step</Trans>
        </h3>
        <p className="text-gray-700">{currentStep}</p>
      </div>

      {/* Status Message */}
      {message && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            <Trans>Status</Trans>
          </h3>
          <p className="text-gray-700">{message}</p>
        </div>
      )}

      {/* Loading Animation */}
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          <Trans>
            This may take a few moments. Please don&apos;t close this page.
          </Trans>
        </p>
      </div>
    </div>
  );
};
