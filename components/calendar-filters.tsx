import type { EventStatusValue } from "@/lib/site-data";

type Props = {
  artistOptions: Array<{ label: string; value: string }>;
  countryOptions: string[];
  current: {
    artist?: string;
    country?: string;
    status?: EventStatusValue;
    q?: string;
  };
};

const statusOptions: Array<{ label: string; value: EventStatusValue }> = [
  { label: "售票中", value: "on_sale" },
  { label: "已官宣", value: "announced" },
  { label: "已售罄", value: "sold_out" }
];

export function CalendarFilters({ artistOptions, countryOptions, current }: Props) {
  return (
    <form action="/calendar" className="filter-panel">
      <label className="field">
        <span>搜索</span>
        <input defaultValue={current.q} name="q" placeholder="艺人、城市、场馆" type="search" />
      </label>
      <label className="field">
        <span>艺人</span>
        <select defaultValue={current.artist ?? ""} name="artist">
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
        <select defaultValue={current.country ?? ""} name="country">
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
        <select defaultValue={current.status ?? ""} name="status">
          <option value="">全部状态</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <div className="filter-actions">
        <button className="primary-button" type="submit">
          应用筛选
        </button>
        <a className="secondary-button" href="/calendar">
          重置
        </a>
      </div>
    </form>
  );
}
