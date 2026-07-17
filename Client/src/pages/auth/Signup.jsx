import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Lock, Loader2, Mail, User } from "lucide-react";

import { useAuthStore } from '../../utils/authStore';
import AuthShell from "../../layouts/AuthShell";
import Card from "../../components/ui/Card";
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import GoogleButton from "../../components/ui/GoogleButton";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const { isLoading, error, signup } = useAuthStore();
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signup(formData)
      navigate("/verify-email")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthShell title='Welcome back' subtitle='Log in to keep your invoices moving'>
      <Card>
        {/* OAUTH */}
        <GoogleButton label='Continue with Google'/>

        <div className='my-6 flex items-center gap-3'>
          <div className='h-px flex-1 bg-slate-200' />
          <span className='text-xs text-subtle'>or</span>
          <div className='h-px flex-1 bg-slate-200' />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input type='text'
            placeholder='John Doe'
            label='Full Name'
            icon={User}
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value})}
          />

          <Input type='email'
            placeholder='company@gmail.com'
            label='Email'
            icon={Mail}
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value})}
          />

          <Input type='password'
            placeholder='********'
            label='Password'
            icon={Lock}
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value})}
          />

          {error && <p className='text-red-500 font-semibolld'> {error}</p>}

          <Button type='submit' className='mt-2 w-full' disabled={isLoading}>
            {isLoading ? <Loader2 size={24} className='animate-spin mx-auto' /> : 'Sign Up'}
          </Button>
        </form>
      </Card>
      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  )
}

export default Signup