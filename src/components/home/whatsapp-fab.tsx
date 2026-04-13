import Image from "next/image";

export function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] shadow-lg"
    >
      <Image src="/assets/figma/icon-whatsapp.svg" alt="WhatsApp" width={28} height={28} />
    </a>
  );
}
