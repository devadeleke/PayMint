import { useState } from 'react';
import { Link } from 'react-router'
import { Loader2 } from 'lucide-react';

import { useAuthStore } from '../../store/authStore'
import AuthShell from '../../components/layouts/AuthShell';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({email: ""})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { forgotPassword, isLoading} = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword(formData)
      if (res) {
        // Toggle view state to show a success confirmation message
        setIsSubmitted(true);
      }
    } catch (error) {
      console.log("Error requesting password reset", error);
    }
  }

  return (
    <AuthShell title="Forgot password?" subtitle={
        isSubmitted 
          ? "Check your inbox for alternative setup instructions."
          : "No worries, we'll send you reset instructions."
      }>
      <Card>
        {!isSubmitted ? (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input 
              id="email"
              label="Email address"
              type="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className='size-4 animate-spin' /> : "Reset password"}
            </Button>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              We have sent a password reset link to <span className="font-semibold text-foreground">{formData.email}</span>.
            </p>
            <Button type="submit" className="w-full" onClick={() => setIsSubmitted(false)}>
              Didn't get the email? Try again
            </Button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-2"
          >
            ← Back to login
          </Link>
        </div>
      </Card>
    </AuthShell>
  )
}

export default ForgotPassword