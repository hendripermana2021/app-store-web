"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { websiteCategories, websites } from "@/lib/websites";
import BrandLogo from "@/components/BrandLogo";
import { youtubeChannels } from "@/lib/youtubeChannels";

function getDomainFromUrl(rawUrl: string) {
  try {
    return new URL(rawUrl).hostname;
  } catch {
    return rawUrl;
  }
}

const featuredCollections = [
  {
    title: "Best for Productivity",
    subtitle: "Tools untuk fokus, manajemen tugas, dan kerja cepat.",
    accent: "from-cyan-400/30 via-sky-400/20 to-transparent",
  },
  {
    title: "Creator Essentials",
    subtitle: "Website untuk desain, aset visual, dan konten cepat.",
    accent: "from-fuchsia-400/30 via-rose-400/20 to-transparent",
  },
  {
    title: "Study Stack",
    subtitle: "Belajar, catatan, coding, dan referensi yang berguna.",
    accent: "from-emerald-400/30 via-teal-400/20 to-transparent",
  },
  {
    title: "Work Smarter",
    subtitle: "Kolaborasi, utility, dan workflow harian yang rapi.",
    accent: "from-amber-300/25 via-orange-300/15 to-transparent",
  },
];

const appTabs = ["Today", "Categories", "Top Charts"] as const;

const categoryPriority = [
  "Productivity",
  "Education",
  "Developer",
  "Design",
  "AI",
  "Career",
  "Utilities",
  "Security",
  "Business",
  "Health",
];

function isNoSubscriptionWebsite(freeNote: string) {
  const normalized = freeNote.toLowerCase();
  return (
    normalized.includes("tanpa langganan") ||
    normalized.includes("gratis penuh") ||
    normalized === "gratis"
  );
}

function parseSubscriberCount(value: string) {
  const normalized = value.replace(/\s+/g, "").toUpperCase();
  const num = Number.parseFloat(normalized);

  if (Number.isNaN(num)) {
    return 0;
  }

  if (normalized.includes("M")) {
    return num * 1_000_000;
  }

  if (normalized.includes("K")) {
    return num * 1_000;
  }

  return num;
}

function getChannelInitials(name: string) {
  const words = name
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(" ")
    .filter(Boolean);

  if (words.length === 0) {
    return "YT";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function getChannelAccent(name: string) {
  const gradients = [
    "from-rose-400/80 to-red-500/85",
    "from-fuchsia-400/80 to-pink-500/85",
    "from-orange-400/80 to-amber-500/85",
    "from-cyan-400/80 to-sky-500/85",
    "from-emerald-400/80 to-teal-500/85",
  ];
  const score = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return gradients[score % gradients.length];
}


export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<(typeof appTabs)[number]>("Today");
  const [onlyNoSubscription, setOnlyNoSubscription] = useState(false);

  const filteredWebsites = useMemo(() => {
    const lowerSearch = searchText.trim().toLowerCase();

    return websites.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        lowerSearch.length === 0 ||
        item.name.toLowerCase().includes(lowerSearch) ||
        item.description.toLowerCase().includes(lowerSearch) ||
        item.suitableFor.toLowerCase().includes(lowerSearch);
      const matchesNoSubscription =
        !onlyNoSubscription || isNoSubscriptionWebsite(item.freeNote);

      return matchesCategory && matchesSearch && matchesNoSubscription;
    });
  }, [activeCategory, onlyNoSubscription, searchText]);

  const filteredChannels = useMemo(() => {
    const lowerSearch = searchText.trim().toLowerCase();

    return youtubeChannels.filter((channel) => {
      const matchesCategory =
        activeCategory === "All" || channel.category === activeCategory;
      const matchesSearch =
        lowerSearch.length === 0 ||
        channel.name.toLowerCase().includes(lowerSearch) ||
        channel.description.toLowerCase().includes(lowerSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchText]);

  const fallbackChannels = useMemo(() => {
    return [...youtubeChannels]
      .sort(
        (a, b) => parseSubscriberCount(b.subscribers) - parseSubscriberCount(a.subscribers)
      )
      .slice(0, 12);
  }, []);

  const displayChannels =
    filteredChannels.length > 0 ? filteredChannels : fallbackChannels;

  const groupedWebsites = useMemo(() => {
    const groups = new Map<string, typeof websites>();

    for (const website of filteredWebsites) {
      if (!groups.has(website.category)) {
        groups.set(website.category, []);
      }

      groups.get(website.category)?.push(website);
    }

    return Array.from(groups.entries());
  }, [filteredWebsites]);

  const featuredSites = filteredWebsites.slice(0, 3);

  const topCharts = useMemo(() => {
    const categoryOrder = new Map(categoryPriority.map((category, index) => [category, index]));

    return [...filteredWebsites].sort((a, b) => {
      const aCategoryIndex = categoryOrder.get(a.category) ?? 999;
      const bCategoryIndex = categoryOrder.get(b.category) ?? 999;

      if (aCategoryIndex !== bCategoryIndex) {
        return aCategoryIndex - bCategoryIndex;
      }

      return a.name.localeCompare(b.name);
    });
  }, [filteredWebsites]);

  const topYouTubeCharts = useMemo(() => {
    return [...displayChannels].sort(
      (a, b) => parseSubscriberCount(b.subscribers) - parseSubscriberCount(a.subscribers)
    );
  }, [displayChannels]);

  const totalResults = filteredWebsites.length + displayChannels.length;

  const tabButtonClass = (tab: (typeof appTabs)[number]) =>
    `rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition ${
      activeTab === tab
        ? "bg-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]"
        : "text-slate-200/80 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_18%_12%,_#0e4a6d_0%,_#052234_32%,_#04101d_58%,_#02070d_100%)] text-slate-100">
      <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute top-12 right-20 h-56 w-56 rounded-full bg-sky-200/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="animate-rise sticky top-4 z-20 mb-8">
          <div className="glass-dock rounded-3xl p-3 sm:p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center justify-between gap-3">
                <BrandLogo textMode="desktop" />
                <div className="metal-pill rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-cyan-100 sm:hidden">
                  {totalResults} RESULTS
                </div>
              </div>

              <div className="flex w-full gap-3 lg:max-w-xl">
                <input
                  type="text"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Cari website, deskripsi, atau use case..."
                  className="h-11 flex-1 rounded-2xl border border-white/15 bg-slate-900/70 px-4 text-sm text-white placeholder:text-slate-400 outline-none ring-cyan-400/70 transition focus:ring"
                />
                <div className="metal-pill hidden items-center rounded-2xl px-4 text-sm font-bold text-cyan-50 sm:flex">
                  {totalResults} Results
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {websiteCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide transition ${
                    activeCategory === category
                      ? "border-cyan-100/80 bg-cyan-200/25 text-cyan-100"
                      : "border-cyan-200/25 bg-slate-900/55 text-cyan-100 hover:border-cyan-200/55 hover:bg-cyan-300/15"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
              {appTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={tabButtonClass(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between rounded-2xl border border-emerald-200/20 bg-emerald-300/10 px-3 py-2">
              <p className="text-xs font-semibold tracking-[0.14em] text-emerald-100">
                TANPA LANGGANAN
              </p>
              <button
                type="button"
                onClick={() => setOnlyNoSubscription((prev) => !prev)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  onlyNoSubscription
                    ? "border-emerald-200/70 bg-emerald-200/25 text-emerald-50"
                    : "border-emerald-200/30 bg-slate-900/40 text-emerald-100 hover:border-emerald-200/55"
                }`}
              >
                {onlyNoSubscription ? "Active" : "Off"}
              </button>
            </div>
          </div>
        </header>

        <section
          key={activeTab}
          className="mb-8 grid animate-rise gap-4 lg:grid-cols-[1.6fr_1fr]"
        >
          <article className="glass-shell overflow-hidden rounded-3xl p-6 sm:p-8">
            <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-cyan-200">
              {activeTab.toUpperCase()}
            </p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {activeTab === "Today"
                ? "Experience direktori website gratis dengan nuansa premium"
                : activeTab === "Categories"
                  ? "Jelajahi website gratis berdasarkan kategori favoritmu"
                  : "Website paling populer yang cocok untuk langsung dibuka"}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
              {activeTab === "Today"
                ? "Semua koleksi disusun seperti katalog App Store: visual bersih, kategori cepat, dan detail singkat untuk langsung dipakai."
                : activeTab === "Categories"
                  ? "Gunakan tab kategori untuk memfilter, lalu pilih website yang paling cocok untuk kebutuhanmu."
                  : "Daftar ini menampilkan pilihan teratas dari hasil yang sedang kamu filter sekarang."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="metal-pill rounded-full px-3 py-1 text-xs font-semibold text-cyan-100">
                100+ Website Gratis
              </span>
              <span className="metal-pill rounded-full px-3 py-1 text-xs font-semibold text-cyan-100">
                Multi Category
              </span>
              <span className="metal-pill rounded-full px-3 py-1 text-xs font-semibold text-cyan-100">
                App Store Style
              </span>
            </div>
          </article>

          <article className="glass-shell rounded-3xl p-5">
            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-emerald-200">
              SPOTLIGHT
            </p>
            <div className="space-y-3">
              {featuredSites.map((site) => (
                <a
                  key={site.url}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:border-cyan-200/50 hover:bg-cyan-200/10"
                >
                  <p className="text-sm font-semibold text-white">{site.name}</p>
                  <p className="mt-1 text-xs text-slate-300">{site.description}</p>
                </a>
              ))}
            </div>
          </article>
        </section>

        {activeTab !== "Top Charts" && (
          <section className="animate-rise mb-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-cyan-200">
                  FEATURED COLLECTIONS
                </p>
                <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  Discover collections like App Store editorial picks
                </h3>
              </div>
              <p className="hidden text-sm text-slate-300 sm:block">
                Geser horizontal untuk melihat kurasi lainnya.
              </p>
            </div>

            <div className="carousel-snap flex gap-4 overflow-x-auto pb-3 pr-2">
              {featuredCollections.map((collection) => (
                <article
                  key={collection.title}
                  className={`glass-shell carousel-card min-w-[280px] flex-1 rounded-3xl p-5 sm:min-w-[320px] ${collection.accent}`}
                >
                  <div className="flex h-full flex-col justify-between gap-6">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] text-cyan-100/80">
                        CURATED
                      </p>
                      <h4 className="mt-3 text-xl font-bold text-white">{collection.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{collection.subtitle}</p>
                    </div>

                    <button className="glass-button inline-flex w-fit items-center rounded-full px-4 py-2 text-xs font-semibold text-white">
                      Explore collection
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "Top Charts" && (
          <section className="animate-rise mb-8 grid gap-4 lg:grid-cols-2">
            <article className="glass-shell rounded-3xl p-6 sm:p-8">
              <p className="text-xs font-semibold tracking-[0.2em] text-emerald-200">
                TOP CHARTS
              </p>
              <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                Ranked from your current filter
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Urutan ini disusun berdasarkan kategori prioritas, lalu nama website.
                Cocok untuk browsing cepat seperti chart di App Store.
              </p>
            </article>

            <article className="glass-shell rounded-3xl p-5">
              <div className="space-y-3">
                {topCharts.slice(0, 5).map((site, index) => (
                  <a
                    key={site.url}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:border-cyan-200/50 hover:bg-cyan-200/10"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{site.name}</p>
                      <p className="truncate text-xs text-slate-300">{site.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </article>
          </section>
        )}

        <section className="animate-rise mb-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-rose-200">YOUTUBE CHANNELS</p>
              <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Channel YouTube berdasarkan kategori website
              </h3>
            </div>
            <p className="metal-pill hidden rounded-full px-3 py-1 text-xs font-semibold text-rose-100 sm:block">
              {displayChannels.length} Channels
            </p>
          </div>

          {filteredChannels.length === 0 && (
            <article className="mb-4 rounded-2xl border border-amber-200/25 bg-amber-200/10 px-3 py-2 text-xs text-amber-100">
              Filter terlalu ketat, menampilkan rekomendasi channel populer.
            </article>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {(activeTab === "Top Charts" ? topYouTubeCharts.slice(0, 12) : displayChannels).map(
              (channel, index) => (
                <article key={channel.url} className="app-card glass-shell rounded-3xl p-5">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white ${getChannelAccent(channel.name)}`}
                        aria-label={`${channel.name} avatar`}
                      >
                        {getChannelInitials(channel.name)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate text-lg font-bold text-white">
                          {activeTab === "Top Charts" ? `#${index + 1} ${channel.name}` : channel.name}
                        </h4>
                        <p className="text-xs text-rose-200">{channel.category}</p>
                      </div>
                    </div>
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-rose-300/40 px-2.5 py-1 text-xs font-semibold text-rose-100 transition hover:bg-rose-300/20"
                    >
                      Watch
                    </a>
                  </div>

                  <p className="mb-3 min-h-12 text-sm text-slate-300">{channel.description}</p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-rose-200/35 bg-rose-300/10 px-2 py-1 font-semibold text-rose-100">
                      {channel.subscribers} subscribers
                    </span>
                    <span className="rounded-full border border-white/20 bg-white/8 px-2 py-1 text-slate-200">
                      {channel.language}
                    </span>
                  </div>
                </article>
              )
            )}
          </div>
        </section>

        {groupedWebsites.length === 0 ? (
          <section className="glass-shell animate-rise rounded-3xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white">Tidak ada hasil ditemukan</h2>
            <p className="mt-2 text-sm text-slate-300">
              Coba ganti keyword pencarian atau pilih kategori lain.
            </p>
          </section>
        ) : (
          <section className="space-y-8">
            {groupedWebsites.map(([categoryName, categoryWebsites], groupIndex) => (
              <div key={categoryName} className="animate-rise" style={{ animationDelay: `${groupIndex * 120}ms` }}>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <h2 className="text-2xl font-bold text-white sm:text-3xl">{categoryName}</h2>
                  <p className="text-xs font-semibold tracking-[0.15em] text-cyan-200">
                    {categoryWebsites.length} WEBSITE
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {categoryWebsites.map((site) => (
                    <article
                      key={site.url}
                      className="app-card glass-shell rounded-3xl p-5"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400/70 to-emerald-400/60 text-sm font-bold text-slate-950">
                          <span>{site.name.slice(0, 1).toUpperCase()}</span>
                          <Image
                            src={`https://www.google.com/s2/favicons?domain=${getDomainFromUrl(site.url)}&sz=64`}
                            alt={`${site.name} logo`}
                            className="absolute inset-0 h-full w-full object-cover"
                            width={44}
                            height={44}
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{site.name}</h3>
                          <p className="text-xs text-cyan-200">{site.category}</p>
                        </div>
                      </div>

                      <div className="mb-3 flex items-start justify-between gap-2">
                        <p className="text-xs text-slate-400">{getDomainFromUrl(site.url)}</p>
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-cyan-300/40 px-2.5 py-1 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
                        >
                          Visit
                        </a>
                      </div>

                      <p className="mb-4 min-h-12 text-sm text-slate-300">{site.description}</p>

                      <div className="space-y-2 text-xs text-slate-300">
                        <p>
                          <span className="text-slate-100">Free Plan:</span> {site.freeNote}
                        </p>
                        {isNoSubscriptionWebsite(site.freeNote) && (
                          <p className="inline-flex rounded-full border border-emerald-200/35 bg-emerald-300/10 px-2 py-1 text-[11px] font-semibold tracking-wide text-emerald-100">
                            No Subscription
                          </p>
                        )}
                        <p>
                          <span className="text-slate-100">Cocok untuk:</span> {site.suitableFor}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
