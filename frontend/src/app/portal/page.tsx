'use client'

import Link from 'next/link'
import { 
  User, 
  ShieldCheck, 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  MapPin, 
  Headphones, 
  Ticket, 
  QrCode, 
  Archive, 
  Users, 
  Sparkles, 
  BarChart, 
  Settings,
  ArrowRight
} from 'lucide-react'

const customerLinks = [
  { name: 'Customer Dashboard', path: '/customer/dashboard', icon: LayoutDashboard, desc: 'Overview of user activities and recent orders' },
  { name: 'My Orders', path: '/customer/orders', icon: Package, desc: 'List of all past and current laundry orders' },
  { name: 'Book New Order', path: '/customer/orders/new', icon: PlusCircle, desc: 'Form to request a new laundry service' },
  { name: 'My Addresses', path: '/customer/addresses', icon: MapPin, desc: 'Manage pickup and delivery locations' },
  { name: 'Customer Support', path: '/customer/support', icon: Headphones, desc: 'Help center and past support tickets' },
  { name: 'Create Ticket', path: '/customer/support/new', icon: Ticket, desc: 'Submit a new support or refund request' },
  { name: 'Profile Settings', path: '/customer/profile', icon: User, desc: 'Manage personal information and preferences' },
]

const adminLinks = [
  { name: 'Admin Dashboard', path: '/center-admin/dashboard', icon: LayoutDashboard, desc: 'Central command center with revenue & stats' },
  { name: 'Manage Orders', path: '/center-admin/orders', icon: Package, desc: 'View, update, and manage all customer orders' },
  { name: 'QR Scanner', path: '/center-admin/scanner', icon: QrCode, desc: 'Scan laundry bags for quick status updates' },
  { name: 'Inventory', path: '/center-admin/inventory', icon: Archive, desc: 'Manage detergents and operational supplies' },
  { name: 'Staff Management', path: '/center-admin/staff', icon: Users, desc: 'Manage employees, riders, and shifts' },
  { name: 'Services List', path: '/center-admin/services', icon: Sparkles, desc: 'Manage pricing and available laundry services' },
  { name: 'Performance Reports', path: '/center-admin/performance', icon: BarChart, desc: 'Analytics and financial reporting' },
  { name: 'Admin Profile', path: '/center-admin/profile', icon: User, desc: 'Administrator account details' },
  { name: 'Settings', path: '/center-admin/settings', icon: Settings, desc: 'Branch settings and operational configurations' },
]

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            KitaLaundry <span className="text-teal-600">Portal Directory</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This is a quick-access directory created to easily navigate and test all the pages and features of the KitaLaundry application.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Customer Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <User className="mr-3 h-7 w-7 text-blue-200" />
                  Customer Pages
                </h2>
                <p className="text-blue-100 mt-1">End-user interface and features</p>
              </div>
            </div>
            <div className="p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {customerLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link key={link.path} href={link.path} className="group block p-5 rounded-2xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-blue-600 text-gray-500 mr-4">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">{link.name}</h3>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-500 line-clamp-2">{link.desc}</p>
                      <div className="mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Go to page <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Admin Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <ShieldCheck className="mr-3 h-7 w-7 text-teal-200" />
                  Admin Pages
                </h2>
                <p className="text-teal-100 mt-1">Center management and operational tools</p>
              </div>
            </div>
            <div className="p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {adminLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link key={link.path} href={link.path} className="group block p-5 rounded-2xl bg-gray-50 hover:bg-teal-50 border border-gray-100 hover:border-teal-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-teal-600 text-gray-500 mr-4">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-teal-700">{link.name}</h3>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-500 line-clamp-2">{link.desc}</p>
                      <div className="mt-4 flex items-center text-sm font-medium text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Go to page <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/">
            <button className="px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
