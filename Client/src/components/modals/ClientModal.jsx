import { useEffect, useState } from "react";
import { User } from "lucide-react";

import { useClientStore } from "../../store/clientStore";
import Input from "../ui/Input";

const emptyClient = {
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
  },
};
const ClientModal = ({ mode = "create", initialData = null, onClose}) => {
  const { createClient, updateClient, isCreatingClient, isUpdatingClient } = useClientStore();
  const [clientData, setClientData] = useState(() => {
    if (mode === "edit" && initialData) {
        return {
            ...emptyClient,
            ...initialData,
            billingAddress: {
                ...emptyClient.billingAddress,
                ...(initialData.billingAddress || {}),
            },
        };
    }

    return emptyClient;
});

useEffect(() => {
    if (mode !== "edit" || !initialData) return;

    setClientData({
        ...emptyClient,
        ...initialData,
        billingAddress: {
            ...emptyClient.billingAddress,
            ...(initialData.billingAddress || {}),
        },
    });
}, [mode, initialData]);



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
      if (mode === "edit") {
        await updateClient(initialData._id, clientData);
      } else {
        await createClient(clientData);
        setClientData(emptyClient);
      }

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {/* BASIC INFORMATION */}

      <div className="space-y-5">
        <h2 className="text-lg font-semibold">
          Basic Information
        </h2>

        <Input
          type="text"
          label="Full Name"
          name="fullName"
          placeholder="John Doe"
          icon={User}
          value={clientData.fullName}
          onChange={handleChange}
        />

        <Input
          type="email"
          label="Email"
          name="email"
          placeholder="john@example.com"
          icon={User}
          value={clientData.email}
          onChange={handleChange}
        />

        <Input
          type="text"
          label="Company"
          name="company"
          placeholder="AOV HUB"
          icon={User}
          value={clientData.company}
          onChange={handleChange}
        />

        <Input
          type="tel"
          label="Phone"
          name="phone"
          placeholder="+234 812 345 6789"
          icon={User}
          value={clientData.phone}
          onChange={handleChange}
        />
      </div>

      {/* BILLING ADDRESS */}

      <div className="space-y-5">
        <h2 className="text-lg font-semibold">
          Billing Address
        </h2>

        <Input
          type="text"
          label="Street Address"
          name="street"
          placeholder="12 Allen Avenue"
          icon={User}
          value={clientData.billingAddress.street}
          onChange={handleAddressChange}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            type="text"
            label="City"
            name="city"
            placeholder="Lagos"
            icon={User}
            value={clientData.billingAddress.city}
            onChange={handleAddressChange}
          />

          <Input
            type="text"
            label="State / Province"
            name="state"
            placeholder="Lagos"
            icon={User}
            value={clientData.billingAddress.state}
            onChange={handleAddressChange}
          />

          <Input
            type="text"
            label="Postal Code"
            name="postalCode"
            placeholder="100001"
            icon={User}
            value={clientData.billingAddress.postalCode}
            onChange={handleAddressChange}
          />

          <Input
            type="text"
            label="Country"
            name="country"
            placeholder="Nigeria"
            icon={User}
            value={clientData.billingAddress.country}
            onChange={handleAddressChange}
          />
        </div>
      </div>

      {/* NOTES */}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Notes
        </label>

        <textarea
          name="notes"
          rows={4}
          placeholder="Additional information about this client..."
          className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-primary"
          value={clientData.notes}
          onChange={handleChange}
        />
      </div>

      {/* BUTTONS */}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl border border-slate-300 py-3 font-medium hover:bg-slate-100 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            mode === "edit"
              ? isUpdatingClient
              : isCreatingClient
          }
          className="flex-1 rounded-xl py-3 font-medium bg-blue-500 hover:bg-blue-900 text-white transition-colors"
        >
          {mode === "edit"
            ? isUpdatingClient
              ? "Updating..."
              : "Update Client"
            : isCreatingClient
            ? "Creating..."
            : "Create Client"}
        </button>
      </div>
    </form>
  );
}

export default ClientModal;