export interface City {
  id: string;
  name: string;
  plateNumber: string;
}

// Major cities in Turkey (with plate numbers for reference)
export const cities: City[] = [
  { id: "1", name: "Adana", plateNumber: "01" },
  { id: "2", name: "Adıyaman", plateNumber: "02" },
  { id: "3", name: "Afyonkarahisar", plateNumber: "03" },
  { id: "4", name: "Ağrı", plateNumber: "04" },
  { id: "68", name: "Aksaray", plateNumber: "68" },
  { id: "5", name: "Amasya", plateNumber: "05" },
  { id: "6", name: "Ankara", plateNumber: "06" },
  { id: "7", name: "Antalya", plateNumber: "07" },
  { id: "75", name: "Ardahan", plateNumber: "75" },
  { id: "8", name: "Artvin", plateNumber: "08" },
  { id: "9", name: "Aydın", plateNumber: "09" },
  { id: "10", name: "Balıkesir", plateNumber: "10" },
  { id: "74", name: "Bartın", plateNumber: "74" },
  { id: "72", name: "Batman", plateNumber: "72" },
  { id: "69", name: "Bayburt", plateNumber: "69" },
  { id: "11", name: "Bilecik", plateNumber: "11" },
  { id: "12", name: "Bingöl", plateNumber: "12" },
  { id: "13", name: "Bitlis", plateNumber: "13" },
  { id: "14", name: "Bolu", plateNumber: "14" },
  { id: "15", name: "Burdur", plateNumber: "15" },
  { id: "16", name: "Bursa", plateNumber: "16" },
  { id: "17", name: "Çanakkale", plateNumber: "17" },
  { id: "18", name: "Çankırı", plateNumber: "18" },
  { id: "19", name: "Çorum", plateNumber: "19" },
  { id: "20", name: "Denizli", plateNumber: "20" },
  { id: "21", name: "Diyarbakır", plateNumber: "21" },
  { id: "81", name: "Düzce", plateNumber: "81" },
  { id: "22", name: "Edirne", plateNumber: "22" },
  { id: "23", name: "Elazığ", plateNumber: "23" },
  { id: "24", name: "Erzincan", plateNumber: "24" },
  { id: "25", name: "Erzurum", plateNumber: "25" },
  { id: "26", name: "Eskişehir", plateNumber: "26" },
  { id: "27", name: "Gaziantep", plateNumber: "27" },
  { id: "28", name: "Giresun", plateNumber: "28" },
  { id: "29", name: "Gümüşhane", plateNumber: "29" },
  { id: "30", name: "Hakkari", plateNumber: "30" },
  { id: "31", name: "Hatay", plateNumber: "31" },
  { id: "76", name: "Iğdır", plateNumber: "76" },
  { id: "32", name: "Isparta", plateNumber: "32" },
  { id: "34", name: "İstanbul", plateNumber: "34" },
  { id: "35", name: "İzmir", plateNumber: "35" },
  { id: "46", name: "Kahramanmaraş", plateNumber: "46" },
  { id: "78", name: "Karabük", plateNumber: "78" },
  { id: "70", name: "Karaman", plateNumber: "70" },
  { id: "36", name: "Kars", plateNumber: "36" },
  { id: "37", name: "Kastamonu", plateNumber: "37" },
  { id: "38", name: "Kayseri", plateNumber: "38" },
  { id: "79", name: "Kilis", plateNumber: "79" },
  { id: "41", name: "Kocaeli", plateNumber: "41" },
  { id: "42", name: "Konya", plateNumber: "42" },
  { id: "43", name: "Kütahya", plateNumber: "43" },
  { id: "44", name: "Malatya", plateNumber: "44" },
  { id: "45", name: "Manisa", plateNumber: "45" },
  { id: "47", name: "Mardin", plateNumber: "47" },
  { id: "33", name: "Mersin", plateNumber: "33" },
  { id: "48", name: "Muğla", plateNumber: "48" },
  { id: "49", name: "Muş", plateNumber: "49" },
  { id: "50", name: "Nevşehir", plateNumber: "50" },
  { id: "51", name: "Niğde", plateNumber: "51" },
  { id: "52", name: "Ordu", plateNumber: "52" },
  { id: "80", name: "Osmaniye", plateNumber: "80" },
  { id: "53", name: "Rize", plateNumber: "53" },
  { id: "54", name: "Sakarya", plateNumber: "54" },
  { id: "55", name: "Samsun", plateNumber: "55" },
  { id: "56", name: "Siirt", plateNumber: "56" },
  { id: "57", name: "Sinop", plateNumber: "57" },
  { id: "58", name: "Sivas", plateNumber: "58" },
  { id: "63", name: "Şanlıurfa", plateNumber: "63" },
  { id: "73", name: "Şırnak", plateNumber: "73" },
  { id: "59", name: "Tekirdağ", plateNumber: "59" },
  { id: "60", name: "Tokat", plateNumber: "60" },
  { id: "61", name: "Trabzon", plateNumber: "61" },
  { id: "62", name: "Tunceli", plateNumber: "62" },
  { id: "64", name: "Uşak", plateNumber: "64" },
  { id: "65", name: "Van", plateNumber: "65" },
  { id: "77", name: "Yalova", plateNumber: "77" },
  { id: "66", name: "Yozgat", plateNumber: "66" },
  { id: "67", name: "Zonguldak", plateNumber: "67" },
];

export function searchCities(query: string): City[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return [];
  }

  return cities.filter((city) =>
    city.name.toLowerCase().includes(normalizedQuery)
  );
}

export async function fetchCities(query: string): Promise<City[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 150));
  return searchCities(query);
}
