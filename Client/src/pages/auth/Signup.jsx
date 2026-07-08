import { Link } from 'react-router';
import AuthShell from '../../components/layouts/AuthShell';
import Card from '../../components/ui/Card';
import GoogleButton from '../../components/GoogleButton';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const passwordRules = [
    { key: 'length', label: 'At least 6 characters', test: (pass) => pass.length >= 6},
    { key: 'upper', label: 'One uppercase letter', test: (pass) => /[A-Z]/.test(pass) },
    { key: 'lower', label: 'One lowercase letter', test: (pass) => /[a-z]/.test(pass) },
    { key: 'number', label: 'One number', test: (pass) => /[0-9]/.test(pass) },
];

const Signup = () => {
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

        <form className='flex flex-col gap-4'>
            <Input 
                id='fullName'
                type='text'
                label='Full name'
                placeholder='Enter full name'
            />
            <Input 
                id='email'
                type='email'
                label='Email'
                placeholder='Enter email adress'
            />
            <div>
                <Input
                    id='password'
                    type='password'
                    label='Password'
                    placeholder='Enter password'
                    autoComplete='current-password'
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
                Create account
            </Button>
        </form>
       </Card>

       <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:underline">
                Login
            </Link>
        </p>
    </AuthShell>
  )
}

export default Signup