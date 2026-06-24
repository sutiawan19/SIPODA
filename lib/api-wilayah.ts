const BASE_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";

export interface Region {
  id: string;
  name: string;
}

export async function getProvinces(): Promise<Region[]> {
  try {
    const res = await fetch(`${BASE_URL}/provinces.json`, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error("Failed to fetch provinces");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getRegencies(provinceId: string): Promise<Region[]> {
  if (!provinceId) return [];
  try {
    const res = await fetch(`${BASE_URL}/regencies/${provinceId}.json`, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error("Failed to fetch regencies");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getDistricts(regencyId: string): Promise<Region[]> {
  if (!regencyId) return [];
  try {
    const res = await fetch(`${BASE_URL}/districts/${regencyId}.json`, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error("Failed to fetch districts");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
