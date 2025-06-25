import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const companyDashboardHelp: HelpSection = {
  title: "Company Management Dashboard",
  description: (
    <>
      Your central command center for managing the entire organization. The
      company dashboard provides comprehensive oversight of all units, teams,
      and company-wide operations. From strategic planning to operational
      monitoring, this powerful interface gives you complete visibility and
      control over your organization's workforce management, ensuring
      consistency, efficiency, and compliance across all levels.
    </>
  ),
  features: [
    {
      title: "Strategic Unit Management",
      description:
        "Create and manage business units that represent different departments, locations, or operational divisions within your company. Each unit can have its own teams, policies, and operational parameters while maintaining alignment with company-wide standards.",
    },
    {
      title: "Comprehensive Team Overview",
      description:
        "View all teams across different units with their current status, performance metrics, and operational health. Get instant insights into team composition, scheduling efficiency, and resource utilization across your entire organization.",
    },
    {
      title: "Company-Wide Policy Control",
      description:
        "Configure and manage company-wide policies, standards, and operational procedures that apply across all units and teams. Ensure consistency in scheduling practices, leave policies, and qualification requirements throughout the organization.",
    },
    {
      title: "Organizational Analytics",
      description:
        "Access high-level analytics and reporting on organizational performance, including workforce utilization, scheduling efficiency, and operational metrics. Use data-driven insights to make strategic decisions and optimize organizational performance.",
    },
    {
      title: "Multi-Level Access Control",
      description:
        "Manage user access and permissions across different organizational levels. Configure role-based access controls that ensure appropriate visibility and capabilities for different user types throughout the organization.",
    },
    {
      title: "Scalable Organizational Structure",
      description:
        "Build and maintain a scalable organizational structure that can grow with your business. Add new units, restructure existing ones, and maintain operational efficiency as your organization evolves and expands.",
    },
  ],
  sections: [
    {
      title: "Organizational Setup Process",
      content: (
        <>
          <p>
            Follow this strategic process to set up your organization
            effectively:
          </p>
          <ol className="space-y-2">
            <li>
              <strong>Define Organizational Structure:</strong> Establish the
              overall structure of your company with clear unit divisions and
              reporting relationships
            </li>
            <li>
              <strong>Configure Company Policies:</strong> Set up company-wide
              policies for scheduling, leave management, qualifications, and
              operational procedures
            </li>
            <li>
              <strong>Create Business Units:</strong> Establish units that
              represent different departments, locations, or operational areas
              within your organization
            </li>
            <li>
              <strong>Set Up Teams:</strong> Create teams within each unit with
              specific purposes, configurations, and member assignments
            </li>
            <li>
              <strong>Establish Monitoring Systems:</strong> Implement analytics
              and reporting systems to track organizational performance and
              identify optimization opportunities
            </li>
            <li>
              <strong>Configure Access Controls:</strong> Set up appropriate
              user roles and permissions to ensure secure and efficient
              operations
            </li>
          </ol>
        </>
      ),
    },
    {
      title: "Strategic Management Best Practices",
      content: (
        <>
          <ul className="space-y-2">
            <li>
              <strong>Clear Organizational Hierarchy:</strong> Maintain a
              well-defined organizational structure with clear reporting
              relationships and accountability at all levels
            </li>
            <li>
              <strong>Consistent Policy Implementation:</strong> Ensure
              company-wide policies are consistently applied across all units
              while allowing for unit-specific adaptations when necessary
            </li>
            <li>
              <strong>Regular Performance Reviews:</strong> Conduct periodic
              assessments of organizational performance, unit efficiency, and
              team effectiveness to identify improvement opportunities
            </li>
            <li>
              <strong>Data-Driven Decision Making:</strong> Use organizational
              analytics and performance metrics to make informed strategic
              decisions about resource allocation and operational optimization
            </li>
            <li>
              <strong>Scalable Growth Planning:</strong> Design organizational
              structures and processes that can accommodate growth and change
              while maintaining operational efficiency
            </li>
            <li>
              <strong>Continuous Improvement Culture:</strong> Foster a culture
              of continuous improvement by regularly reviewing processes,
              gathering feedback, and implementing organizational enhancements
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Organizational Optimization Strategies",
      content: (
        <>
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-gray-800">
                Performance Monitoring
              </h5>
              <p className="text-sm text-gray-600">
                Regularly review organizational metrics, unit performance, and
                team efficiency to identify areas for improvement and
                optimization across the entire company.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Resource Optimization
              </h5>
              <p className="text-sm text-gray-600">
                Analyze resource utilization across units and teams to identify
                opportunities for better allocation and efficiency improvements.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Policy Standardization
              </h5>
              <p className="text-sm text-gray-600">
                Ensure consistent application of company policies while allowing
                for necessary unit-specific adaptations to meet local
                operational needs.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">Growth Planning</h5>
              <p className="text-sm text-gray-600">
                Plan for organizational growth by designing scalable structures
                and processes that can accommodate expansion while maintaining
                operational efficiency.
              </p>
            </div>
          </div>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="company-dashboard" />,
  roles: <RoleBasedHelp context="company-dashboard" />,
};
