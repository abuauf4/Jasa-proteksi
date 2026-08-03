"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

/**
 * Google Ads conversion — hardcoded so it works without admin panel / DB.
 * The conversion fires via openWhatsAppWithConversion() in analytics-events.ts.
 */
const GOOGLE_ADS_ID = "AW-16916570758";
const GOOGLE_ADS_LABEL = "gibwCN7d_9ocEIbFuYI_";

interface SiteSettings {
  googleAnalyticsId?: string;
  metaPixelId?: string;
  gtmId?: string;
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
          });
        }
      } catch {
        // Silently fail — analytics are non-critical
      }
    }
    fetchSettings();
  }, []);

  // API-based settings (may not be loaded yet)
  const googleAnalyticsId = settings?.googleAnalyticsId || "";
  const metaPixelId = settings?.metaPixelId || "";
  const gtmId = settings?.gtmId || "";

  return (
    <>
      {/* ─── Google Tag Manager (from API) ─── */}
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

      {/* ─── Google Analytics 4 standalone (from API) ─── */}
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

      {/* ─── Google Analytics 4 via GTM (config only) ─── */}
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

      {/* ─── Google Ads Conversion — ALWAYS load (hardcoded) ─── */}
      {/* Load gtag.js library if no other provider already loads it */}
      {!googleAnalyticsId && !gtmId && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
      )}
      <Script id="google-ads-conversion" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          if (typeof window.gtag !== 'function') {
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          }
          gtag('config', '${GOOGLE_ADS_ID}');
          window.__googleAdsConversion = {
            id: '${GOOGLE_ADS_ID}',
            label: '${GOOGLE_ADS_LABEL}'
          };
        `}
      </Script>

      {/* ─── Meta Pixel (from API) ─── */}
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
