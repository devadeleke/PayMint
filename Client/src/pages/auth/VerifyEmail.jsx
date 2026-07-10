import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';

import { useAuthStore } from '../../store/authStore';
import AuthShell from '../../components/layouts/AuthShell';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const VerifyEmail = () => {
  const [ formData, setFormData] = useState({ code: ""});
  const { user, verifyEmail, isLoading } = useAuthStore();
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyEmail(formData);
      if (res) {
        navigate("/dashboard")
      }
      console.log(res)
    } catch (error) {
      console.log("Error verifying Email", error)
    }
  }
  return (
    <AuthShell title="Check your email" subtitle={`Enter the 6-digit code we sent to ${user?.email}`}>
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input 
              id='code'
              label="Verification code"
              type="text"
              maxLength={6}
              placeholder="000000"
              value={formData.code}
              onChange={(e) => setFormData({...formData, [e.target.id]: e.target.value})}
              required
            />
            <Button type="submit" className="w-full">
              {isLoading ? <Loader2 className='size-4 animate-spin' /> : "Verify email"}
            </Button>
          </form>
        </Card>
    </AuthShell>
  )
}

export default VerifyEmail