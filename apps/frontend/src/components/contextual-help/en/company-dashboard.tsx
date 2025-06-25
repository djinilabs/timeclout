import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const companyDashboardHelp: HelpSection = {
  title: "Company Management Dashboard",
  description: (
    <>
      Your <strong>central command center</strong> for managing the entire
      organization. The company dashboard provides{" "}
      <em>comprehensive oversight</em> of all units, teams, and company-wide
      operations. From <strong>strategic planning</strong> to{" "}
      <em>operational monitoring</em>, this powerful interface gives you{" "}
      <u>complete visibility and control</u> over your organization's workforce
      management, ensuring
      <strong>consistency, efficiency, and compliance</strong> across all
      levels.
    </>
  ),
  features: [
    {
      title: "Strategic Unit Management",
      description: (
        <>
          Create and manage <strong>business units</strong> that represent
          different departments, locations, or operational divisions within your
          company. Each unit can have its own{" "}
          <em>teams, policies, and operational parameters</em> while maintaining
          alignment with <u>company-wide standards</u>.
        </>
      ),
    },
    {
      title: "Comprehensive Team Overview",
      description: (
        <>
          View all teams across different units with their{" "}
          <strong>current status</strong>, <em>performance metrics</em>, and
          operational health. Get instant insights into <u>team composition</u>,
          scheduling efficiency, and resource utilization across your entire
          organization.
        </>
      ),
    },
    {
      title: "Company-Wide Policy Control",
      description: (
        <>
          Configure and manage <strong>company-wide policies</strong>,
          standards, and operational procedures that apply across all units and
          teams. Ensure <em>consistency</em> in scheduling practices, leave
          policies, and <u>qualification requirements</u> throughout the
          organization.
        </>
      ),
    },
    {
      title: "Organizational Analytics",
      description: (
        <>
          Access <strong>high-level analytics</strong> and reporting on
          organizational performance, including <em>workforce utilization</em>,
          scheduling efficiency, and operational metrics. Use{" "}
          <u>data-driven insights</u> to make strategic decisions and optimize
          organizational performance.
        </>
      ),
    },
    {
      title: "Multi-Level Access Control",
      description: (
        <>
          Manage <strong>user access and permissions</strong> across different
          organizational levels. Configure <em>role-based access controls</em>{" "}
          that ensure appropriate visibility and capabilities for different user
          types throughout the organization.
        </>
      ),
    },
    {
      title: "Scalable Organizational Structure",
      description: (
        <>
          Build and maintain a{" "}
          <strong>scalable organizational structure</strong> that can grow with
          your business. Add new units, restructure existing ones, and maintain{" "}
          <em>operational efficiency</em> as your organization evolves and
          expands.
        </>
      ),
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
              overall structure of your company with{" "}
              <em>clear unit divisions</em> and
              <strong>reporting relationships</strong>
            </li>
            <li>
              <strong>Configure Company Policies:</strong> Set up{" "}
              <u>company-wide policies</u> for scheduling, leave management,
              qualifications, and operational procedures
            </li>
            <li>
              <strong>Create Business Units:</strong> Establish units that
              represent different{" "}
              <em>departments, locations, or operational areas</em>
              within your organization
            </li>
            <li>
              <strong>Set Up Teams:</strong> Create teams within each unit with
              <strong>specific purposes</strong>, configurations, and member
              assignments
            </li>
            <li>
              <strong>Establish Monitoring Systems:</strong> Implement{" "}
              <em>analytics and reporting systems</em> to track organizational
              performance and identify <u>optimization opportunities</u>
            </li>
            <li>
              <strong>Configure Access Controls:</strong> Set up appropriate
              <strong>user roles and permissions</strong> to ensure secure and
              efficient operations
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
              well-defined organizational structure with{" "}
              <em>clear reporting relationships</em> and{" "}
              <strong>accountability</strong> at all levels
            </li>
            <li>
              <strong>Consistent Policy Implementation:</strong> Ensure
              company-wide policies are <u>consistently applied</u> across all
              units while allowing for <em>unit-specific adaptations</em> when
              necessary
            </li>
            <li>
              <strong>Regular Performance Reviews:</strong> Conduct periodic
              assessments of <strong>organizational performance</strong>, unit
              efficiency, and team effectiveness to identify{" "}
              <em>improvement opportunities</em>
            </li>
            <li>
              <strong>Data-Driven Decision Making:</strong> Use{" "}
              <u>organizational analytics</u> and performance metrics to make
              informed strategic decisions about{" "}
              <strong>resource allocation</strong> and operational optimization
            </li>
            <li>
              <strong>Scalable Growth Planning:</strong> Design organizational
              structures and processes that can accommodate{" "}
              <em>growth and change</em>
              while maintaining <strong>operational efficiency</strong>
            </li>
            <li>
              <strong>Continuous Improvement Culture:</strong> Foster a culture
              of continuous improvement by regularly reviewing{" "}
              <em>processes</em>, gathering feedback, and implementing{" "}
              <u>organizational enhancements</u>
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
                Regularly review <strong>organizational metrics</strong>, unit
                performance, and team efficiency to identify areas for{" "}
                <em>improvement and optimization</em> across the entire company.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Resource Optimization
              </h5>
              <p className="text-sm text-gray-600">
                Analyze <em>resource utilization</em> across units and teams to
                identify opportunities for better{" "}
                <strong>allocation and efficiency improvements</strong>.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Policy Standardization
              </h5>
              <p className="text-sm text-gray-600">
                Ensure <strong>consistent application</strong> of company
                policies while allowing for necessary{" "}
                <em>unit-specific adaptations</em> to meet local operational
                needs.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">Growth Planning</h5>
              <p className="text-sm text-gray-600">
                Plan for <strong>organizational growth</strong> by designing{" "}
                <em>scalable structures and processes</em> that can accommodate
                expansion while maintaining operational efficiency.
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
