export function BackgroundGrid() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 md:px-10 md:py-10">
        <div
          className="h-full w-full bg-background"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 2px, var(--secondary) 2px, var(--secondary) 4px)',
          }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 hidden md:flex justify-between px-4 md:px-10">
        <div className="h-full w-px bg-border" />
        <div className="h-full w-px bg-border" />
      </div>
      <div className="pointer-events-none absolute inset-0 hidden md:flex flex-col justify-between py-4 md:py-10">
        <div className="h-px w-full bg-border" />
        <div className="h-px w-full bg-border" />
      </div>
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute left-4 top-10 md:left-10 md:top-10 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-background" />
        <div className="absolute right-4 top-10 md:right-10 md:top-10 size-2 translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-background" />
        <div className="absolute left-4 bottom-10 md:left-10 md:bottom-10 size-2 -translate-x-1/2 translate-y-1/2 rounded-full border border-border bg-background" />
        <div className="absolute right-4 bottom-10 md:right-10 md:bottom-10 size-2 translate-x-1/2 translate-y-1/2 rounded-full border border-border bg-background" />
      </div>
    </>
  )
}
