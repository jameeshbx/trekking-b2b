import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

export default function ContactSection() {
  return (
    <section className="relative w-full py-8 -mb-28">

    <div className="relative w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
        {/* Background pattern */}
        <div className="absoloute inset-0 -z-10 h-full">
            <Image
            src="/background/bg2.png"
            alt=""
            fill
            className="object-cover mt-52"
            priority
            />
        </div>

      {/* Wavy lines element in the top right corner */}
      <div className="absolute top-[-50px] right-0 w-full max-w-52 pointer-events-none">
        <Image src="/background/dots2.png" alt="" width={200} height={200} className="object-contain" />
      </div>

      {/* Main green card */}
    <div className="relative mx-auto max-w-7xl rounded-2xl bg-[#1a4738] overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/background/bg3.png" alt="" layout="fill" objectFit="cover" className="opacity-50" />
      </div>
        <div className="container mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="mb-8 md:mb-0 md:max-w-md">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-white mb-4 font-nunito leading-10">
              Ready to supercharge your agency?
            </h2>
            <p className="text-white/90 text-lg font-poppins">Let&apos;s create, edit & share travel plans in minutes.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#"
              className="bg-white text-custom-green px-6 py-10 rounded-lg font-medium flex items-center justify-between min-w-52 hover:bg-white/90 transition-colors"
            >
              <span className="-mb-11 font-bold">Try for free</span>
              <ArrowUpRight className="h-5 w-5 -mb-11" />
            </Link>
            <Link
              href="#"
              className="border border-orange text-orange px-6 py-10 rounded-lg font-medium flex items-center justify-between min-w-52 hover:bg-orange/10 transition-colors"
            >
              <span className="-mb-11 font-bold">Contact Us</span>
              <ArrowUpRight className="h-5 w-5 -mb-11" />
            </Link>
          </div>
        </div>
      </div>
    </div>
    </section>
  )
}

