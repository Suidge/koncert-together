"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type { EventStatusValue } from "@/lib/site-data";

type Props = {
  artistOptions: Array<{ label: string; value: string }>;
  countryOptions: string[];
  current: {
    artist?: string;
    country?: string;
    status?: EventStatusValue;
    q?: string;
    sort?: string;
  };
};

const statusOptions: Array<{ label: string; value: EventStatusValue }> = [
  { label: "售票中", value: "on_sale" },
  { label: "已官宣", value: "announced" },
  { label: "已售罄", value: "sold_out" }
];

export function CalendarFilters({ artistOptions, countryOptions, current }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    q: current.q ?? "",
    artist: current.artist ?? "",
    country: current.country ?? "",
    status: current.status ?? "",
    sort: current.sort ?? "date"
  });

  useEffect(() => {
    setForm({
      q: current.q ?? "",
      artist: current.artist ?? "",
      country: current.country ?? "",
      status: current.status ?? "",
      sort: current.sort ?? "date"
    });
  }, [current.artist, current.country, current.q, current.sort, current.status]);

  function apply(next = form) {
    const params = new URLSearchParams();

    if (next.q) params.set("q", next.q);
    if (next.artist) params.set("artist", next.artist);
    if (next.country) params.set("country", next.country);
    if (next.status) params.set("status", next.status);
    if (next.sort && next.sort !== "date") params.set("sort", next.sort);

    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    const next = { ...form, [key]: value };
    setForm(next);
    if (key === "sort") {
      apply(next);
    }
  }

  return (
    <section className="filter-shell">
      <div className="filter-panel">
        <label className="field">
          <span>搜索</span>
          <input
            onChange={(event) => update("q", event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                apply();
              }
            }}
            placeholder="艺人、城市、场馆"
            type="search"
            value={form.q}
          />
        </label>
        <label className="field">
          <span>艺人</span>
          <select onChange={(event) => update("artist", event.target.value)} value={form.artist}>
            <option value="">全部艺人</option>
            {artistOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>国家/地区</span>
          <select onChange={(event) => update("country", event.target.value)} value={form.country}>
            <option value="">全部地区</option>
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>状态</span>
          <select onChange={(event) => update("status", event.target.value)} value={form.status}>
            <option value="">全部状态</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>排序</span>
          <select onChange={(event) => update("sort", event.target.value)} value={form.sort}>
            <option value="date">按日期</option>
            <option value="artist">按艺人</option>
            <option value="city">按城市</option>
          </select>
        </label>
        <div className="filter-actions">
          <button className="primary-button" onClick={() => apply()} type="button">
            {isPending ? "更新中..." : "应用筛选"}
          </button>
          <button
            className="secondary-button"
            onClick={() => {
              const reset = { q: "", artist: "", country: "", status: "", sort: "date" };
              setForm(reset);
              startTransition(() => {
                router.replace(pathname, { scroll: false });
              });
            }}
            type="button"
          >
            重置
          </button>
        </div>
      </div>
    </section>
  );
}
