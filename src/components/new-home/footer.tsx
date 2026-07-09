import { XIcon, DiscordIcon } from "./icons";

export function ShoogleFooter() {
  return (
    <footer className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-center justify-between gap-x-1 gap-y-2 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] md:h-10 md:py-0 md:px-10">
      <nav className="flex flex-wrap items-center justify-center gap-1">
        <a
          href="/shoggle/terms-of-service"
          className="relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-transparent font-medium outline-none hover:underline underline-offset-4 h-auto px-2 py-1 text-xs text-muted-foreground"
        >
          Terms of Service
        </a>
        <a
          href="/shoggle/privacy-policy"
          className="relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-transparent font-medium outline-none hover:underline underline-offset-4 h-auto px-2 py-1 text-xs text-muted-foreground"
        >
          Privacy Policy
        </a>
      </nav>
      <div className="flex items-center gap-0.5">
        <a
          href="https://x.com/alibey_10"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow on X (Twitter)"
          className="relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-transparent font-medium outline-none hover:bg-accent h-auto px-2 py-1 text-muted-foreground"
        >
          <XIcon className="size-3.5" />
        </a>
        <a
          href="/shadcord"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Join Shadcord on Discord"
          className="relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-transparent font-medium outline-none hover:bg-accent h-auto px-2 py-1 text-muted-foreground"
        >
          <DiscordIcon className="size-3.5" />
        </a>
      </div>
    </footer>
  );
}
