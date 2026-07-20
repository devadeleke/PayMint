import { useState } from "react"
import { Building, ImageUp, Save } from "lucide-react"
import Input from "../../components/ui/Input"
import Button from '../../components/ui/Button'

const BusinessInfo = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    website: "",
    taxId: ""
  })
  return (
    <>
     <div className="flex items-center gap-3 mb-6">
      <div className="size-10 rounded-lg bg-indigo-50 flex items-center justify-center">
        <Building size={15} className="text-indigo-600" />
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-900">Business Information</h2>
        <p className="text-xs text-slate-500">This info appears on your invoices and payment pages</p>
      </div>
     </div>

     <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Business logo</label>
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
            <ImageUp size={15} className="text-indigo-600" />
          </div>

          <div>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer">Upload new logo</button>
            <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, SVG. Recommended 400x400px.</p>
          </div>
        </div>
      </div>

      <form>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Input type='text'
            placeholder='Company name'
            label='Business Name'
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value})}
          />
          <Input type='email'
            placeholder='company@mail.com'
            label='Business Email'
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value})}
          />
          <Input type='text'
            placeholder='company@mail.com'
            label='Phone'
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value})}
          />
          <Input type='text'
            placeholder='Miami, USA'
            label='Street Address'
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value})}
          />
          <Input type='text'
            placeholder='Miami, USA'
            label='City'
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value})}
          />
          <Input type='text'
            placeholder='country'
            label='Country'
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value})}
          />
          <Input type='text'
            placeholder='Postal code'
            label='Postal Code'
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value})}
          />
        
          <Input type='text'
            placeholder="https://yoursite.com"
            label='Website'
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value})}
          />
          <Input type='text'
            placeholder='country'
            label='Tax ID / VAT number'
            value={formData.taxId}
            onChange={(e) => setFormData({ ...formData, taxId: e.target.value})}
          />
        </div>
        <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
          <Button>
            <Save size={12} />
            Save Changes
          </Button>
          <button class="px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer">
          Cancel
        </button>
        </div>
      </form>

     </div>
    </>
  )
}

export default BusinessInfo