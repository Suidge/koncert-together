"use client";

import { useSearchParams } from "next/navigation";
import { CalendarFilters } from "@/components/calendar-filters";
import { EventCard } from "@/components/event-card";
import type { ArtistProfile, EventItem, EventStatusValue } from "@/lib/site-data";
import { uniqueCountries } from "@/lib/site-data";

type Props = {
  artists: ArtistProfile[];
  events: EventItem[];
};

function matches(item: EventItem, params: URLSearchParams) {
  const artist = params.get("artist");
  const country = params.get("country");
  const status = params.get("status") as EventStatusValue | null;
  const q = params.get("q");

  if (artist && item.artist.toLowerCase().replaceAll(" ", "-") !== artist) {
    return false;
  }

  if (country && item.country !== country) {
    return false;
  }

  if (status && item.status !== status) {
    return false;
  }

  if (q) {
    const haystack =
      `${item.artist} ${item.city} ${item.country} ${item.venue}`.toLowerCase();
    if (!haystack.includes(q.toLowerCase())) {
      return false;
    }
  }

  return true;
}

export function CalendarBrowser({ artists, events }: Props) {
  const searchParams = useSearchParams();
  const filteredEvents = events.filter((item) => matches(item, searchParams));
  const current = {
    artist: searchParams.get("artist") ?? undefined,
    country: searchParams.get("country") ?? undefined,
    status: (searchParams.get("status") as EventStatusValue | null) ?? undefined,
    q: searchParams.get("q") ?? undefined
  };

  return (
    <>
      <CalendarFilters
        artistOptions={artists.map((artist) => ({
          label: artist.name,
          value: artist.slug
        }))}
        countryOptions={uniqueCountries(events)}
        current={current}
      />
      <section className="section-head compact-head">
        <div>
          <p className="eyebrow">Results</p>
          <h2>{filteredEvents.length} 场活动</h2>
        </div>
      </section>
      <section className="event-grid">
        {filteredEvents.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </section>
    </>
  );
}
