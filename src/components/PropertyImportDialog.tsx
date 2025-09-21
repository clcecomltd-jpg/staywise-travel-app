// Property Import Dialog component for host onboarding
// Ready for Supabase Edge Function integration

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { usePropertyImport } from '../hooks/useProperty';
import type { ProviderType } from '../types/database';
import { Home, Building2, Hotel, FilePlus, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface PropertyImportDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (propertyName: string) => void;
}

const PROVIDERS = [
  {
    id: 'airbnb' as ProviderType,
    name: 'Airbnb',
    icon: <Home className="w-5 h-5" />,
    placeholder: 'https://airbnb.com/rooms/12345...'
  },
  {
    id: 'vrbo' as ProviderType,
    name: 'Vrbo',
    icon: <Building2 className="w-5 h-5" />,
    placeholder: 'https://vrbo.com/123456...'
  },
  {
    id: 'booking' as ProviderType,
    name: 'Booking.com',
    icon: <Hotel className="w-5 h-5" />,
    placeholder: 'https://booking.com/hotel/...'
  },
  {
    id: 'manual' as ProviderType,
    name: 'Manual Entry',
    icon: <FilePlus className="w-5 h-5" />,
    placeholder: 'Enter property details manually'
  }
];

export const PropertyImportDialog: React.FC<PropertyImportDialogProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const [selectedProvider, setSelectedProvider] = useState<ProviderType | ''>('');
  const [propertyUrl, setPropertyUrl] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const { importProperty, loading } = usePropertyImport();

  const handleImport = async () => {
    if (!selectedProvider || (!propertyUrl && selectedProvider !== 'manual')) {
      return;
    }

    setImportStatus('importing');
    setErrorMessage('');

    try {
      const result = await importProperty(selectedProvider, propertyUrl);

      if (result.success && result.property) {
        setImportStatus('success');
        setTimeout(() => {
          onSuccess(result.property!.name);
          handleClose();
        }, 2000);
      } else {
        setImportStatus('error');
        setErrorMessage(result.error || 'Import failed');
      }
    } catch (error) {
      setImportStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Import failed');
    }
  };

  const handleClose = () => {
    setSelectedProvider('');
    setPropertyUrl('');
    setImportStatus('idle');
    setErrorMessage('');
    onClose();
  };

  const selectedProviderData = PROVIDERS.find(p => p.id === selectedProvider);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] glass-card border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Import Property</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Provider Selection */}
          <div className="space-y-2">
            <Label htmlFor="provider" className="text-white/90">Platform</Label>
            <Select value={selectedProvider} onValueChange={(value: ProviderType) => setSelectedProvider(value)}>
              <SelectTrigger className="glass-button border-white/20">
                <SelectValue placeholder="Choose platform..." />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10">
                {PROVIDERS.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div className="flex items-center space-x-2">
                      {provider.icon}
                      <span>{provider.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* URL Input */}
          {selectedProvider && selectedProvider !== 'manual' && (
            <div className="space-y-2">
              <Label htmlFor="url" className="text-white/90">Property URL</Label>
              <Input
                id="url"
                type="url"
                placeholder={selectedProviderData?.placeholder}
                value={propertyUrl}
                onChange={(e) => setPropertyUrl(e.target.value)}
                className="glass-button border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          )}

          {/* Manual Entry Note */}
          {selectedProvider === 'manual' && (
            <div className="glass-card rounded-lg p-4 border-blue-400/20 bg-blue-500/10">
              <p className="text-blue-300 text-sm">
                Manual entry will allow you to input property details directly.
              </p>
            </div>
          )}

          {/* Import Status */}
          {importStatus !== 'idle' && (
            <div className="space-y-2">
              {importStatus === 'importing' && (
                <div className="flex items-center space-x-2 text-blue-300">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Importing property...</span>
                </div>
              )}

              {importStatus === 'success' && (
                <div className="flex items-center space-x-2 text-green-300">
                  <CheckCircle className="w-4 h-4" />
                  <span>Property imported successfully!</span>
                </div>
              )}

              {importStatus === 'error' && (
                <div className="flex items-center space-x-2 text-red-300">
                  <XCircle className="w-4 h-4" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 glass-button border-white/20 text-white hover:bg-white/10"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!selectedProvider || (!propertyUrl && selectedProvider !== 'manual') || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                'Import Property'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};