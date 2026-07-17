import { useState } from 'react'
import { useNavigate } from 'react-router';

import { useAuthStore } from '../../utils/authStore';
import AuthShell from "../../layouts/AuthShell";
import Card from "../../components/ui/Card";
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Loader } from 'lucide-react';

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const { isLoading, error, verifyEmail } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyEmail(code)
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthShell title="Check your email" subtitle={`Enter the 6-digit code we sent to vikky@gmail.com`}>
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input 
            id='code'
            label="Verification code"
            type="text"
            maxLength={6}
            placeholder="******"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          {error && <p className='text-red-500 font-semibold'>{error}</p>}
          
          <Button type="submit" className="w-full" disabled={isLoading || code.length < 6}>
           {isLoading ? <Loader size={24} className='mx-auto animate-spin' /> : 'Verify Email'}
          </Button>
        </form>
      </Card>
    </AuthShell>
  )
}

export default VerifyEmail