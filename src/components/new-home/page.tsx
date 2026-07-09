import { BackgroundGrid } from "./background-grid";
import { ShoogleFooter } from "./footer";
import {
  ShoogleLogo,
  ExploreIcon,
  FreshIcon,
  BookmarksIcon,
} from "./icons";

export default function ShoogleHome() {
  return (
    <div className="shoogle">
      <section className="relative w-full h-dvh overflow-hidden bg-secondary">
        <BackgroundGrid />

        <div className="relative h-full">
          <div className="mx-auto flex justify-center h-full max-w-7xl flex-col p-2 sm:p-4 transition-[justify-content] duration-300 ease-out">
            <div className="w-full max-w-[30rem] xs:max-w-[30rem] md:max-w-[33rem] lg:max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-24 px-2 md:px-0">
              <h1 className="sr-only">Your shadcn search engine.</h1>
              <h2 className="sr-only">
                Search shadcn blocks and components across registries
              </h2>

              <div className="flex flex-col gap-4 items-center md:mb-4 transition-[opacity,height,margin-bottom] duration-300 ease-out">
                <div className="relative inline-flex items-center gap-2 max-w-[14rem] xs:max-w-[16rem] sm:max-w-md">
                  <ShoogleLogo className="w-full h-auto" />
                </div>
              </div>

{/* pake logi dari src/components/SearchCenter.vue, hanya ui (tailwind/css) saja yg ambil dri sini  */}
              <div className="transition-[order] duration-300 ease-out">
                <form className="w-full space-y-2">
                  <div className="relative w-full min-w-0">
                    <input
                      type="text"
                      autoComplete="off"
                      spellCheck={false}
                      autoCorrect="off"
                      autoCapitalize="none"
                      placeholder="Search shadcn blocks (e.g. chart, carousel)"
                      className="w-full min-w-0 bg-input text-lg pl-4 focus-visible:ring-0 border-none rounded-full h-14 outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                </form>

                <div className="mt-4 flex flex-wrap justify-center items-center gap-2.5 lg:gap-3.5">
                  <ActionButton
                    href="/search?tab=explore"
                    icon={<ExploreIcon className="size-4 sm:size-3.5" />}
                    label="Explore"
                  />
                  <ActionButton
                    href="/search"
                    icon={<FreshIcon className="size-4 sm:size-3.5" />}
                    label="Fresh"
                  />
                  <ActionButton
                    href="/search?tab=bookmarks"
                    icon={<BookmarksIcon className="size-4 sm:size-3.5" />}
                    label="Bookmarks"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <ShoogleFooter />
      </section>
    </div>
  );
}

function ActionButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a href={href}>
      <button
        type="button"
        className="[&_svg]:-mx-0.5 relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border font-medium text-base outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 sm:text-sm [&_svg:not([class*='opacity-'])]:opacity-80 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 h-8 sm:h-7 border-input bg-popover text-foreground gap-2 active:scale-[0.97] transition-[background-color,transform] ease-out duration-150 px-2.5 sm:px-3 hover:bg-muted-foreground hover:text-background"
        data-slot="button"
      >
        {icon}
        <span>{label}</span>
      </button>
    </a>
  );
}
