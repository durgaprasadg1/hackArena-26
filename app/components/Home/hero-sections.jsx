import { Button } from "@/components/ui/button"
import HeroVisual from "./HeroVisuals"

export default function HeroSection() {

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">

      {/* LEFT CONTENT */}
      <div className="space-y-6">

       
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          NutriSync <span className="text-green-700 italic">AI</span>
        </h1>

        <p className="text-gray-600 text-base md:text-lg max-w-lg">
          If you are tired of breakdowns and strict diets, meet different
          variations of proper nutrition. Our AI will help you achieve your
          goals by correcting nutrition selection and understanding your
          nutrition psychology.
        </p>

        {/* Buttons */}

        <div className="flex gap-4 flex-wrap">

          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white rounded-full"
          >
            Start Your Journey →
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full"
          >
            Details
          </Button>

        </div>

        {/* Users */}

        <div className="flex items-center gap-3 text-sm text-gray-500 pt-4">

          {/* <div className="flex -space-x-2">
            <img className="w-7 h-7 rounded-full border" src="/user1.jpg" />
            <img className="w-7 h-7 rounded-full border" src="/user2.jpg" />
            <img className="w-7 h-7 rounded-full border" src="/user3.jpg" />
          </div> */}


        </div>

      </div>

      {}

      <HeroVisual/>

    </section>
  )
}