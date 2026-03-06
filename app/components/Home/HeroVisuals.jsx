import Image from "next/image";
import BadgePill from "./badge-pill";

export default function HeroVisual() {
  return (
    <div className="relative w-full flex items-center justify-center mt-10 md:mt-0">
      {/* Orbit Ring */}
      <div className="absolute w-[340px] h-[340px] md:w-[460px] md:h-[460px] rounded-full border-2 border-dashed border-green-200/40 animate-spin-slow" />

      {/* Main Circle */}
      <div className="relative w-[260px] h-[260px] md:w-[360px] md:h-[360px] rounded-full overflow-hidden shadow-xl z-10">
        <Image
          src="/food2.png"
          alt="Nutritious vegetables"
          width={350}
          height={350}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-5 right-2">
          <BadgePill label="Keto" />
        </div>
        <div className="absolute bottom-5 left-2">
          <BadgePill label="Hydration" />
        </div>
      </div>

      {/* Orbiting images container */}
      <div className="absolute w-[340px] h-[340px] md:w-[460px] md:h-[460px] animate-spin-slow">
        {/* Image 1 - positioned at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-reverse">
            <Image
              src="/food1.png"
              alt="Nutritious vegetables plate"
              width={120}
              height={120}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full shadow-lg border-4 border-white"
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <div className="animate-spin-reverse">
            <Image
              src="/food3.png"
              alt="Nutritious vegetables plate"
              width={120}
              height={120}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full shadow-lg border-4 border-white object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
