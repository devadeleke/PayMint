import { Link, useParams, useNavigate } from "react-router";
import { Lock, Loader } from "lucide-react";

import { useAuthStore } from "../../store/authStore";
import AuthShell from "../../layouts/AuthShell";
import Card from "../../components/ui/Card";
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useState } from "react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isLoading, error, resetPassword } = useAuthStore();

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Password do not match');
      return
    }
    try{
      await resetPassword(token, password);
      setTimeout(() => {
        navigate('/login');
      }, 2000)
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <AuthShell title="Set new password" subtitle="Your new password must be different from previously used passwords.">
      <Card>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <Input 
            id="password"
            label="Password"
            type="password"
            placeholder="New password"
            icon={Lock}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input 
            id="confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="Confirm new password"
            icon={Lock}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p className="text-red-500 font-semibold">{error}</p>}

          <Button type="submit" className="w-full mt-2">
            {isLoading ? <Loader size={24} className="mx-auto animate-spin" /> : "Reset Password"}
          </Button>
        </form>
      </Card>
      <div className="mt-6 text-center">
        <Link to="/login" className="text-sm font-medium text-primary hover:underline">
          ← Back to login
        </Link>
      </div>
    </AuthShell>
  )
}

export default ResetPassword