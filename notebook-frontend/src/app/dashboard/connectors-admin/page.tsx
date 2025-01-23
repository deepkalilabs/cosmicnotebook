'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
//import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useConnectorStore } from '@/app/store';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const ConnectorsAdmin = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    connector_type: '',
    credentials: {}
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { connectors, setConnectors } = useConnectorStore();

  useEffect(() => {
    fetchConnectors();
    console.log('Connectors:', connectors);
  }, []);

  const fetchConnectors = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('connectors')
        .select('*');
      
      if (error) throw error;
      setConnectors(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch connectors",
        variant: "destructive"
      });
      console.warn('Error fetching connectors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditing) {
        /*
        const { error } = await supabase
          .from('connectors')
          .update(formData)
          .eq('id', formData.id);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Connector updated successfully"
        });
        */
      } else {
        const { error } = await supabase
          .from('connectors')
          .insert([formData]);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Connector created successfully"
        });
      }

      setIsDialogOpen(false);
      fetchConnectors();
    } catch (error) {
      toast({
        title: "Error",
        description: isEditing ? "Failed to update connector" : "Failed to create connector",
        variant: "destructive"
      });
      console.warn('Error submitting connector:', error);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Connectors Administration</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setIsEditing(false);
              setFormData({ name: '', connector_type: '', credentials: {} });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Connector
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Connector' : 'Add New Connector'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Connector Type</Label>
                <Input
                  id="type"
                  value={formData.connector_type}
                  onChange={(e) => setFormData({ ...formData, connector_type: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      
      </div>
    </div>
  );
};

export default ConnectorsAdmin;
