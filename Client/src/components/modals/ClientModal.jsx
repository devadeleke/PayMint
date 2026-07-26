import { User } from "lucide-react";
import Input from "../ui/Input";

const ClientModal = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  }
  return (
    <form className='space-y-8' onSubmit={handleSubmit}>
      <div className="space-y-5">
        <h2 className="text-lg font-semibold">Basic Information :</h2>
        <Input type='text'
          placeholder='John Doe'
          label='FullName'
          icon={User}
          // value={formData.fullName}
          // onChange={(e) => setFormData({ ...formData, fullName: e.target.value})}
        />
        <Input type='email'
          placeholder='Johndoe@company.com'
          label='email'
          icon={User}
          // value={formData.fullName}
          // onChange={(e) => setFormData({ ...formData, fullName: e.target.value})}
        />
        <Input type='text'
          placeholder='company'
          label='Company'
          icon={User}
          // value={formData.fullName}
          // onChange={(e) => setFormData({ ...formData, fullName: e.target.value})}
        />
        <Input type='tel'
          placeholder="+234 801 234 5678"
          label='Phone'
          icon={User}
          // value={formData.fullName}
          // onChange={(e) => setFormData({ ...formData, fullName: e.target.value})}
        />
      </div>
      
      {/* BILLING ADDRESS */}
      <div className="space-y-5">
        <h2 className="text-lg font-semibold">Billing Address :</h2>
        <Input type='text'
          placeholder="12 Allen Avenue"
          label='Street Address'
          icon={User}
          // value={formData.fullName}
          // onChange={(e) => setFormData({ ...formData, fullName: e.target.value})}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Input type='text'
            placeholder="Lagos"
            label='City'
            icon={User}
            // value={formData.fullName}
            // onChange={(e) => setFormData({ ...formData, fullName: e.target.value})}
          />
          <Input type='text'
            placeholder="Lagos"
            label='State / Province'
            icon={User}
            // value={formData.fullName}
            // onChange={(e) => setFormData({ ...formData, fullName: e.target.value})}
          />
          <Input type='text'
            placeholder="100001"
            label='Zip / Postal Code'
            icon={User}
            // value={formData.fullName}
            // onChange={(e) => setFormData({ ...formData, fullName: e.target.value})}
          />
          <Input type='text'
            placeholder="Nigeria"
            label='Country'
            icon={User}
            // value={formData.fullName}
            // onChange={(e) => setFormData({ ...formData, fullName: e.target.value})}
          />
        </div>
      </div>
      
      {/* NOTES */}
      <div className="space-y-5">
        <label>Notes</label>
        <textarea type='text'
          placeholder="Additional information about this client..."
          className="w-full rounded-md border px-3 py-2"
          // value={formData.fullName}
          // onChange={(e) => setFormData({ ...formData, fullName: e.target.value})}
        />
      </div>

        <div className="flex pt-2 gap-3">
            <button className="btn-primary flex-1">Cancel</button>
            <button className="btn-primary flex-1">Save</button>
        </div>
    </form>
  )
}

export default ClientModal