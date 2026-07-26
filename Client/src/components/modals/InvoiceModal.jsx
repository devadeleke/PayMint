import { User } from "lucide-react";
import Input from "../ui/Input";

const InvoiceModal = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  }
  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
        <Input type='text'
            placeholder='John Doe'
            label='Full Name'
            icon={User}
            required
            // value={formData.fullName}
            // onChange={(e) => setFormData({ ...formData, fullName: e.target.value})}
        />

        <div>
            <button>Cancel</button>
            <button>Save</button>
        </div>
    </form>
  )
}

export default InvoiceModal