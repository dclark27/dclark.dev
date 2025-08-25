import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  // MicVocalIcon,
  TwitterIcon,
  // UtensilsIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"

// const apps = [
//   {
//     name: "chex",
//     href: "https://chex-one.vercel.app/login",
//     icon: <UtensilsIcon />,
//   },
//   {
//     name: "karaoke",
//     href: "https://fall-festival-karaoke.vercel.app/",
//     icon: <MicVocalIcon />,
//   },
// ]

const socials = [
  {
    name: "twitter",
    href: "https://x.com/devin_clark",
    icon: <TwitterIcon />,
  },
  // {
  //   name: "bsky",
  //   href: "https://bsky.app/profile/dclark.dev",
  // },
  {
    name: "instagram",
    href: "https://www.instagram.com/devin_clarkk/",
    icon: <InstagramIcon />,
  },
  {
    name: "github",
    href: "https://github.com/dclark27",
    icon: <GithubIcon />,
  },
  {
    name: "linkedin",
    href: "https://www.linkedin.com/in/devinclark27",
    icon: <LinkedinIcon />,
  },
]

export default function Page() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-full max-w-md p-8 mx-4 space-y-8 bg-white/10 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-xl pointer-events-auto">
        <section className="space-y-4 text-white">
          <span
            className="size-24 flex bg-cover bg-center bg-[url(/logos/logo-dark.png)]"
            aria-label="logo"
          ></span>
          <h1 className="text-4xl font-extrabold italic tracking-tighter">
            {"dclark.dev"}
          </h1>
          <p className="text-sm font-extralight">
            {"I'm Devin Clark. Web developer and tech enthusiast."}
          </p>
        </section>

        <div className="space-y-4">
          <section className="space-y-2">
            <h2 className="font-semibold text-white">{"Socials"}</h2>
            <div className="flex flex-wrap gap-2">
              {socials.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  className="text-white"
                  size={"icon"}
                  asChild
                >
                  <a
                    href={social.href}
                    target="_blank"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                </Button>
              ))}
            </div>
          </section>
          {/* <section className="space-y-2">
            <h2 className="font-semibold text-white">{"Apps"}</h2>
            <div className="flex flex-wrap gap-2">
              {apps.map((app) => (
                <Button key={app.name} variant="outline" asChild>
                  <a href={app.href} target="_blank">
                    {app.name}
                    {app.icon}
                  </a>
                </Button>
              ))}
            </div>
          </section> */}
        </div>
      </div>
    </div>
  )
}
