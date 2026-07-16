import { useMemo } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function CareerSelector({
  careerList,
  selectedSlug,
  onChange,
  placeholder,
}: {
  careerList: { slug: string; title: string }[];
  selectedSlug: string;
  onChange: (slug: string) => void;
  placeholder: string;
}) {
  const options = useMemo(() => {
    const seen = new Set<string>();
    return careerList.filter((c) => {
      if (!c.slug || seen.has(c.slug)) return false;
      seen.add(c.slug);
      return true;
    });
  }, [careerList]);

  return (
    <Select value={selectedSlug} onValueChange={(v) => onChange(v)}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.slug} value={o.slug}>
            {o.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}


