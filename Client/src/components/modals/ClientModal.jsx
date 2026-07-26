import { User } from "lucide-react";
import { useState } from "react";

import { useClientStore } from "../../store/clientStore";
import Input from "../ui/Input";

const ClientModal = () => {
  const { createClient, isCreatingClient} = useClientStore();
  const [clientData, setClientData] = useState({
    fullName: "",
    email: "",
    company: "",
    phone: "",
    notes: "",
    billingAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setClientData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setClientData((prev) => ({
        ...prev,
        billingAddress: {
            ...prev.billingAddress,
            [name]: value,
        },
    }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createClient(clientData);
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <form className='space-y-8' onSubmit={handleSubmit}>
      <div className="space-y-5">
        <h2 className="text-lg font-semibold">Basic Information :</h2>
        <Input type='text'
          placeholder='John Doe'
          name="fullName"
          label='FullName'
          icon={User}
          value={clientData.fullName}
          onChange={handleChange}
        />
        <Input type='email'
          placeholder='Johndoe@company.com'
          name='email'
          label='email'
          icon={User}
          value={clientData.email}
          onChange={handleChange}
        />
        <Input type='text'
          placeholder='company'
          name='company'
          label='Company'
          icon={User}
          value={clientData.company}
          onChange={handleChange}
        />
        <Input type='tel'
          placeholder="+234 801 234 5678"
          name='phone'
          label='Phone'
          icon={User}
          value={clientData.phone}
          onChange={handleChange}
        />
      </div>
      
      {/* BILLING ADDRESS */}
      <div className="space-y-5">
        <h2 className="text-lg font-semibold">Billing Address :</h2>
        <Input type='text'
          placeholder="12 Allen Avenue"
          name='street'
          label='Street Address'
          icon={User}
          value={clientData.address}
          onChange={handleAddressChange}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Input type='text'
            placeholder="Lagos"
            name='city'
            label='City'
            icon={User}
            value={clientData.city}
            onChange={handleAddressChange}
          />
          <Input type='text'
            placeholder="Lagos"
            name='state'
            label='State / Province'
            icon={User}
            value={clientData.state}
            onChange={handleAddressChange}
          />
          <Input type='text'
            placeholder="100001"
            name='postalCode'
            label='Zip / Postal Code'
            icon={User}
            value={clientData.postalCode}
            onChange={handleAddressChange}
          />
          <Input type='text'
            placeholder="Nigeria"
            name='country'
            label='Country'
            icon={User}
            value={clientData.country}
            onChange={handleAddressChange}
          />
        </div>
      </div>
      
      {/* NOTES */}
      <div className="space-y-5">
        <label>Notes</label>
        <textarea type='text'
          name='notes'
          placeholder="Additional information about this client..."
          className="w-full rounded-md border px-3 py-2"
          value={clientData.note}
          onChange={handleChange}
        />
      </div>

      <div className="flex pt-2 gap-3">
        <button className="btn-primary flex-1">Cancel</button>
        <button type="Submit" className="btn-primary flex-1" disabled={isCreatingClient}>Save</button>
      </div>
    </form>
  )
}

export default ClientModal