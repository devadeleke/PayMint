import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { useAuthStore } from '../../store/authStore';
import AuthShell from '../../components/layouts/AuthShell';
import Card from '../../components/ui/Card';
import GoogleButton from '../../components/GoogleButton';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Loader2 } from 'lucide-react';

const passwordRules = [
    { key: 'length', label: 'At least 6 characters', test: (pass) => pass.length >= 6},
    { key: 'upper', label: 'One uppercase letter', test: (pass) => /[A-Z]/.test(pass) },
    { key: 'lower', label: 'One lowercase letter', test: (pass) => /[a-z]/.test(pass) },
    { key: 'number', label: 'One number', test: (pass) => /[0-9]/.test(pass) },
];

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: ""
    })
   const { signup, isLoading } = useAuthStore();
   const navigate = useNavigate();

   const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(formData);
      navigate('/verify-email');
      console.log(response)
    } catch (error) {
      console.log("error logging in", error)
    }
  }
  //const passwordValue = watch('password', '');
  return (
    <AuthShell title="Create your account" subtitle="Start sending invoices that get paid faster.">
       <Card>
        {/* OAUTH SIGNUP */}
        <GoogleButton label='Sign up with Google' />

        <div className='my-6 flex items-center gap-3'>
            <div className='h-px flex-1 bg-slate-200' />
            <span className='text-xs text-subtle'>or</span>
            <div className='h-px flex-1 bg-slate-200' />
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <Input 
                id='fullName'
                type='text'
                label='Full name'
                placeholder='Enter full name'
                value={formData.fullName}
                onChange={handleChange}
            />
            <Input 
                id='email'
                type='email'
                label='Email'
                placeholder='Enter email adress'
                value={formData.email}
                onChange={handleChange}
            />
            <div>
                <Input
                    id='password'
                    type='password'
                    label='Password'
                    placeholder='Enter password'
                    autoComplete='current-password'
                    value={formData.password}
                    onChange={handleChange}
                />
                <ul className='mt-2.5 grid grid-cols-2 gap-1.5'>
                    {passwordRules.map((rule) => {
                        //const met = rule.test(passwordValue || '');
                        return (
                            <li key={rule.key}
                                className={`flex items-center gap-1.5 text-xs text-subtle`}
                            >
                                {rule.label}
                            </li>
                        )
                    })}
                </ul>
            </div>

            <Button type="submit" className="mt-2 w-full">
                {isLoading ? <Loader2 className='size-4 animate-spin' /> : "Create account"}
            </Button>
        </form>
       </Card>

       <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
                Login
            </Link>
        </p>
    </AuthShell>
  )
}

export default Signup