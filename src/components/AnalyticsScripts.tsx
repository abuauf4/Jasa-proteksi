"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

interface SiteSettings {
  googleAnalyticsId?: string;
  metaPixelId?: string;
  gtmId?: string;
  googleAdsId?: string;
  googleAdsLabel?: string;
}

export default function AnalyticsScripts() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/site-settings");
        if (res.ok) {
          const data = await res.json();
          const map: Record<string, string> = data.map ?? {};
          setSettings({
            googleAnalyticsId: map.googleAnalyticsId || "",
            metaPixelId: map.metaPixelId || "",
            gtmId: map.gtmId || "",
            googleAdsId: map.googleAdsId || "",
            googleAdsLabel: map.googleAdsLabel || "",
          });
        }
      } catch {
        // Silently fail — analytics are non-critical
      }
    }
    fetchSettings();
  }, []);

  if (!settings) return null;

  const { googleAnalyticsId, metaPixelId, gtmId, googleAdsId, googleAdsLabel } = settings;

  return (
    <>
      {/* Google Tag Manager */}
      {gtmId && (
        <>
          <Script id="gtm" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
        </>
      )}

      {/* Google Analytics 4 */}
      {googleAnalyticsId && !gtmId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}', {
                send_page_view: true
              });
            `}
          </Script>
        </>
      )}

      {/* Google Analytics 4 (via GTM — only config) */}
      {googleAnalyticsId && gtmId && (
        <Script id="ga4-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}', {
              send_page_view: true
            });
          `}
        </Script>
      )}

      {/* Google Ads Conversion — load gtag.js with AW-XXXXX config */}
      {googleAdsId && (
        <>
          {!googleAnalyticsId && !gtmId && (
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
              strategy="afterInteractive"
            />
          )}
          <Script id="google-ads-conversion" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAdsId}');
              // Expose conversion config for trackWhatsAppClick helper
              window.__googleAdsConversion = {
                id: '${googleAdsId}',
                label: '${googleAdsLabel || ''}'
              };
            `}
          </Script>
        </>
      )}

      {/* Meta Pixel */}
      {metaPixelId && (
        <Script id="meta-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
