import { useState } from 'react'
import { useAuthStore } from '@/stores/auth'
import { AppLayout } from '@/components/layout/AppLayout'
import { Building, ShieldCheck, Lock, Edit3, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BidderProfile() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState({
    companyName: user?.organisation || 'Alpha Energy Solutions Pvt Ltd',
    pan: user?.pan || 'AACES1234R',
    gstin: user?.gstin || '33AACES1234R1ZQ',
    cin: 'U40106TN2018PTC123456',
    udyam: user?.udyam_number || 'UDYAM-TN-12-0012345',
    address: 'Plot 42, Guindy Industrial Estate, Guindy, Chennai, Tamil Nadu - 600032',
    contactPerson: user?.full_name || 'Rohan Mehta',
    phone: '+91 98765 43210',
    email: user?.email || 'alpha@alphaenergy.com',
    businessType: 'Private Limited Company (MSME Category: Small)',
    turnoverCr: user?.turnover_cr || 28,
  })

  const [editingAddress, setEditingAddress] = useState(false)
  const [addressInput, setAddressInput] = useState(profile.address)

  const saveAddress = () => {
    setProfile(p => ({ ...p, address: addressInput }))
    setEditingAddress(false)
    toast.success('Address updated!')
  }

  const requestCorrection = (field: string) => {
    const reason = prompt(`Specify correction details for ${field}:`)
    if (reason) {
      toast.success(`Correction request for ${field} submitted to Procurement Division.`)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organization Profile</h1>
          <p className="text-gray-500 text-sm">Bidder company registration details and verified statutory credentials</p>
        </div>

        {/* Profile Card Header */}
        <div className="card p-6 bg-gradient-to-r from-blue-900 to-blue-700 text-white space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full font-semibold">
                VERIFIED BIDDER PARTNER
              </span>
              <h2 className="text-xl font-bold">{profile.companyName}</h2>
              <p className="text-xs text-blue-200">{profile.businessType}</p>
            </div>
            <ShieldCheck className="h-10 w-10 text-blue-300" />
          </div>
        </div>

        {/* Verified Statutory Identifiers */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <Lock className="h-4 w-4 text-gray-500" /> Verified Statutory Identifiers (Locked)
            </h3>
            <span className="text-xs text-gray-500">Official government database records</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Income Tax PAN', val: profile.pan, status: 'CBDT Verified' },
              { label: 'GSTIN Number', val: profile.gstin, status: 'GST Portal Active' },
              { label: 'Udyam Registration', val: profile.udyam, status: 'MSME Verified' },
              { label: 'Corporate CIN', val: profile.cin, status: 'MCA Verified' },
              { label: 'Annual Turnover (Avg)', val: `₹ ${profile.turnoverCr} Cr`, status: 'Audited CA Report' },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
                <span className="text-xs text-gray-500 font-medium">{item.label}</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-gray-900 text-sm">{item.val}</span>
                  <button
                    onClick={() => requestCorrection(item.label)}
                    className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                    title="Request correction"
                  >
                    Request Fix
                  </button>
                </div>
                <span className="text-[10px] text-green-700 font-medium flex items-center gap-1 pt-1">
                  <CheckCircle2 className="h-3 w-3" /> {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Address (Editable) */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-blue-600" /> Contact & Operational Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="label">Primary Contact Person</label>
              <input type="text" className="input bg-gray-50" value={profile.contactPerson} readOnly />
            </div>

            <div>
              <label className="label">Registered Email</label>
              <input type="email" className="input bg-gray-50" value={profile.email} readOnly />
            </div>

            <div className="md:col-span-2">
              <label className="label">Registered Office Address</label>
              {editingAddress ? (
                <div className="space-y-2">
                  <textarea
                    className="input w-full"
                    rows={2}
                    value={addressInput}
                    onChange={e => setAddressInput(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditingAddress(false)} className="btn-secondary text-xs">Cancel</button>
                    <button onClick={saveAddress} className="btn-primary text-xs">Save Address</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-gray-800">{profile.address}</span>
                  <button onClick={() => setEditingAddress(true)} className="text-xs text-blue-600 font-semibold hover:underline">Edit</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
