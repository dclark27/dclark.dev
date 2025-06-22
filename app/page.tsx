export default function Page() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none pointer-cursor">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
        <section className="text-white">
          <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
            {"dclark.dev"}
          </h1>
          <p className="mb-4">
            {"I'm Devin Clark. Web developer and tech enthusiast."}
          </p>
          <span>{"apps"}</span>
          <ul>
            <li>
              <a target="_blank" href="https://chex-one.vercel.app/login">
                {"chex"}
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://fall-festival-karaoke.vercel.app/"
              >
                {"karaoke"}
              </a>
            </li>
          </ul>
          <span>{"socials"}</span>
          <ul>
            <li>
              <a target="_blank" href="https://x.com/devin_clark">
                {"twitter"}
              </a>
            </li>
            <li>
              <a target="_blank" href="https://bsky.app/profile/dclark.dev">
                {"bsky"}
              </a>
            </li>
            <li>
              <a target="_blank" href="https://www.instagram.com/devin_clarkk/">
                {"instagram"}
              </a>
            </li>
            <li>
              <a target="_blank" href="https://www.threads.net/@devin_clarkk">
                {"threads"}
              </a>
            </li>
            <li>
              <a target="_blank" href="https://github.com/dclark27">
                {"github"}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
