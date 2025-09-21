import React, { useState } from 'react';
import {
  Wifi,
  Copy,
  Check,
  QrCode,
  Globe,
  Signal,
  Router,
  Phone,
  Smartphone,
  ExternalLink,
  Shield,
  LifeBuoy
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

import ScreenHeader from '../ScreenHeader';
import OfflineBadge from '../OfflineBadge';
import OfflineInfo from '../OfflineInfo';
import { GlassCard } from '../ui/glass-card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface WifiScreenProps {
  onBack: () => void;
  onBackToOnboarding?: () => void;
}

const WifiScreen: React.FC<WifiScreenProps> = ({ onBack, onBackToOnboarding }) => {
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [showQRFullscreen, setShowQRFullscreen] = useState(false);

  const wifiInfo = {
    ssid: 'SunsetVilla_Guest',
    password: 'Welcome2024!',
    band: '2.4 GHz & 5 GHz',
    qrCode:
      "data:image/svg+xml,%3csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='200' height='200' fill='white'/%3e%3cg fill='black'%3e%3crect x='20' y='20' width='160' height='160' fill='none' stroke='black' stroke-width='2'/%3e%3crect x='40' y='40' width='20' height='20'/%3e%3crect x='80' y='40' width='20' height='20'/%3e%3crect x='120' y='40' width='20' height='20'/%3e%3crect x='40' y='80' width='20' height='20'/%3e%3crect x='120' y='80' width='20' height='20'/%3e%3crect x='40' y='120' width='20' height='20'/%3e%3crect x='80' y='120' width='20' height='20'/%3e%3crect x='120' y='120' width='20' height='20'/%3e%3crect x='140' y='140' width='20' height='20'/%3e%3c/g%3e%3c/svg%3e"
  };

  const esimOffers = [
    {
      id: 1,
      title: 'Global eSIM - Europe',
      subtitle: '5GB • 30 Days • 35+ Countries',
      originalPrice: '$29',
      price: '$14.99',
      discount: '48% OFF',
      description: 'Instant activation in the EU'
    },
    {
      id: 2,
      title: 'USA & Canada eSIM',
      subtitle: '3GB • 15 Days • Unlimited Calls',
      originalPrice: '$24',
      price: '$12.99',
      discount: '46% OFF',
      description: 'Best for North American adventures'
    },
    {
      id: 3,
      title: 'Asia Pacific eSIM',
      subtitle: '8GB • 30 Days • 20+ Countries',
      originalPrice: '$35',
      price: '$19.99',
      discount: '43% OFF',
      description: 'Ideal for island hopping and remote work'
    }
  ];

  const tips = [
    {
      icon: Signal,
      label: 'Signal sweet spot',
      description: 'Fastest speeds in the living room by the balcony doors.'
    },
    {
      icon: Router,
      label: 'Router reset',
      description: 'Power toggle the router near the TV for a fresh connection.'
    },
    {
      icon: Phone,
      label: 'Host assistance',
      description: 'Call or WhatsApp Maria if you notice any drops in speed.'
    }
  ];

  const copyPassword = () => {
    navigator.clipboard.writeText(wifiInfo.password).then(() => {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
      toast.success('Wi-Fi password copied to clipboard');
    });
  };

  const handleViewOffers = () => {
    toast.info('Opening eSIM marketplace...');
  };

  const handleDownloadApp = () => {
    toast.info('Opening eSIM app download...');
  };

  return (
    <div className="min-h-screen bg-background">
      <ScreenHeader
        title="Wi-Fi & Internet"
        subtitle="All the ways to stay connected"
        onBack={onBack}
        onBackToOnboarding={onBackToOnboarding}
      />

      <div className="px-6 py-6 pb-24 space-y-6">
        {/* Primary Wi-Fi credentials */}
        <GlassCard className="relative overflow-hidden p-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.2em]">
                <Wifi className="h-3.5 w-3.5" />
                <span>Villa network</span>
              </Badge>
              <h2 className="text-2xl font-semibold text-foreground">Wi-Fi ready when you arrive</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Share the QR code or tap copy to get everyone online in less than a minute.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 text-right">
              <OfflineBadge size="sm" variant="subtle" />
              <Badge className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-200">
                {wifiInfo.band}
              </Badge>
            </div>
          </div>

          <OfflineInfo className="rounded-2xl border border-dashed border-border/40 bg-background/60 p-4" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/40 bg-background/70 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Network Name (SSID)</p>
              <p className="mt-2 text-xl font-semibold text-foreground" aria-label={`Wi-Fi network name: ${wifiInfo.ssid}`}>
                {wifiInfo.ssid}
              </p>
            </div>
            <div className="rounded-2xl border border-border/40 bg-background/70 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Password</p>
                  <p className="mt-2 text-xl font-semibold text-foreground" aria-label={`Wi-Fi password: ${wifiInfo.password}`}>
                    {wifiInfo.password}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyPassword}
                  className="ml-3 mt-1 flex items-center space-x-1 rounded-full border-primary/30 bg-primary/5"
                  aria-label="Copy Wi-Fi password to clipboard"
                >
                  {copiedPassword ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs font-semibold text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="text-xs font-semibold">Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5 text-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-white p-3 shadow-sm">
              <img src={wifiInfo.qrCode} alt="Wi-Fi QR code" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Scan to connect automatically</p>
              <p className="text-xs text-muted-foreground">Works with iOS, Android, and most laptops</p>
            </div>
            <Button variant="outline" onClick={() => setShowQRFullscreen(true)} className="w-full sm:w-auto">
              <QrCode className="h-4 w-4" />
              <span className="ml-2">Open full-screen QR</span>
            </Button>
          </div>
        </GlassCard>

        {/* Travel data marketplace */}
        <GlassCard className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Travel data add-ons</h3>
                <p className="text-sm text-muted-foreground">eSIM bundles curated for StayWise guests</p>
              </div>
            </div>
            <Badge className="rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-200">Limited time</Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {esimOffers.map((offer) => (
              <div key={offer.id} className="rounded-2xl border border-border/30 bg-background/60 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">{offer.title}</h4>
                  <Badge variant="secondary" className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-200 text-[11px]">
                    {offer.discount}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{offer.subtitle}</p>
                <p className="mt-2 text-sm text-muted-foreground">{offer.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">{offer.price}</span>
                  <span className="text-xs text-muted-foreground line-through">{offer.originalPrice}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button onClick={handleViewOffers} className="w-full sm:w-auto">
              <Globe className="h-4 w-4" />
              <span className="ml-2">Browse full marketplace</span>
            </Button>
            <Button variant="outline" onClick={handleDownloadApp} className="w-full sm:w-auto">
              <Smartphone className="h-4 w-4" />
              <span className="ml-2">Download eSIM app</span>
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </GlassCard>

        {/* Troubleshooting & support */}
        <GlassCard className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Troubleshooting</h3>
              <p className="text-sm text-muted-foreground">Tips and ways to reach us if the connection dips</p>
            </div>
          </div>

          <div className="space-y-3">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div
                  key={`${tip.label}-${index}`}
                  className="flex items-start gap-3 rounded-2xl border border-border/30 bg-background/70 p-4"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tip.label}</p>
                    <p className="text-xs text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border/40 bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Need hands-on help?</p>
                <p className="text-xs text-muted-foreground">Maria is available 24/7 for connection issues.</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={() => window.open('tel:+15551234567', '_self')}>
                Call host
              </Button>
              <Button variant="ghost" onClick={() => window.open('https://wa.me/15551234567', '_blank')}>
                Message on WhatsApp
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border/40 bg-background/60 p-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <LifeBuoy className="h-4 w-4 text-primary" />
              <span>StayWise support hours</span>
            </div>
            <p className="mt-1 text-xs">
              We monitor connectivity 06:00–23:00 local time. Outside these hours, leave us a message and we’ll text you back first thing.
            </p>
          </div>
        </GlassCard>
      </div>

      {showQRFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          onClick={() => setShowQRFullscreen(false)}
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl" role="dialog" aria-modal="true">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Scan to connect</h3>
              <div className="mx-auto h-64 w-64 overflow-hidden rounded-2xl bg-white p-4 shadow-sm">
                <img src={wifiInfo.qrCode} alt="Wi-Fi QR code expanded" className="h-full w-full object-contain" />
              </div>
              <p className="text-sm text-muted-foreground">
                Point your camera at the code. Most phones will join the network automatically.
              </p>
              <Button variant="outline" className="w-full" onClick={() => setShowQRFullscreen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WifiScreen;

