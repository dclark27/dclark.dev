export default function Footer() {
  return (
    <footer className="prose mb-16">
      <a
        rel="noopener noreferrer"
        target="_blank"
        href="https://github.com/dclark27/dclark.dev"
      >
        <p>view source</p>
      </a>
      <p className="prose-sm">© {new Date().getFullYear()} MIT Licensed</p>
    </footer>
  )
}
