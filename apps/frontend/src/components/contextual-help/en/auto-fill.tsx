import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const autoFillHelp: HelpSection = {
  title: "Intelligent Auto-Fill Scheduling",
  description: (
    <>
      Harness the power of <strong>AI-driven scheduling optimization</strong>.
      The auto-fill feature intelligently assigns team members to shifts based
      on their
      <em>qualifications, availability, preferences</em>, and{" "}
      <u>workload distribution rules</u>. This advanced algorithm ensures{" "}
      <strong>optimal coverage</strong> while maintaining fairness and
      compliance with your team's policies and regulations.
    </>
  ),
  features: [
    {
      title: "Smart Qualification Matching",
      description: (
        <>
          Automatically matches team members to shifts based on their{" "}
          <strong>specific qualifications</strong> and certifications. The
          system ensures that only <em>qualified individuals</em> are assigned
          to positions requiring particular skills, maintaining{" "}
          <u>operational standards</u> and safety compliance.
        </>
      ),
    },
    {
      title: "Advanced Conflict Resolution",
      description: (
        <>
          Intelligently resolves scheduling conflicts including{" "}
          <u>double-bookings</u>, <em>rest period violations</em>, and{" "}
          <strong>qualification mismatches</strong>. The algorithm finds optimal
          solutions that minimize disruptions while maintaining{" "}
          <strong>schedule integrity</strong> and team satisfaction.
        </>
      ),
    },
    {
      title: "Workload Balance Optimization",
      description: (
        <>
          Distributes shifts <em>fairly</em> across team members, considering
          their <strong>current workload</strong>, preferences, and historical
          assignment patterns. The system prevents <u>overloading</u> while
          ensuring all team members have appropriate opportunities.
        </>
      ),
    },
    {
      title: "Preference-Aware Scheduling",
      description: (
        <>
          Takes into account team member <strong>preferences</strong>,{" "}
          <em>availability patterns</em>, and scheduling history to create
          schedules that work for everyone. The system{" "}
          <u>learns from past assignments</u> to improve future scheduling
          decisions.
        </>
      ),
    },
    {
      title: "Regulatory Compliance",
      description: (
        <>
          Ensures schedules comply with <strong>labor regulations</strong>,
          including <em>minimum rest periods</em>, maximum work hours, and
          qualification requirements. The system automatically flags{" "}
          <u>potential compliance issues</u> and suggests alternatives.
        </>
      ),
    },
    {
      title: "Real-Time Optimization",
      description: (
        <>
          Continuously optimizes schedules as <em>new information</em> becomes
          available. The system can adjust assignments in{" "}
          <strong>real-time</strong> to accommodate <u>last-minute changes</u>,
          emergencies, or new requirements.
        </>
      ),
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
              and their <em>qualification requirements</em>,{" "}
              <strong>time slots</strong>, and special needs
            </li>
            <li>
              <strong>Assess Availability:</strong> Checks team member
              <em>availability</em>, existing commitments, and{" "}
              <u>scheduling preferences</u>
            </li>
            <li>
              <strong>Match Qualifications:</strong> Identifies team members
              with the <strong>required skills</strong> and certifications for
              each position
            </li>
            <li>
              <strong>Optimize Distribution:</strong> Balances <em>workload</em>{" "}
              across team members while respecting their{" "}
              <u>preferences and limitations</u>
            </li>
            <li>
              <strong>Validate Compliance:</strong> Ensures the proposed
              schedule meets all{" "}
              <strong>regulatory and policy requirements</strong>
            </li>
            <li>
              <strong>Generate Schedule:</strong> Creates the final{" "}
              <em>optimized schedule</em> with all assignments and conflict
              resolutions
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
              member qualifications are <em>current and accurate</em> and
              reflect their capabilities
            </li>
            <li>
              <strong>Set Clear Preferences:</strong> Encourage team members to
              set their <u>availability preferences</u> and scheduling
              constraints
            </li>
            <li>
              <strong>Review Before Publishing:</strong> Always review
              auto-generated schedules before publishing to ensure they meet
              your <strong>specific needs</strong>
            </li>
            <li>
              <strong>Use as Starting Point:</strong> Consider auto-fill results
              as a <em>starting point</em> that can be manually adjusted for{" "}
              <u>special circumstances</u>
            </li>
            <li>
              <strong>Monitor Performance:</strong> Track how well auto-fill
              performs and adjust <strong>parameters or preferences</strong> as
              needed
            </li>
            <li>
              <strong>Communicate Changes:</strong> Inform team members about
              auto-fill usage and how it affects their <em>schedules</em>
            </li>
            <li>
              <strong>Publish Results:</strong> Remember to{" "}
              <u>publish auto-generated schedules</u> to make them visible to
              team members
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
                Use auto-fill for <em>routine weekly or monthly scheduling</em>{" "}
                when you have <strong>consistent requirements</strong> and team
                availability.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Complex Qualification Requirements
              </h5>
              <p className="text-sm text-gray-600">
                Ideal when you have <strong>multiple positions</strong>{" "}
                requiring different qualifications and need to ensure{" "}
                <em>proper skill matching</em>.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Large Team Management
              </h5>
              <p className="text-sm text-gray-600">
                Especially valuable for teams with <em>many members</em> where
                manual scheduling would be <u>time-consuming and error-prone</u>
                .
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Compliance-Critical Environments
              </h5>
              <p className="text-sm text-gray-600">
                Use when you need to ensure <strong>strict adherence</strong> to
                labor regulations and <em>qualification requirements</em>.
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
