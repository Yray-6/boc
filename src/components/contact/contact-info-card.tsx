/** Contact Information card — Figma node 819:8013 */
export function ContactInfoCard() {
  const items = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#2A478D" />
          <circle cx="12" cy="9" r="2.5" fill="white" />
        </svg>
      ),
      label: "Office Address",
      content: "Plot 15, Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="#2A478D" />
        </svg>
      ),
      label: "Phone",
      content: "+2348012345678",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#2A478D" />
        </svg>
      ),
      label: "Email",
      content: "info@estateluxe.com",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#2A478D" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L0 24l6.323-1.517A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.68-.503-5.22-1.38l-.38-.22-3.75.9.93-3.64-.24-.38A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="#2A478D" />
        </svg>
      ),
      label: "WhatsApp",
      content: "+2348012345678",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#2A478D" strokeWidth="2" />
          <path d="M12 6v6l4 2" stroke="#2A478D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      label: "Business Hours",
      content: (
        <span className="flex flex-col gap-0.5">
          <span>Monday - Friday: 9:00 AM - 6:00 PM</span>
          <span>Saturday: 10:00 AM - 4:00 PM</span>
          <span>Sunday: Closed</span>
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col rounded-[16px] bg-white px-8 pt-8 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]">
      <h2 className="text-2xl font-semibold leading-[1.33] text-[#1a1a1a] [font-family:var(--font-playfair)]">
        Contact Information
      </h2>

      <div className="mt-[24px] flex flex-col gap-[24px]">
        {items.map(({ icon, label, content }) => (
          <div key={label} className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[rgba(42,71,141,0.1)]">
              {icon}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[18px] font-semibold leading-[1.5] text-[#1a1a1a] [font-family:var(--font-playfair)]">
                {label}
              </span>
              <span className="text-[16px] leading-[1.5] text-[#6b6b6b] [font-family:var(--font-dm-sans)]">
                {content}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp CTA */}
      <div className="mt-8 border-t border-[rgba(26,26,26,0.1)] pt-8 pb-8">
        <a
          href="https://wa.me/2348012345678"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-full items-center justify-center gap-3 rounded-[6px] bg-[#00C950] text-base font-semibold text-white hover:bg-[#00b347] transition-colors [font-family:var(--font-dm-sans)]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="white" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L0 24l6.323-1.517A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.68-.503-5.22-1.38l-.38-.22-3.75.9.93-3.64-.24-.38A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="white" />
          </svg>
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
