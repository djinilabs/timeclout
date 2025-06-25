import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const autoFillHelp: HelpSection = {
  title: "Intelligent Auto-Fill Scheduling",
  description: (
    <>
      Harness the power of AI-driven scheduling optimization. The auto-fill
      feature intelligently assigns team members to shifts based on their
      qualifications, availability, preferences, and workload distribution
      rules. This advanced algorithm ensures optimal coverage while maintaining
      fairness and compliance with your team's policies and regulations.
    </>
  ),
  features: [
    {
      title: "Smart Qualification Matching",
      description:
        "Automatically matches team members to shifts based on their specific qualifications and certifications. The system ensures that only qualified individuals are assigned to positions requiring particular skills, maintaining operational standards and safety compliance.",
    },
    {
      title: "Advanced Conflict Resolution",
      description:
        "Intelligently resolves scheduling conflicts including double-bookings, rest period violations, and qualification mismatches. The algorithm finds optimal solutions that minimize disruptions while maintaining schedule integrity and team satisfaction.",
    },
    {
      title: "Workload Balance Optimization",
      description:
        "Distributes shifts fairly across team members, considering their current workload, preferences, and historical assignment patterns. The system prevents overloading while ensuring all team members have appropriate opportunities.",
    },
    {
      title: "Preference-Aware Scheduling",
      description:
        "Takes into account team member preferences, availability patterns, and scheduling history to create schedules that work for everyone. The system learns from past assignments to improve future scheduling decisions.",
    },
    {
      title: "Regulatory Compliance",
      description:
        "Ensures schedules comply with labor regulations, including minimum rest periods, maximum work hours, and qualification requirements. The system automatically flags potential compliance issues and suggests alternatives.",
    },
    {
      title: "Real-Time Optimization",
      description:
        "Continuously optimizes schedules as new information becomes available. The system can adjust assignments in real-time to accommodate last-minute changes, emergencies, or new requirements.",
    },
  ],
  sections: [
    {
      title: "How Auto-Fill Works",
      content: (
        <>
          <p>
            The auto-fill algorithm follows these steps to create optimal
            schedules:
          </p>
          <ol className="space-y-2">
            <li>
              <strong>Analyze Requirements:</strong> Reviews all shift positions
              and their qualification requirements, time slots, and special
              needs
            </li>
            <li>
              <strong>Assess Availability:</strong> Checks team member
              availability, existing commitments, and scheduling preferences
            </li>
            <li>
              <strong>Match Qualifications:</strong> Identifies team members
              with the required skills and certifications for each position
            </li>
            <li>
              <strong>Optimize Distribution:</strong> Balances workload across
              team members while respecting their preferences and limitations
            </li>
            <li>
              <strong>Validate Compliance:</strong> Ensures the proposed
              schedule meets all regulatory and policy requirements
            </li>
            <li>
              <strong>Generate Schedule:</strong> Creates the final optimized
              schedule with all assignments and conflict resolutions
            </li>
          </ol>
        </>
      ),
    },
    {
      title: "Best Practices for Auto-Fill",
      content: (
        <>
          <ul className="space-y-2">
            <li>
              <strong>Keep Qualifications Updated:</strong> Ensure all team
              member qualifications are current and accurately reflect their
              capabilities
            </li>
            <li>
              <strong>Set Clear Preferences:</strong> Encourage team members to
              set their availability preferences and scheduling constraints
            </li>
            <li>
              <strong>Review Before Publishing:</strong> Always review
              auto-generated schedules before publishing to ensure they meet
              your specific needs
            </li>
            <li>
              <strong>Use as Starting Point:</strong> Consider auto-fill results
              as a starting point that can be manually adjusted for special
              circumstances
            </li>
            <li>
              <strong>Monitor Performance:</strong> Track how well auto-fill
              performs and adjust parameters or preferences as needed
            </li>
            <li>
              <strong>Communicate Changes:</strong> Inform team members about
              auto-fill usage and how it affects their schedules
            </li>
            <li>
              <strong>Publish Results:</strong> Remember to publish
              auto-generated schedules to make them visible to team members
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "When to Use Auto-Fill",
      content: (
        <>
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-gray-800">
                Perfect for Regular Scheduling
              </h5>
              <p className="text-sm text-gray-600">
                Use auto-fill for routine weekly or monthly scheduling when you
                have consistent requirements and team availability.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Complex Qualification Requirements
              </h5>
              <p className="text-sm text-gray-600">
                Ideal when you have multiple positions requiring different
                qualifications and need to ensure proper skill matching.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Large Team Management
              </h5>
              <p className="text-sm text-gray-600">
                Especially valuable for teams with many members where manual
                scheduling would be time-consuming and error-prone.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Compliance-Critical Environments
              </h5>
              <p className="text-sm text-gray-600">
                Use when you need to ensure strict adherence to labor
                regulations and qualification requirements.
              </p>
            </div>
          </div>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="auto-fill" />,
  roles: <RoleBasedHelp context="autoFill" />,
};
