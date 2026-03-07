export type TicketLink = {
  label: string;
  href: string;
  type: "official" | "resale" | "fanclub";
};

export type EventStatusValue = "on_sale" | "announced" | "sold_out";

export type EventItem = {
  id: string;
  artist: string;
  slug: string;
  city: string;
  country: string;
  venue: string;
  startDate: string;
  status: EventStatusValue;
  source: string;
  tags: string[];
  ticketLinks: TicketLink[];
};

export type ArtistProfile = {
  slug: string;
  name: string;
  nameKo?: string;
  fandom?: string;
  tagline: string;
  intro: string;
  accent: string;
  officialUrl?: string;
};

export const artists: ArtistProfile[] = [
  {
    slug: "seventeen",
    name: "SEVENTEEN",
    nameKo: "세븐틴",
    fandom: "CARAT",
    tagline: "Self-producing performance powerhouse",
    intro: "适合做中文巡演聚合入口的典型团体，官方公告和票务节奏都较为明确。",
    accent: "#d36e57",
    officialUrl: "https://www.weverse.io/seventeen"
  },
  {
    slug: "blackpink",
    name: "BLACKPINK",
    nameKo: "블랙핑크",
    fandom: "BLINK",
    tagline: "Global stadium-scale K-pop headliner",
    intro: "国际巡演声量极大，适合验证多地区、多票务入口和高需求活动的展示方式。",
    accent: "#2a1c1f",
    officialUrl: "https://www.weverse.io/blackpink"
  },
  {
    slug: "aespa",
    name: "aespa",
    nameKo: "에스파",
    fandom: "MY",
    tagline: "High-concept live production with global reach",
    intro: "适合作为日本、北美和亚洲巡演站点的跨区域内容样本。",
    accent: "#5377a4",
    officialUrl: "https://www.weverse.io/aespa"
  },
  {
    slug: "stray-kids",
    name: "Stray Kids",
    nameKo: "스트레이 키즈",
    fandom: "STAY",
    tagline: "Arena and stadium routing with frequent updates",
    intro: "适合展示同一艺人多城市排期、官宣分批释放和高密度日程。",
    accent: "#6a4a34"
  },
  {
    slug: "le-sserafim",
    name: "LE SSERAFIM",
    nameKo: "르세라핌",
    fandom: "FEARNOT",
    tagline: "Fast-rising global girl group with fashion-led identity",
    intro: "适合承载演唱会信息之外的应援、穿搭和观演攻略内容。",
    accent: "#49614d"
  },
  {
    slug: "nct-dream",
    name: "NCT DREAM",
    nameKo: "엔시티 드림",
    fandom: "NCTzen",
    tagline: "Large fandom, frequent touring, strong city demand",
    intro: "适合验证城市榜单、提醒订阅和粉丝城市聚集页等未来模块。",
    accent: "#809447"
  }
];

export const featuredArtists = artists.map((artist) => artist.name);

export const events: EventItem[] = [
  {
    id: "svt-seoul-2026",
    artist: "SEVENTEEN",
    slug: "svt-seoul-2026",
    city: "Seoul",
    country: "South Korea",
    venue: "KSPO Dome",
    startDate: "2026-04-18T19:00:00+09:00",
    status: "on_sale",
    source: "Official artist notice",
    tags: ["World Tour", "Korea", "VIP"],
    ticketLinks: [
      {
        label: "Official Ticket",
        href: "https://example.com/tickets/seventeen-seoul",
        type: "official"
      },
      {
        label: "Fanclub Presale",
        href: "https://example.com/fanclub/seventeen-seoul",
        type: "fanclub"
      }
    ]
  },
  {
    id: "svt-singapore-2026",
    artist: "SEVENTEEN",
    slug: "svt-singapore-2026",
    city: "Singapore",
    country: "Singapore",
    venue: "Singapore Indoor Stadium",
    startDate: "2026-06-13T19:30:00+08:00",
    status: "announced",
    source: "Promoter release",
    tags: ["Asia", "Arena", "Travel"],
    ticketLinks: [
      {
        label: "Promoter Sale",
        href: "https://example.com/tickets/seventeen-singapore",
        type: "official"
      }
    ]
  },
  {
    id: "bp-la-2026",
    artist: "BLACKPINK",
    slug: "bp-la-2026",
    city: "Los Angeles",
    country: "United States",
    venue: "BMO Stadium",
    startDate: "2026-05-09T20:00:00-07:00",
    status: "announced",
    source: "Promoter release",
    tags: ["North America", "Stadium", "Presale soon"],
    ticketLinks: [
      {
        label: "Promoter",
        href: "https://example.com/tickets/blackpink-la",
        type: "official"
      }
    ]
  },
  {
    id: "bp-paris-2026",
    artist: "BLACKPINK",
    slug: "bp-paris-2026",
    city: "Paris",
    country: "France",
    venue: "Accor Arena",
    startDate: "2026-07-03T20:00:00+02:00",
    status: "on_sale",
    source: "Ticketing partner page",
    tags: ["Europe", "Arena", "VIP package"],
    ticketLinks: [
      {
        label: "Official Sale",
        href: "https://example.com/tickets/blackpink-paris",
        type: "official"
      }
    ]
  },
  {
    id: "aespa-tokyo-2026",
    artist: "aespa",
    slug: "aespa-tokyo-2026",
    city: "Tokyo",
    country: "Japan",
    venue: "Ariake Arena",
    startDate: "2026-03-29T18:30:00+09:00",
    status: "sold_out",
    source: "Venue schedule",
    tags: ["Japan", "Arena", "Waitlist"],
    ticketLinks: [
      {
        label: "Official Waitlist",
        href: "https://example.com/tickets/aespa-tokyo",
        type: "official"
      },
      {
        label: "Verified Resale",
        href: "https://example.com/resale/aespa-tokyo",
        type: "resale"
      }
    ]
  },
  {
    id: "aespa-sydney-2026",
    artist: "aespa",
    slug: "aespa-sydney-2026",
    city: "Sydney",
    country: "Australia",
    venue: "Qudos Bank Arena",
    startDate: "2026-08-15T19:30:00+10:00",
    status: "announced",
    source: "Official tour page",
    tags: ["Oceania", "Arena", "Travel"],
    ticketLinks: [
      {
        label: "Tour Page",
        href: "https://example.com/tickets/aespa-sydney",
        type: "official"
      }
    ]
  },
  {
    id: "sk-mexico-city-2026",
    artist: "Stray Kids",
    slug: "sk-mexico-city-2026",
    city: "Mexico City",
    country: "Mexico",
    venue: "Palacio de los Deportes",
    startDate: "2026-09-04T20:00:00-06:00",
    status: "on_sale",
    source: "Promoter release",
    tags: ["Latin America", "Arena", "High demand"],
    ticketLinks: [
      {
        label: "Official Ticket",
        href: "https://example.com/tickets/straykids-mexico",
        type: "official"
      }
    ]
  },
  {
    id: "lsf-hong-kong-2026",
    artist: "LE SSERAFIM",
    slug: "lsf-hong-kong-2026",
    city: "Hong Kong",
    country: "Hong Kong",
    venue: "AsiaWorld-Arena",
    startDate: "2026-05-24T19:00:00+08:00",
    status: "announced",
    source: "Official artist notice",
    tags: ["Asia", "Arena", "Local payment"],
    ticketLinks: [
      {
        label: "Official Sale",
        href: "https://example.com/tickets/lesserafim-hk",
        type: "official"
      }
    ]
  },
  {
    id: "dream-london-2026",
    artist: "NCT DREAM",
    slug: "dream-london-2026",
    city: "London",
    country: "United Kingdom",
    venue: "The O2",
    startDate: "2026-10-11T19:30:00+01:00",
    status: "on_sale",
    source: "Official tour page",
    tags: ["Europe", "Arena", "VIP"],
    ticketLinks: [
      {
        label: "Official Ticket",
        href: "https://example.com/tickets/nctdream-london",
        type: "official"
      }
    ]
  }
];

export const productPillars = [
  {
    title: "全网巡演抓取",
    body: "聚合艺人官宣、票务平台、场馆日历与主办方发布，统一沉淀为标准化事件。"
  },
  {
    title: "中文用户优先",
    body: "时间、城市、票务状态、入场说明和交通建议都按中文语境组织，不只是翻译。"
  },
  {
    title: "向 fandom 平台扩展",
    body: "后续可增加艺人主页、饭拍内容、应援攻略、收藏夹、通知订阅与社区互动。"
  }
];

export const architectureTracks = [
  {
    name: "Frontend",
    detail: "Next.js App Router + TypeScript，先做内容型站点，后续可接登录、会员、SEO、ISR。"
  },
  {
    name: "Data",
    detail: "建议 PostgreSQL + Prisma，核心模型围绕 artist、tour、event、ticket_link、source_snapshot。"
  },
  {
    name: "Ingestion",
    detail: "独立抓取任务层，优先从官方公告、票务页和场馆 RSS/API 获取，再补充人工审核流。"
  },
  {
    name: "Platform",
    detail: "后续接对象存储、消息队列、搜索和用户系统，逐步演进为中文 K-pop fandom hub。"
  }
];

export function getStatusLabel(status: EventStatusValue) {
  switch (status) {
    case "on_sale":
      return "售票中";
    case "announced":
      return "已官宣";
    case "sold_out":
      return "已售罄";
    default:
      return status;
  }
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
}

export function findArtistByName(name: string) {
  return artists.find((artist) => artist.name === name) ?? null;
}

export function findArtistBySlug(slug: string) {
  return artists.find((artist) => artist.slug === slug) ?? null;
}

export function slugifyArtistName(name: string) {
  return findArtistByName(name)?.slug ?? name.toLowerCase().replaceAll(" ", "-");
}

export function uniqueCountries(items: EventItem[]) {
  return [...new Set(items.map((item) => item.country))].sort();
}
