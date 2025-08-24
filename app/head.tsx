// app/head.tsx
export default function Head() {
  return (
    <>
      <title>Karni Medical | Smart Pet Health App</title>
      <meta
        name="description"
        content="Track medicines, reminders, and pet health records for your pets in one simple app."
      />
      <meta name="robots" content="index, follow" />


      <meta property="og:title" content="Karni Medical | Smart Pet Health App01" />
      <meta
        property="og:description"
        content="Track medicines, reminders, and pet health records for your pets in one simple app."
      />
      <meta property="og:image" content="/social-preview.png" />
      <meta property="og:type" content="website" />
      <meta name="google-site-verification" content="lFOsGpqJlRsKf0hp_tuINvSfaTnpxFFdKt5pVEKKUbs" />


      <script
        type="application/ld+json"
        
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MobileApplication",
            name: "Karni Medical",
            url: "https://karnimedical.khairaj.tech",
            applicationCategory: "HealthApplication",
            operatingSystem: "Android, Web",
            description:
              "Track medicines, reminders, and pet health records for your pets in one simple app.",
          }),
        }}
      />
    </>
  );
}
