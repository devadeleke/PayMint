import { useEffect, useState } from "react";
import { Building, ImageUp, Save } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import settingsStore from "../../store/settingsStore";

const initialFormData = {
  businessName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  postalCode: "",
  website: "",
  taxId: "",
};

const BusinessInfo = () => {
  const {
    settings,
    isFetchingSettings,
    isUpdatingSettings,
    fetchSettings,
    updateSettings,
  } = settingsStore();

  const [formData, setFormData] = useState(initialFormData);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Fetch business settings when the component mounts
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Populate form when settings are loaded
  useEffect(() => {
    if (!settings) return;

    setFormData({
      businessName: settings.businessName || "",
      email: settings.email || "",
      phone: settings.phone || "",
      address: settings.address || "",
      city: settings.city || "",
      country: settings.country || "",
      postalCode: settings.postalCode || "",
      website: settings.website || "",
      taxId: settings.taxId || "",
    });

    if (settings.logo) {
      setLogoPreview(settings.logo);
    }
  }, [settings]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle logo selection
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setLogo(file);

    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("1. FORM SUBMITTED");
  console.log("2. FORM DATA:", formData);
  console.log("3. updateSettings:", updateSettings);

  try {
    const result = await updateSettings(formData);

    console.log("4. UPDATE SUCCESS:", result);
  } catch (error) {
    console.error("5. UPDATE FAILED:", error);
    console.error("6. RESPONSE:", error.response?.data);
    console.error("7. STATUS:", error.response?.status);
  }
};

  // Restore saved settings
  const handleCancel = () => {
    if (!settings) return;

    setFormData({
      businessName: settings.businessName || "",
      email: settings.email || "",
      phone: settings.phone || "",
      address: settings.address || "",
      city: settings.city || "",
      country: settings.country || "",
      postalCode: settings.postalCode || "",
      website: settings.website || "",
      taxId: settings.taxId || "",
    });

    setLogo(null);
    setLogoPreview(settings.logo || null);
  };

  // Loading state
  if (isFetchingSettings) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-slate-500">
          Loading business information...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-lg bg-indigo-50 flex items-center justify-center">
          <Building size={15} className="text-indigo-600" />
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Business Information
          </h2>

          <p className="text-xs text-slate-500">
            This info appears on your invoices and payment pages
          </p>
        </div>
      </div>

      <div className="space-y-5">

        {/* Business Logo */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Business logo
          </label>

          <div className="flex items-center gap-4">
            <div className="size-16 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0 overflow-hidden">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Business logo preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageUp
                  size={18}
                  className="text-indigo-600"
                />
              )}
            </div>

            <div>
              <label
                htmlFor="business-logo"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                Upload new logo
              </label>

              <input
                id="business-logo"
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleLogoChange}
                className="hidden"
              />

              <p className="text-xs text-slate-400 mt-0.5">
                PNG, JPG, SVG. Recommended 400x400px.
              </p>
            </div>
          </div>
        </div>

        {/* Business Information Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

            <Input
              type="text"
              name="businessName"
              placeholder="Company name"
              label="Business Name"
              value={formData.businessName}
              onChange={handleChange}
            />

            <Input
              type="email"
              name="email"
              placeholder="company@mail.com"
              label="Business Email"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              type="text"
              name="phone"
              placeholder="+234 800 000 0000"
              label="Phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <Input
              type="text"
              name="address"
              placeholder="Street address"
              label="Street Address"
              value={formData.address}
              onChange={handleChange}
            />

            <Input
              type="text"
              name="city"
              placeholder="Lagos"
              label="City"
              value={formData.city}
              onChange={handleChange}
            />

            <Input
              type="text"
              name="country"
              placeholder="Nigeria"
              label="Country"
              value={formData.country}
              onChange={handleChange}
            />

            <Input
              type="text"
              name="postalCode"
              placeholder="Postal code"
              label="Postal Code"
              value={formData.postalCode}
              onChange={handleChange}
            />

            <Input
              type="url"
              name="website"
              placeholder="https://yoursite.com"
              label="Website"
              value={formData.website}
              onChange={handleChange}
            />

            <Input
              type="text"
              name="taxId"
              placeholder="Tax ID / VAT number"
              label="Tax ID / VAT number"
              value={formData.taxId}
              onChange={handleChange}
            />

          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-5 border-t border-slate-100">

            <Button
              type="submit"
              disabled={isUpdatingSettings}
            >
              <Save size={12} />

              {isUpdatingSettings
                ? "Saving..."
                : "Save Changes"}
            </Button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isUpdatingSettings}
              className="px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

          </div>
        </form>
      </div>
    </>
  );
};

export default BusinessInfo;