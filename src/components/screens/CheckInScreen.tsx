import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  Key,
  Wifi,
  Phone,
  MessageCircle,
  Mail,
  Copy,
  Check,
  Car,
  AlertTriangle,
  Navigation,
  DoorOpen
} from 'lucide-react';
import { toast } from 'sonner';

import ScreenHeader from '../ScreenHeader';
import { GlassCard } from '../ui/glass-card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import OfflineBadge from '../OfflineBadge';

interface CheckInScreenProps {
  onBack: () => void;
  onBackToOnboarding?: () => void;
}

const propertyInfo = {
  checkInTime: '2:00 PM',
  checkOutTime: '11:00 AM',
  address: '1234 Sunset Boulevard, Venice Beach, CA 90291',
  accessCode: '4729',
  lockboxLocation: 'Behind the planter to the right of the main door.',
  wifiName: 'SunsetVilla_Guest',
  wifiPassword: 'Welcome2024!',
  hostName: 'Maria Rodriguez',
  hostPhone: '+1 (555) 123-4567',
  hostWhatsApp: '+15551234567',
  hostEmail: 'maria@sunsetvilla.com'
};

const CheckInScreen: React.FC<CheckInScreenProps> = ({ onBack, onBackToOnboarding }) => {
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const copyToClipboard = (value: string, type: 'wifi' | 'code') => {
    navigator.clipboard.writeText(value).then(() => {
      if (type === 'wifi') {
        setCopiedWifi(true);
        setTimeout(() => setCopiedWifi(false), 2000);
        toast.success('Wi-Fi password copied');
      } else {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
        toast.success('Door code copied');
      }
    });
  };

  const openMaps = () => {
    const encoded = encodeURIComponent(propertyInfo.address);
    window.open(`https://maps.google.com/?q=${encoded}`, '_blank');
  };

  const callHost = () => window.open(`tel:${propertyInfo.hostPhone}`, '_self');
  const openWhatsApp = () => window.open(`https://wa.me/${propertyInfo.hostWhatsApp}`, '_blank');
  const emailHost = () => window.open(`mailto:${propertyInfo.hostEmail}`, '_self');

  return (
    <div className="min-h-screen bg-background">
      <ScreenHeader
        title="Check-In"
        subtitle="What to do when you arrive"
        onBack={onBack}
        onBackToOnboarding={onBackToOnboarding}
      />

      <div className="px-6 py-6 pb-24 space-y-6">
        {/* Welcome overview */}
        <GlassCard className="p-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Arrival timeline</p>
              <h2 className="text-2xl font-semibold text-foreground">Let yourself in like a local</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Keyless entry, plain-language directions, and Wi-Fi details so you can unpack and unwind fast.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <OfflineBadge size="sm" variant="subtle" />
              <Badge className="rounded-full bg-primary/10 text-primary">Smart lock ready</Badge>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/30 bg-background/70 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide">Check-In</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-foreground">{propertyInfo.checkInTime}</p>
              <p className="text-xs text-muted-foreground">Early bag drop available from 12:00 PM</p>
            </div>
            <div className="rounded-2xl border border-border/30 bg-background/70 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DoorOpen className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide">Check-Out</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-foreground">{propertyInfo.checkOutTime}</p>
              <p className="text-xs text-muted-foreground">Late checkout on request if calendar allows</p>
            </div>
            <div className="rounded-2xl border border-border/30 bg-background/70 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Navigation className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide">Self check-in</span>
              </div>
              <p className="mt-2 text-sm text-foreground">Follow the path to the garden planter, then enter the code and pull the door handle towards you.</p>
            </div>
          </div>
        </GlassCard>

        {/* Directions */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Address & directions</h3>
              <p className="text-sm text-muted-foreground">Tap to open preferred maps app</p>
            </div>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{propertyInfo.address}</p>
          <Button onClick={openMaps} className="w-full sm:w-auto">
            <MapPin className="h-4 w-4" />
            <span className="ml-2">Launch directions</span>
          </Button>
        </GlassCard>

        {/* Access instructions */}
        <GlassCard className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
              <Key className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Unlock the villa</h3>
              <p className="text-sm text-muted-foreground">Your personal code is active from 1:30 PM on arrival day</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-border/30 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Door code</p>
              <p className="mt-3 text-3xl font-semibold text-foreground" aria-label={`Access code ${propertyInfo.accessCode}`}>
                {propertyInfo.accessCode}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Code automatically resets after your stay.</p>
            </div>
            <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-border/30 bg-background/70 p-4">
              <p className="text-xs text-muted-foreground">Tap to copy</p>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(propertyInfo.accessCode, 'code')}
                className="w-full"
                aria-label={`Copy access code ${propertyInfo.accessCode}`}
              >
                {copiedCode ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="ml-2">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span className="ml-2">Copy code</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-border/40 bg-background/80 p-4 text-sm text-muted-foreground">
            <p><strong>Lockbox location:</strong> {propertyInfo.lockboxLocation}</p>
          </div>
        </GlassCard>

        {/* Wi-Fi summary */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
              <Wifi className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Wi-Fi essentials</h3>
              <p className="text-sm text-muted-foreground">Same details as the Wi-Fi tab for quick reference</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/30 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Network</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{propertyInfo.wifiName}</p>
            </div>
            <div className="rounded-2xl border border-border/30 bg-background/70 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Password</p>
                  <p className="mt-2 text-lg font-semibold text-foreground">{propertyInfo.wifiPassword}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  onClick={() => copyToClipboard(propertyInfo.wifiPassword, 'wifi')}
                  aria-label={`Copy Wi-Fi password ${propertyInfo.wifiPassword}`}
                >
                  {copiedWifi ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Host contact */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Contact your host</h3>
              <p className="text-sm text-muted-foreground">Maria replies within minutes during daylight hours</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Button variant="outline" onClick={callHost} className="h-12">
              <Phone className="h-4 w-4" />
              <span className="ml-2">Call</span>
            </Button>
            <Button variant="outline" onClick={openWhatsApp} className="h-12">
              <MessageCircle className="h-4 w-4" />
              <span className="ml-2">WhatsApp</span>
            </Button>
            <Button variant="outline" onClick={emailHost} className="h-12">
              <Mail className="h-4 w-4" />
              <span className="ml-2">Email</span>
            </Button>
          </div>
        </GlassCard>

        {/* Additional guidance */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
              <AlertTriangle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">House information</h3>
              <p className="text-sm text-muted-foreground">Open a section to view extra guidance</p>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full rounded-2xl border border-border/30 bg-background/60">
            <AccordionItem value="parking" className="px-4">
              <AccordionTrigger>Parking</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                Free driveway parking for two cars. Additional unrestricted street parking available on Rose Avenue. Please avoid blocking neighbouring driveways.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="rules" className="px-4">
              <AccordionTrigger>House rules</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                No smoking indoors • Quiet hours 10 PM – 8 AM • Maximum 4 guests • No parties • Shoes off at the entrance • Trash pickup is Friday morning.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="emergency" className="px-4">
              <AccordionTrigger>Emergency</AccordionTrigger>
              <AccordionContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                <p><strong>Emergency services:</strong> Dial 911</p>
                <p><strong>Nearest hospital:</strong> UCLA Medical Center</p>
                <p><strong>Poison control:</strong> 1-800-222-1222</p>
                <p><strong>Non-emergency police:</strong> (310) 482-2677</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </GlassCard>
      </div>
    </div>
  );
};

export default CheckInScreen;
