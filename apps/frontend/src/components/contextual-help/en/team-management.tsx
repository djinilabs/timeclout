import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const teamManagementHelp: HelpSection = {
  title: "Comprehensive Team Management",
  description: (
    <>
      Build and manage high-performing teams within your organizational units.
      This powerful interface allows you to create teams, assign members with
      specific roles and qualifications, configure team-specific policies, and
      monitor performance metrics. From initial team setup to ongoing
      optimization, TT3 provides all the tools you need to ensure your teams
      operate efficiently and effectively.
    </>
  ),
  features: [
    {
      title: "Strategic Team Creation",
      description:
        "Create teams with specific purposes, configurations, and member assignments. Define team structure, hierarchy, and operational parameters to match your organizational needs. Each team can have unique settings while maintaining consistency with company policies.",
    },
    {
      title: "Advanced Member Management",
      description:
        "Add, remove, and manage team members with detailed role assignments and permission levels. Track member qualifications, performance history, and availability patterns. The system provides comprehensive member profiles with all relevant information in one place.",
    },
    {
      title: "Flexible Team Configuration",
      description:
        "Configure team-specific policies, schedules, leave entitlements, and shift requirements. Set up work patterns, qualification requirements, and operational rules that align with your team's unique needs and responsibilities.",
    },
    {
      title: "Performance Analytics & Insights",
      description:
        "Access comprehensive team performance metrics including attendance patterns, productivity indicators, resource utilization statistics, and efficiency trends. Use data-driven insights to optimize team performance and identify improvement opportunities.",
    },
    {
      title: "Integrated Communication Tools",
      description:
        "Manage team announcements, notifications, and communication preferences. Set up automated alerts for important schedule changes, policy updates, and operational requirements. Keep everyone informed and aligned with team objectives.",
    },
    {
      title: "Scalable Team Operations",
      description:
        "Scale team operations efficiently as your organization grows. Add new teams, restructure existing ones, and maintain consistency across multiple teams while preserving individual team autonomy and flexibility.",
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
              <strong>Define Team Purpose:</strong> Clearly establish the team's
              mission, responsibilities, and operational scope within your
              organization
            </li>
            <li>
              <strong>Configure Team Structure:</strong> Set up team hierarchy,
              roles, and reporting relationships to ensure clear accountability
            </li>
            <li>
              <strong>Establish Policies:</strong> Define team-specific policies
              for scheduling, leave management, qualifications, and operational
              procedures
            </li>
            <li>
              <strong>Add Team Members:</strong> Recruit and assign team members
              with appropriate roles, permissions, and qualification
              requirements
            </li>
            <li>
              <strong>Set Up Infrastructure:</strong> Configure shift templates,
              work schedules, and operational parameters specific to the team's
              needs
            </li>
            <li>
              <strong>Implement Monitoring:</strong> Establish performance
              metrics and monitoring systems to track team effectiveness and
              identify improvement areas
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
              definitions with specific responsibilities, permissions, and
              qualification requirements for each team position
            </li>
            <li>
              <strong>Regular Performance Reviews:</strong> Conduct periodic
              assessments of team composition, performance metrics, and
              operational efficiency to identify optimization opportunities
            </li>
            <li>
              <strong>Fair Workload Distribution:</strong> Ensure equitable
              distribution of shifts, responsibilities, and opportunities across
              all team members to maintain morale and prevent burnout
            </li>
            <li>
              <strong>Policy Consistency:</strong> Keep team settings, policies,
              and procedures up to date while ensuring alignment with
              organizational standards and regulatory requirements
            </li>
            <li>
              <strong>Data-Driven Decisions:</strong> Use analytics and
              performance metrics to make informed decisions about team
              structure, scheduling, and resource allocation
            </li>
            <li>
              <strong>Continuous Improvement:</strong> Regularly review team
              operations, gather feedback, and implement improvements to enhance
              efficiency and team satisfaction
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
                Regularly review attendance patterns, productivity metrics, and
                resource utilization to identify areas for improvement and
                optimization.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">Skill Development</h5>
              <p className="text-sm text-gray-600">
                Track qualification gaps and provide training opportunities to
                enhance team capabilities and operational flexibility.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Communication Enhancement
              </h5>
              <p className="text-sm text-gray-600">
                Optimize communication channels and notification systems to
                ensure timely information flow and team coordination.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">Resource Allocation</h5>
              <p className="text-sm text-gray-600">
                Analyze workload distribution and adjust team composition or
                scheduling to maximize efficiency and minimize operational
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
