import { Link } from 'react-router';
import AuthShell from '../../components/layouts/AuthShell';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ForgotPassword = () => {
  return (
    <AuthShell title="Reset your password" subtitle="Enter your email and we'll send you a reset link.">
        <Card>
            <form className='flex flex-col gap-4'>
                <Input 
                    id='code'
                    label="Verification code"
                    className="text-center font-mono text-lg tracking-[0.5em]"
                />
                <Button type="submit" className="w-full">
                    Send reset link
                </Button>
            </form>
        </Card>
        <p className="mt-6 text-center text-sm text-muted">
        Remembered your password?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  )
}

export default ForgotPassword;