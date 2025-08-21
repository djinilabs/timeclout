import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";
import { HelpSection } from "../types";

export const teamManagementHelp: HelpSection = {
  title: "Comprehensive Team Management",
  description: (
    <>
      Build and manage <strong>high-performing teams</strong> within your
      organizational units. This powerful interface allows you to create teams,
      assign members with
      <em>specific roles and qualifications</em>, configure team-specific
      policies, and monitor <u>performance metrics</u>. From initial team setup
      to ongoing optimization, TT3 provides all the tools you need to ensure
      your teams operate <strong>efficiently and effectively</strong>.
    </>
  ),
  features: [
    {
      title: "Strategic Team Creation",
      description: (
        <>
          Create teams with <strong>specific purposes</strong>, configurations,
          and member assignments. Define team structure, hierarchy, and{" "}
          <em>operational parameters</em> to match your organizational needs.
          Each team can have <u>unique settings</u> while maintaining
          consistency with company policies.
        </>
      ),
    },
    {
      title: "Advanced Member Management",
      description: (
        <>
          Add, remove, and manage team members with{" "}
          <strong>detailed role assignments</strong> and permission levels.
          Track member <em>qualifications, performance history</em>, and
          availability patterns. The system provides{" "}
          <u>comprehensive member profiles</u> with all relevant information in
          one place.
        </>
      ),
    },
    {
      title: "Flexible Team Configuration",
      description: (
        <>
          Configure <strong>team-specific policies</strong>, schedules, leave
          entitlements, and shift requirements. Set up{" "}
          <em>work patterns, qualification requirements</em>, and operational
          rules that align with your team&apos;s unique needs and
          responsibilities.
        </>
      ),
    },
    {
      title: "Performance Analytics & Insights",
      description: (
        <>
          Access <strong>comprehensive team performance metrics</strong>{" "}
          including attendance patterns, productivity indicators,{" "}
          <em>resource utilization statistics</em>, and efficiency trends. Use{" "}
          <u>data-driven insights</u> to optimize team performance and identify
          improvement opportunities.
        </>
      ),
    },
    {
      title: "Integrated Communication Tools",
      description: (
        <>
          Manage <strong>team announcements</strong>, notifications, and
          communication preferences. Set up <em>automated alerts</em> for
          important schedule changes, policy updates, and operational
          requirements. Keep everyone <u>informed and aligned</u> with team
          objectives.
        </>
      ),
    },
    {
      title: "Scalable Team Operations",
      description: (
        <>
          Scale team operations <strong>efficiently</strong> as your
          organization grows. Add new teams, restructure existing ones, and
          maintain <em>consistency across multiple teams</em> while preserving
          individual team autonomy and flexibility.
        </>
      ),
    },
  ],
  sections: [
    {
      title: "Team Setup Process",
      content: (
        <>
          <p>Follow this comprehensive process to set up effective teams:</p>
          <ol className="space-y-2">
            <li>
              <strong>Define Team Purpose:</strong> Clearly establish the
              team&apos;s
              <em>mission, responsibilities</em>, and operational scope within
              your organization
            </li>
            <li>
              <strong>Configure Team Structure:</strong> Set up team hierarchy,
              roles, and <strong>reporting relationships</strong> to ensure
              clear accountability
            </li>
            <li>
              <strong>Establish Policies:</strong> Define{" "}
              <u>team-specific policies</u>
              for scheduling, leave management, qualifications, and operational
              procedures
            </li>
            <li>
              <strong>Add Team Members:</strong> Recruit and assign team members
              with appropriate <em>roles, permissions</em>, and qualification
              requirements
            </li>
            <li>
              <strong>Set Up Infrastructure:</strong> Configure{" "}
              <strong>shift templates</strong>, work schedules, and operational
              parameters specific to the team&apos;s needs
            </li>
            <li>
              <strong>Implement Monitoring:</strong> Establish{" "}
              <em>performance metrics</em> and monitoring systems to track team
              effectiveness and identify <u>improvement areas</u>
            </li>
          </ol>
        </>
      ),
    },
    {
      title: "Team Management Best Practices",
      content: (
        <>
          <ul className="space-y-2">
            <li>
              <strong>Clear Role Definition:</strong> Maintain precise role
              definitions with <em>specific responsibilities</em>, permissions,
              and
              <strong>qualification requirements</strong> for each team position
            </li>
            <li>
              <strong>Regular Performance Reviews:</strong> Conduct periodic
              assessments of <em>team composition</em>, performance metrics, and
              operational efficiency to identify{" "}
              <u>optimization opportunities</u>
            </li>
            <li>
              <strong>Fair Workload Distribution:</strong> Ensure{" "}
              <strong>equitable distribution</strong> of shifts,
              responsibilities, and opportunities across all team members to
              maintain morale and prevent <em>burnout</em>
            </li>
            <li>
              <strong>Policy Consistency:</strong> Keep team settings, policies,
              and procedures up to date while ensuring{" "}
              <u>alignment with organizational standards</u> and regulatory
              requirements
            </li>
            <li>
              <strong>Data-Driven Decisions:</strong> Use{" "}
              <em>analytics and performance metrics</em> to make informed
              decisions about team structure, scheduling, and{" "}
              <strong>resource allocation</strong>
            </li>
            <li>
              <strong>Continuous Improvement:</strong> Regularly review team
              operations, gather feedback, and implement <u>improvements</u> to
              enhance efficiency and team satisfaction
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Team Optimization Strategies",
      content: (
        <>
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-gray-800">
                Performance Monitoring
              </h5>
              <p className="text-sm text-gray-600">
                Regularly review <em>attendance patterns</em>, productivity
                metrics, and resource utilization to identify areas for{" "}
                <strong>improvement and optimization</strong>.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">Skill Development</h5>
              <p className="text-sm text-gray-600">
                Track <strong>qualification gaps</strong> and provide training
                opportunities to enhance team capabilities and{" "}
                <em>operational flexibility</em>.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Communication Enhancement
              </h5>
              <p className="text-sm text-gray-600">
                Optimize <em>communication channels</em> and notification
                systems to ensure <strong>timely information flow</strong> and
                team coordination.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">Resource Allocation</h5>
              <p className="text-sm text-gray-600">
                Analyze <em>workload distribution</em> and adjust team
                composition or scheduling to maximize{" "}
                <strong>efficiency</strong> and minimize operational
                bottlenecks.
              </p>
            </div>
          </div>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="team-management" />,
  roles: <RoleBasedHelp context="team-management" />,
};
