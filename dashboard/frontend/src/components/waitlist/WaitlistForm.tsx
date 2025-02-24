import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/lib/supabase'
import { toast } from "@/hooks/use-toast"

const WaitlistForm = ({ buttonText }: { buttonText: string }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: crypto.randomUUID(),
        options: {
          emailRedirectTo: undefined,
          data: {
            status: 'waitlist',
            joined_at: new Date().toISOString()
          }
        }
      });
      console.log(data);

      if (error) throw error;
      setEmail('');
      toast({
        title: "Success",
        description: "You have been added to the waitlist. We'll notify you when we have a spot available.",
        duration: 5000,
      })
    } catch (error) {
      console.warn('Error:', error);
      toast({
        title: "Error",
        description: "An error occurred while adding you to the waitlist. Please try again.",
        duration: 5000,
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="w-64"
      />
      <Button 
        type="submit" 
        disabled={loading}
        className="bg-gradient-to-r from-blue-900 via-slate-800 to-black hover:from-blue-950 hover:via-slate-900 hover:to-black"
      >
        {loading ? 'Joining...' : buttonText}
      </Button>
    </form>
  );
};

export default WaitlistForm;