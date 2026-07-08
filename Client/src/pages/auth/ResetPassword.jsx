import AuthShell from '../../components/layouts/AuthShell';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ResetPassword = () => {
  return (
    <AuthShell title="Set a new password" subtitle="Choose a strong password for your account.">
      <Card>
        <form className="flex flex-col gap-4">
            <Input
                id='password'
                type='password'
                label='New password'
                placeholder='Enter new password'
                autoComplete='current-password'
            />
            <Input
                id='confirmPassword'
                type='password'
                label='Confirm new password'
                placeholder='Enter password'
                autoComplete='current-password'
            />

            <Button type="submit" className="w-full">
                Reset password
          </Button>
        </form>
      </Card>  
    </AuthShell>
  )
}

export default ResetPassword