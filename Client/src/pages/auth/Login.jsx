import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Loader2, Lock, Mail } from "lucide-react";

import { useAuthStore } from '../../store/authStore';
import AuthShell from "../../layouts/AuthShell";
import Card from "../../components/ui/Card";
import GoogleButton from "../../components/ui/GoogleButton";
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const navigate = useNavigate();
  const { isLoading, login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(formData)
      navigate('/')
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

          <div className="mt-2 text-right">
            <Link to="/forgot-password" className='text-sm text-primary hover:underline transition-all duration-200'>
              Forgot Password?
            </Link>
          </div>

          <Button type='submit' className='mt-2 w-full'>
            {isLoading ? <Loader2 className='size-5 animate-spin' /> : 'Log In'}
          </Button>
        </form>
      </Card>
      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </AuthShell>
  )
}

export default Login