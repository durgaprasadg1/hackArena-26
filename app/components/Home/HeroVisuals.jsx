import BadgePill from "./badge-pill"

export default function HeroVisual() {

  return (
    <div className="relative w-full flex items-center justify-center mt-10 md:mt-0">

      {/* Main Circle */}
      <div className="relative w-[260px] h-[260px] md:w-[360px] md:h-[360px] rounded-full overflow-hidden shadow-xl">

        {/* <img
          src="/food-bowl.jpg"
          className="object-cover w-full h-full"
        /> */}

        <div className="absolute top-5 right-2">
          <BadgePill label="Keto" />
        </div>

        <div className="absolute bottom-5 left-2">
          <BadgePill label="Hydration" />
        </div>

      </div>

      {/* Floating images */}

      <img
        src="/food1.jpeg"
        className="absolute -bottom-10 left-5 w-20 h-20 rounded-full shadow-lg"
      />

      {/* <img
        src="/snack.jpg"
        className="absolute top-10 -right-5 w-16 h-16 rounded-full shadow-lg"
      /> */}

    </div>
  )
}