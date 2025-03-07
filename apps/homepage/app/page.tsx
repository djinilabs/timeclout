import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Users,
  BarChart3,
  Bell,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-teal-50/95 backdrop-blur supports-[backdrop-filter]:bg-teal-50/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/homepage/tt3-logo-3.svg"
              alt="Team Time Tables"
              className="h-[60px] w-auto"
            />
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-teal-600"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-teal-600"
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-teal-600"
            >
              Testimonials
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium hover:text-teal-600"
            >
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hover:text-teal-600">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Start free trial
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-teal-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-teal-900">
                    Simplify Team Scheduling with Team Time Table
                  </h1>
                  <p className="max-w-[600px] text-teal-700 md:text-xl">
                    The AI-powered solution for managing work hours, automating
                    shift assignments, and optimizing team availability.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="w-full min-[400px]:w-auto bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      Start your 14-day free trial
                    </Button>
                  </Link>
                  <Link href="#demo">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full min-[400px]:w-auto border-teal-600 text-teal-600 hover:bg-teal-50"
                    >
                      Book a demo
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-sm text-teal-700">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  <span>No credit card required</span>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-200/20 to-teal-400/20 rounded-lg blur-xl" />
                <div className="relative bg-white border rounded-lg shadow-lg overflow-hidden">
                  <img
                    src="/homepage/istockphoto-543351810-1024x1024.jpg"
                    alt="Team of health workers"
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-teal-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-teal-900">
                  Powerful Features for Team Management
                </h2>
                <p className="max-w-[700px] text-teal-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                  Everything you need to manage your team's schedule efficiently
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white">
                <div className="p-2 bg-teal-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-teal-600"
                  >
                    <path d="M12 2a8 8 0 0 1 8 8v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V10a8 8 0 0 1 8-8Z"></path>
                    <path d="M9 19v-5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z"></path>
                    <path d="M12 6v3"></path>
                    <path d="M8 6v3"></path>
                    <path d="M16 6v3"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-teal-900">
                  AI-Powered Scheduling
                </h3>
                <p className="text-teal-700 text-center">
                  Automatically generate optimal schedules based on staff
                  preferences, skills, and business needs.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white">
                <div className="p-2 bg-teal-100 rounded-full">
                  <Calendar className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-teal-900">
                  Intuitive Scheduling
                </h3>
                <p className="text-teal-700 text-center">
                  Drag-and-drop interface for creating and managing shifts with
                  ease.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white">
                <div className="p-2 bg-teal-100 rounded-full">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-teal-900">
                  Team Availability
                </h3>
                <p className="text-teal-700 text-center">
                  Track employee availability and preferences to create optimal
                  schedules.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white">
                <div className="p-2 bg-teal-100 rounded-full">
                  <Bell className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-teal-900">
                  Calendar integration
                </h3>
                <p className="text-teal-700 text-center">
                  Sync schedules with popular calendar apps like Google Calendar
                  and Outlook for seamless coordination.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white">
                <div className="p-2 bg-teal-100 rounded-full">
                  <BarChart3 className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-teal-900">
                  Advanced Analytics
                </h3>
                <p className="text-teal-700 text-center">
                  Gain insights into labor costs, overtime, and scheduling
                  efficiency.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white">
                <div className="p-2 bg-teal-100 rounded-full">
                  <Smartphone className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-teal-900">
                  Mobile Access
                </h3>
                <p className="text-teal-700 text-center">
                  Access schedules on the go with our responsive mobile app.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Capabilities Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-teal-900">
                    AI-Powered Shift Management
                  </h2>
                  <p className="text-teal-700 md:text-xl">
                    Our intelligent scheduling algorithm learns from your team's
                    patterns and preferences to create the perfect schedule
                    every time.
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-teal-700">
                    <CheckCircle2 className="h-5 w-5 text-teal-600" />
                    <span>
                      Automatically assigns shifts based on employee skills and
                      preferences
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-teal-700">
                    <CheckCircle2 className="h-5 w-5 text-teal-600" />
                    <span>
                      Predicts staffing needs based on historical data
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-teal-700">
                    <CheckCircle2 className="h-5 w-5 text-teal-600" />
                    <span>
                      Optimizes schedules to minimize overtime and maximize
                      productivity
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-teal-700">
                    <CheckCircle2 className="h-5 w-5 text-teal-600" />
                    <span>
                      Adapts to changing conditions and requirements in
                      real-time
                    </span>
                  </li>
                </ul>
              </div>
              <div className="mx-auto lg:mx-0 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-200/20 to-teal-400/20 rounded-lg blur-xl" />
                <div className="relative bg-white border rounded-lg shadow-lg overflow-hidden">
                  <img
                    src="/homepage/screenshot-3.png"
                    alt="AI-powered scheduling interface"
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 bg-teal-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-teal-900">
                  Simple, Transparent Pricing
                </h2>
                <p className="max-w-[700px] text-teal-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                  Choose the plan that works best for your team
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="flex flex-col border rounded-lg p-6 bg-white">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-teal-900">Starter</h3>
                  <p className="text-teal-700">Perfect for small teams</p>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-teal-900">$9</span>
                    <span className="text-teal-700 ml-1">/ user / month</span>
                  </div>
                </div>
                <ul className="mt-6 space-y-2 flex-1">
                  <li className="flex items-center text-teal-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                    <span>Up to 10 team members</span>
                  </li>
                  <li className="flex items-center text-teal-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                    <span>Basic scheduling</span>
                  </li>
                  <li className="flex items-center text-teal-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                    <span>Email notifications</span>
                  </li>
                  <li className="flex items-center text-teal-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                    <span>Mobile access</span>
                  </li>
                </ul>
                <Link href="/signup" className="mt-6">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    Get started
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col border rounded-lg p-6 bg-white relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-teal-900">
                    Professional
                  </h3>
                  <p className="text-teal-700">For growing businesses</p>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-teal-900">
                      $19
                    </span>
                    <span className="text-teal-700 ml-1">/ user / month</span>
                  </div>
                </div>
                <ul className="mt-6 space-y-2 flex-1">
                  <li className="flex items-center text-teal-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                    <span>Up to 50 team members</span>
                  </li>
                  <li className="flex items-center text-teal-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                    <span>Advanced scheduling</span>
                  </li>
                  <li className="flex items-center text-teal-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                    <span>SMS & email notifications</span>
                  </li>
                  <li className="flex items-center text-teal-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                    <span>Time tracking</span>
                  </li>
                  <li className="flex items-center text-teal-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center text-teal-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                    <span>AI-powered shift suggestions</span>
                  </li>
                </ul>
                <Link href="/signup" className="mt-6">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    Get started
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col border rounded-lg p-6 bg-white">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-teal-900">
                    Enterprise
                  </h3>
                  <p className="text-teal-700">For large organizations</p>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-teal-900">
                      $29
                    </span>
                    <span className="text-teal-700 ml-1">/ user / month</span>
                  </div>
                </div>
                <ul className="mt-6 space-y-2 flex-1">
                  <li className="flex items-center text-teal-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                    <span>Unlimited team members</span>
                  </li>
                  <li className="flex items-center text-teal-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                    <span>Advanced scheduling</span>
                  </li>
                  <li className="flex items-center text-teal-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                    <span>All notifications</span>
                  </li>
                  <li className="flex items-center text-teal-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                    <span>Advanced time tracking</span>
                  </li>
                  <li className="flex items-center text-teal-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center text-teal-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-center text-teal-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                    <span>Dedicated support</span>
                  </li>
                  <li className="flex items-center text-teal-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                    <span>Advanced AI scheduling automation</span>
                  </li>
                </ul>
                <Link href="/contact" className="mt-6">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    Contact sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 bg-teal-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-teal-900">
                  Trusted by Teams Worldwide
                </h2>
                <p className="max-w-[700px] text-teal-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                  See what our customers have to say about Team Time Table
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="flex flex-col border rounded-lg p-6 bg-white">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src="/homepage/placeholder.svg?height=60&width=60"
                    alt="Sarah Johnson"
                    className="rounded-full w-12 h-12 object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-teal-900">Sarah Johnson</h4>
                    <p className="text-sm text-teal-700">Retail Manager</p>
                  </div>
                </div>
                <p className="text-teal-700 flex-1">
                  "Team Time Table has revolutionized how we manage our store
                  schedules. We've reduced scheduling conflicts by 80% and saved
                  hours each week on administrative tasks."
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-teal-600"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="flex flex-col border rounded-lg p-6 bg-white">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src="/placeholder.svg?height=60&width=60"
                    alt="Michael Chen"
                    className="rounded-full w-12 h-12 object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-teal-900">Michael Chen</h4>
                    <p className="text-sm text-teal-700">Restaurant Owner</p>
                  </div>
                </div>
                <p className="text-teal-700 flex-1">
                  "As a restaurant with fluctuating staffing needs, tt3 has been
                  a game-changer. The mobile app means my staff always knows
                  their schedule, and the time tracking feature has simplified
                  our payroll process."
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-teal-600"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="flex flex-col border rounded-lg p-6 bg-white">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src="/homepage/placeholder.svg?height=60&width=60"
                    alt="Emily Rodriguez"
                    className="rounded-full w-12 h-12 object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-teal-900">Emily Rodriguez</h4>
                    <p className="text-sm text-teal-700">
                      Healthcare Administrator
                    </p>
                  </div>
                </div>
                <p className="text-teal-700 flex-1">
                  "Managing shifts for our healthcare facility used to be a
                  nightmare. Team Time Table has made it simple to ensure we
                  have proper coverage while respecting our staff's work-life
                  balance."
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-teal-600"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-teal-900">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[700px] text-teal-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                  Find answers to common questions about Team Time Table
                </p>
              </div>
            </div>
            <div className="grid gap-6 mt-12 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-teal-900">
                  How does the AI scheduling work?
                </h3>
                <p className="text-teal-700">
                  Our AI analyzes your historical scheduling data, employee
                  preferences, skills, and availability to automatically
                  generate optimal schedules. It continuously learns and
                  improves over time, adapting to your specific business
                  patterns and needs.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">
                  Can employees request time off through the system?
                </h3>
                <p className="text-muted-foreground">
                  Yes, employees can submit time-off requests directly through
                  the platform. Managers receive notifications and can approve
                  or deny requests with a single click.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">
                  Does Team Time Table integrate with payroll systems?
                </h3>
                <p className="text-muted-foreground">
                  Yes, we offer integrations with popular payroll systems to
                  streamline your administrative processes. Our API also allows
                  for custom integrations with your existing tools.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">
                  Is there a mobile app available?
                </h3>
                <p className="text-muted-foreground">
                  Yes, Team Time Table offers mobile apps for both iOS and
                  Android. Employees can view their schedules, clock in/out, and
                  request time off directly from their smartphones.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">How secure is my data?</h3>
                <p className="text-muted-foreground">
                  We take security seriously. All data is encrypted both in
                  transit and at rest. We use industry-standard security
                  practices and regular audits to ensure your information
                  remains protected.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">
                  Can I customize the system to match my business needs?
                </h3>
                <p className="text-muted-foreground">
                  Absolutely. Team Time Table offers extensive customization
                  options for shift types, roles, locations, and notification
                  preferences to adapt to your specific business requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-teal-600/90 text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Team Scheduling with AI?
                </h2>
                <p className="max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                  Join thousands of businesses that trust Team Time Table for
                  their scheduling needs
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full min-[400px]:w-auto"
                  >
                    Start your free trial
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full min-[400px]:w-auto border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
                    Book a demo
                  </Button>
                </Link>
              </div>
              <p className="text-sm">
                No credit card required. 14-day free trial.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-10">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img
                  src="/homepage/tt3-logo-3.svg"
                  alt="Team Time Tables"
                  className="h-20 w-auto"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Simplifying team scheduling since 2023
              </p>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#features"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    API Reference
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground mb-4 md:mb-0">
              © 2023 Team Time Table. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <Link href="#" className="hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
