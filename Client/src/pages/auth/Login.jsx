import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';

import { useAuthStore } from '../../store/authStore';
import AuthShell from '../../components/layouts/AuthShell';
import Card from '../../components/ui/Card';
import GoogleButton from '../../components/GoogleButton';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {0
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  })
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      navigate('/dashboard');
      console.log(response)
    } catch (error) {
      console.log("error logging in", error)
    }
  }

  return (
    <AuthShell title='Welcome back' subtitle='Log in to keep your invoices moving'>
       <Card>
        {/* OAUTH SIGNUP */}
        <GoogleButton label='Continue with Google' />

        <div className='my-6 flex items-center gap-3'>
            <div className='h-px flex-1 bg-slate-200' />
            <span className='text-xs text-subtle'>or</span>
            <div className='h-px flex-1 bg-slate-200' />
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <Input 
                id='email'
                type='email'
                label='Email'
                placeholder='Enter email adress'
                value={formData.email}
                onChange={handleChange}
            />
            <Input
              id='password'
              type='password'
              label='Password'
              placeholder='Enter password'
              value={formData.password}
              onChange={handleChange}
            />

            <div className="mt-2 text-right">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline transition-all duration-300">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="mt-2 w-full">
                {isLoading ? <Loader2 className='size-4 animate-spin' /> : "Log in"}
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