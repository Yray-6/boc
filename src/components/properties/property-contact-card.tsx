import Image from "next/image";

interface PropertyContactCardProps {
  agentImage?: string;
  agentName?: string;
}

/** Contact card — Figma 819:7311 (desktop) + 819:9366 (mobile) */
export function PropertyContactCard({
  agentImage = "/assets/figma/agent-1.png",
  agentName = "BOC Agent - 0027",
}: PropertyContactCardProps) {
  return (
    <>
      {/* ── Mobile: compact horizontal card (Figma 819:9366) ── */}
      <div className="relative flex flex-col gap-[10.75px] rounded-[7.17px] bg-white px-[10.75px] pt-[10.75px] pb-[10.75px] shadow-[0px_0px_2.69px_-1.79px_rgba(0,0,0,0.1),0px_0px_6.72px_-1.34px_rgba(0,0,0,0.1)] lg:hidden">
        {/* Title */}
        <h3 className="text-[12px] font-semibold leading-[1.4] text-[#1a1a1a] [font-family:var(--font-playfair)]">
          Contact Us
        </h3>

        {/* Agent row + icon buttons */}
        <div className="flex items-center justify-between">
          {/* Agent info */}
          <div className="flex items-center gap-[5.37px]">
            <div className="relative h-[28.66px] w-[28.66px] shrink-0 overflow-hidden rounded-full">
              <Image src={agentImage} alt={agentName} fill className="object-cover" />
            </div>
            <span className="text-[11px] font-semibold leading-[1.22] text-[#1a1a1a] [font-family:var(--font-playfair)]">
              {agentName}
            </span>
          </div>

          {/* Action icon buttons */}
          <div className="flex items-center gap-[10px]">
            {/* Send Enquiry — envelope */}
            <button
              aria-label="Send Enquiry"
              className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#2a478d] shadow-sm transition-opacity hover:opacity-90"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 7.75C2 6.784 2.784 6 3.75 6h16.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 20.25 18H3.75A1.75 1.75 0 0 1 2 16.25v-8.5zm1.75-.25a.25.25 0 0 0-.25.25v.852l8.5 5.312 8.5-5.312V7.75a.25.25 0 0 0-.25-.25H3.75zm16.75 2.66-6.96 4.351a1.5 1.5 0 0 1-1.58 0L3.5 10.16V16.25c0 .138.112.25.25.25h16.5a.25.25 0 0 0 .25-.25V10.16z" fill="white" />
              </svg>
            </button>

            {/* WhatsApp Agent */}
            <a
              href="https://wa.me/2348000000000"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Agent"
              className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#00C950] shadow-sm transition-opacity hover:opacity-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24" height="24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── Desktop: full vertical card (Figma 819:7311) ── */}
      <div className="hidden flex-col gap-[21.7px] rounded-[14.5px] bg-white p-[21.7px] pb-0 shadow-[0px_3.62px_5.43px_-3.62px_rgba(0,0,0,0.1),0px_9.04px_13.56px_-2.71px_rgba(0,0,0,0.1)] lg:flex">
        <h3 className="text-[18px] font-semibold leading-[1.4] text-[#1a1a1a] [font-family:var(--font-playfair)]">
          Contact Us
        </h3>

        <div className="flex items-center gap-[10.9px]">
          <div className="relative h-[58px] w-[58px] shrink-0 overflow-hidden rounded-full">
            <Image src={agentImage} alt={agentName} fill className="object-cover" />
          </div>
          <span className="text-[14.5px] font-semibold leading-normal text-[#1a1a1a] [font-family:var(--font-playfair)]">
            {agentName}
          </span>
        </div>

        <div className="flex flex-col gap-[10.9px] pb-[21.7px]">
          <button className="flex h-[43.4px] w-full items-center justify-center gap-2 rounded-[5.4px] bg-[#2a478d] text-[14.5px] font-medium text-white [font-family:var(--font-dm-sans)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M2 7.75C2 6.784 2.784 6 3.75 6h16.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 20.25 18H3.75A1.75 1.75 0 0 1 2 16.25v-8.5zm1.75-.25a.25.25 0 0 0-.25.25v.852l8.5 5.312 8.5-5.312V7.75a.25.25 0 0 0-.25-.25H3.75zm16.75 2.66-6.96 4.351a1.5 1.5 0 0 1-1.58 0L3.5 10.16V16.25c0 .138.112.25.25.25h16.5a.25.25 0 0 0 .25-.25V10.16z" fill="white" />
            </svg>
            Send Enquiry
          </button>
          <a
            href="https://wa.me/2348000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[43.4px] w-full items-center justify-center gap-2 rounded-[5.4px] bg-[#00C950] text-[14.5px] font-medium text-white [font-family:var(--font-dm-sans)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18" height="18">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp Agent
          </a>
        </div>
      </div>
    </>
  );
}
