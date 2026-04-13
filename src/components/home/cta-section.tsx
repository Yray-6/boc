export function CtaSection() {
  return (
    <section className="w-full bg-[#2a478d] py-20">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-7 px-8">
        <h2 className="text-center text-[48px] font-medium leading-none text-white [font-family:var(--font-playfair)]">Ready to Find Your Dream Home?</h2>
        <p className="max-w-[672px] text-center text-xl leading-[1.4] text-white/90 [font-family:var(--font-dm-sans)]">
          Connect with our expert agents today and take the first step towards your ideal property.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#"
            className="flex h-14 min-w-[205px] items-center justify-center rounded-md bg-[#1a1a1a] px-8 text-base font-semibold text-[#f5f0e8] [font-family:var(--font-dm-sans)]"
          >
            Browse Properties
          </a>
          <a
            href="#"
            className="flex h-14 min-w-[150px] items-center justify-center rounded-md bg-white px-8 text-base font-semibold text-[#2a478d] [font-family:var(--font-dm-sans)]"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
