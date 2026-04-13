import Image from "next/image";

interface PropertyContactCardProps {
  agentImage?: string;
  agentName?: string;
}

/** Contact card — Figma node 819:7311 */
export function PropertyContactCard({
  agentImage = "/assets/figma/agent-1.png",
  agentName = "BOC Agent - 0027",
}: PropertyContactCardProps) {
  return (
    <div className="flex flex-col gap-[21.7px] rounded-[14.5px] bg-white p-[21.7px] pb-0 shadow-[0px_3.62px_5.43px_-3.62px_rgba(0,0,0,0.1),0px_9.04px_13.56px_-2.71px_rgba(0,0,0,0.1)]">
      {/* Heading */}
      <h3 className="text-[18px] font-semibold leading-[1.4] text-[#1a1a1a] [font-family:var(--font-playfair)]">
        Contact Us
      </h3>

      {/* Agent info */}
      <div className="flex items-center gap-[10.9px]">
        <div className="relative h-[58px] w-[58px] shrink-0 overflow-hidden rounded-full">
          <Image src={agentImage} alt={agentName} fill className="object-cover" />
        </div>
        <span className="text-[14.5px] font-semibold leading-[1.5] text-[#1a1a1a] [font-family:var(--font-playfair)]">
          {agentName}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-[10.9px] pb-[21.7px]">
        <button className="flex h-[43.4px] w-full items-center justify-center rounded-[5.4px] bg-[#2a478d] text-[14.5px] font-medium text-white [font-family:var(--font-dm-sans)]">
          Send Enquiry
        </button>
        <button className="flex h-[43.4px] w-full items-center justify-center gap-2 rounded-[5.4px] bg-[#00C950] text-[14.5px] font-medium text-white [font-family:var(--font-dm-sans)]">
          <Image src="/assets/figma/icon-whatsapp.svg" alt="" width={18} height={18} />
          WhatsApp Agent
        </button>
      </div>
    </div>
  );
}
