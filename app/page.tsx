import Image from "next/image"

import { Button } from "@/components/ui/button"

const apps = [
  {
    name: "chex",
    href: "https://chex-one.vercel.app/login",
  },
  {
    name: "karaoke",
    href: "https://fall-festival-karaoke.vercel.app/",
  },
]

const socials = [
  {
    name: "twitter",
    href: "https://x.com/devin_clark",
  },
  {
    name: "bsky",
    href: "https://bsky.app/profile/dclark.dev",
  },
  {
    name: "instagram",
    href: "https://www.instagram.com/devin_clarkk/",
  },
  {
    name: "threads",
    href: "https://www.threads.net/@devin_clarkk",
  },
  {
    name: "github",
    href: "https://github.com/dclark27",
  },
]

export default function Page() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-full max-w-md p-8 mx-4 space-y-8 bg-white/10 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-xl pointer-events-auto">
        <section className="space-y-4 text-white">
          <Image
            src={"/logos/icon-dark.png"}
            alt="logo"
            width={100}
            height={100}
          />
          <h1 className="text-2xl font-semibold tracking-tighter">
            {"dclark.dev"}
          </h1>
          <p>{"I'm Devin Clark. Web developer and tech enthusiast."}</p>
        </section>

        <div className="space-y-4">
          <section className="space-y-2">
            <h2 className="font-semibold text-white">{"Apps"}</h2>
            <div className="flex flex-wrap gap-2">
              {apps.map((app) => (
                <Button key={app.name} variant="outline" asChild>
                  <a href={app.href} target="_blank">
                    {app.name}
                  </a>
                </Button>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-white">{"Socials"}</h2>
            <div className="flex flex-wrap gap-2">
              {socials.map((social) => (
                <Button key={social.name} variant="outline" asChild>
                  <a href={social.href} target="_blank">
                    {social.name}
                  </a>
                </Button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
