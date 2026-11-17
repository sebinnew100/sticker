// Google Ads integration (gtag.js)
// 1. In Google Ads: Tools > Data manager > Google tag, copy your tag ID (looks like "AW-123456789").
// 2. In Google Ads: Goals > Conversions, create conversion actions and copy each
//    conversion label (the part after the "/" in "AW-123456789/AbC-D_efG-h12_34-567").
// Paste them below. Until GOOGLE_ADS_ID is set, nothing is loaded or sent.
const GOOGLE_ADS_ID = 'AW-XXXXXXXXX';
const GOOGLE_ADS_CONVERSIONS = {
    upload: '',    // label for "Sticker uploaded"
    download: ''   // label for "Stickers downloaded"
};

const adsEnabled = /^AW-\d+$/.test(GOOGLE_ADS_ID);

window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }

if (adsEnabled) {
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GOOGLE_ADS_ID);
    document.head.appendChild(tag);

    gtag('js', new Date());
    gtag('config', GOOGLE_ADS_ID);
} else {
    console.info('Google Ads: set GOOGLE_ADS_ID in ads.js to enable tracking.');
}

// Report a conversion by name (a key of GOOGLE_ADS_CONVERSIONS).
function trackAdsConversion(name, params) {
    const label = GOOGLE_ADS_CONVERSIONS[name];
    if (!adsEnabled || !label) return;
    gtag('event', 'conversion', Object.assign({ send_to: GOOGLE_ADS_ID + '/' + label }, params));
}
