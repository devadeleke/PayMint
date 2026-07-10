import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Loader2 } from 'lucide-react';

import { useAuthStore } from '../../store/authStore.js';
import AuthShell from '../../components/layouts/AuthShell';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams()
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("")

  const { resetPassword, isLoading} = useAuthStore();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Password Do not match");
      return;
    };

    try {
      const res = await resetPassword(token, { pasword: formData.password});
      if (res) {
        navigate('/dashboard')
      }
    } catch (error) {
      console.log("Error resetting password", error)
    }
  }
  
  return (
    <AuthShell title="Set new password" subtitle="Your new password must be different from previously used passwords.">
      <Card>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <Input 
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <Input 
            id="confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          {error && (
            <p className="text-sm font-medium text-destructive text-red-500 mt-1">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? <Loader2 className='size-4 animate-spin' /> : "Reset password"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-medium text-primary hover:underline">
            ← Back to login
          </Link>
        </div>
      </Card>
    </AuthShell>
  )
}

export default ResetPassword