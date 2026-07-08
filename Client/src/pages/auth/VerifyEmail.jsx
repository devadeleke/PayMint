import AuthShell from '../../components/layouts/AuthShell';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const RESEND_COOLDOWN_SECONDS = 60;

const verifyEmail = () => {
  return (
    <AuthShell title="Check your email" subtitle={`Enter the 6-digit code we sent to adelekevictory@gmail.com`}>
      <Card>
        <form className="flex flex-col gap-4" >
          <Input 
            id='code'
            label="Verification code"
            className="text-center font-mono text-lg tracking-[0.5em]"
          />
          <Button type="submit" className="w-full">
            Verify email
          </Button>
        </form>

        <button
          type='button'
          className="mt-4 w-full text-center text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-subtle disabled:no-underline"
        >
          Resend code in {RESEND_COOLDOWN_SECONDS}s
        </button>
      </Card>
    </AuthShell>
  )
}

export default verifyEmail;