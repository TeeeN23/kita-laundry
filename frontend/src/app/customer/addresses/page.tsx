'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapPin, Plus, Edit2, Trash2, Star, Phone, Home, Building, Loader2, ArrowLeft, Check } from 'lucide-react'
import { useAddresses } from '@/hooks/useAddresses'
import { useAuthStore } from '@/store/authStore'
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete'
import toast from 'react-hot-toast'

export default function AddressesPage() {
  const { user } = useAuthStore()
  const { addresses, loading, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddresses()
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)
  const [formData, setFormData] = useState<{ name: string; phone: string; addressLine1: string; addressLine2: string; landmark: string; city: string; pincode: string; addressType: 'home' | 'office'; isDefault: boolean }>({
    name: '', phone: '', addressLine1: '', addressLine2: '', landmark: '', city: '', pincode: '', addressType: 'home', isDefault: false
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) setFormData(prev => ({ ...prev, name: user.name || '', phone: user.phone || '' }))
  }, [user])

  const resetForm = () => {
    setFormData({ name: user?.name || '', phone: user?.phone || '', addressLine1: '', addressLine2: '', landmark: '', city: '', pincode: '', addressType: 'home', isDefault: false })
    setEditingAddress(null); setShowForm(false)
  }

  const handleEdit = (address: any) => {
    setFormData({ name: address.name, phone: address.phone, addressLine1: address.addressLine1, addressLine2: address.addressLine2 || '', landmark: address.landmark || '', city: address.city, pincode: address.pincode, addressType: address.addressType || 'home', isDefault: address.isDefault })
    setEditingAddress(address); setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true)
    try {
      if (editingAddress) { await updateAddress(editingAddress._id, formData); toast.success('Alamat berhasil diperbarui') }
      else { await addAddress(formData); toast.success('Alamat berhasil ditambahkan') }
      resetForm()
    } catch (error) { console.error(error) } finally { setSubmitting(false) }
  }

  const handleDelete = async (addressId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus alamat ini?')) return
    try { await deleteAddress(addressId); toast.success('Alamat berhasil dihapus') } catch (error) { console.error(error) }
  }

  const handleSetDefault = async (addressId: string) => {
    try { await setDefaultAddress(addressId); toast.success('Alamat utama diperbarui') } catch (error) { console.error(error) }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />Kembali ke Beranda
      </Link>
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-bold text-gray-800">Alamat Saya</h1><p className="text-gray-600">Kelola alamat tersimpan Anda</p></div>
        {!showForm && (<Button onClick={() => setShowForm(true)} className="bg-teal-500 hover:bg-teal-600"><Plus className="w-4 h-4 mr-2" />Tambah Alamat</Button>)}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{editingAddress ? 'Ubah Alamat' : 'Tambah Alamat Baru'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label><input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label><input type="tel" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required /></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Baris 1 (Cari Peta)</label>
              <AddressAutocomplete 
                value={formData.addressLine1} 
                onChange={(val) => setFormData(prev => ({ ...prev, addressLine1: val }))} 
                onSelect={(item) => {
                  setFormData(prev => ({
                    ...prev,
                    city: item.address.city || item.address.city_district || item.address.state || prev.city,
                    pincode: item.address.postcode || prev.pincode,
                    addressLine2: [item.address.village, item.address.suburb].filter(Boolean).join(', ') || prev.addressLine2
                  }))
                }}
                required 
              />
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Alamat Baris 2 (Opsional)</label><input type="text" value={formData.addressLine2} onChange={(e) => setFormData(prev => ({ ...prev, addressLine2: e.target.value }))} placeholder="Kelurahan, Kecamatan" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Patokan (Opsional)</label><input type="text" value={formData.landmark} onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))} placeholder="Dekat dengan..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Kota</label><input type="text" value={formData.city} onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Kode Pos</label><input type="text" value={formData.pincode} onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required /></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Alamat</label>
              <div className="flex gap-4">
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, addressType: 'home' }))} className={`flex items-center px-4 py-2 rounded-lg border-2 ${formData.addressType === 'home' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200'}`}><Home className="w-4 h-4 mr-2" />Rumah</button>
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, addressType: 'office' }))} className={`flex items-center px-4 py-2 rounded-lg border-2 ${formData.addressType === 'office' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200'}`}><Building className="w-4 h-4 mr-2" />Kantor</button>
              </div>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="isDefault" checked={formData.isDefault} onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))} className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
              <label htmlFor="isDefault" className="ml-2 text-sm text-gray-600">Jadikan alamat utama</label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={submitting} className="flex-1 bg-teal-500 hover:bg-teal-600">{submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan...</> : (editingAddress ? 'Perbarui Alamat' : 'Tambah Alamat')}</Button>
              <Button type="button" variant="outline" onClick={resetForm} className="flex-1">Batal</Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (<div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-teal-500" /></div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum ada alamat tersimpan</h3>
          <p className="text-gray-600 mb-6">Tambahkan alamat pertama Anda untuk memulai</p>
          <Button onClick={() => setShowForm(true)} className="bg-teal-500 hover:bg-teal-600"><Plus className="w-4 h-4 mr-2" />Tambah Alamat</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address._id} className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-800">{address.name}</span>
                    {address.isDefault && (<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"><Star className="w-3 h-3 mr-1" />Utama</span>)}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{address.addressType === 'home' ? <><Home className="w-3 h-3 mr-1" /> Rumah</> : <><Building className="w-3 h-3 mr-1" /> Kantor</>}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-1"><Phone className="w-3 h-3 mr-1" />{address.phone}</div>
                  <p className="text-sm text-gray-600">{address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`}{address.landmark && ` (${address.landmark})`}</p>
                  <p className="text-sm text-gray-600">{address.city} - {address.pincode}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!address.isDefault && (<Button variant="outline" size="sm" onClick={() => handleSetDefault(address._id)} className="text-xs"><Check className="w-3 h-3 mr-1" />Jadikan Utama</Button>)}
                  <Button variant="outline" size="sm" onClick={() => handleEdit(address)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(address._id)} className="text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
