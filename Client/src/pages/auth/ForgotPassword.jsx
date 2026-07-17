import { useState } from "react";
import { Link } from "react-router";
import { Loader, Mail } from 'lucide-react';

import { useAuthStore } from "../../utils/authStore";
import AuthShell from "../../layouts/AuthShell";
import Card from "../../components/ui/Card";
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, error, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthShell title="Forgot password?" subtitle={isSubmitted ? "Check your inbox for alternative setup instructions." : "No worries, we'll send you reset instructions."}>
      <Card>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input 
              id="email"
              label="Email address"
              type="email"
              placeholder="Enter your email"
              icon={Mail}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
            
            <Button type="submit" className="w-full">
              {isLoading ? <Loader size={24} className="mx-auto animmate-spin"/> : 'Reset password'}
            </Button>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              We have sent a password reset link to <span className="font-semibold text-foreground">vikky@gmail.com</span>.
            </p>
            <Button type="submit" className="w-full" onClick={() => setIsSubmitted(false)}>
              Didn't get the email? Try again
            </Button>
          </div>
        )}
      </Card>
      <div className="mt-6 text-center">
        <Link 
          to="/login" 
          className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-2"
        >
          ← Back to login
        </Link>
      </div>
    </AuthShell>
  )
}

export default ForgotPassword