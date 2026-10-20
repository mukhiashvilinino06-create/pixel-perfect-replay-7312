import svaneti from "@/assets/svaneti.jpg";
import samegrelo from "@/assets/samegrelo.jpg";
import kakheti from "@/assets/kakheti.jpg";
import kazbegi from "@/assets/kazbegi.jpg";
import mtskheta from "@/assets/mtskheta.jpg";
import imereti from "@/assets/imereti.jpg";
import adjara from "@/assets/adjara.jpg";

export type Lang = "ka" | "en";
export type L = Record<Lang, string>;
export type Style = "nature" | "wine" | "history" | "adventure";
export type RegionId =
  | "svaneti"
  | "samegrelo"
  | "imereti"
  | "kazbegi"
  | "mtskheta"
  | "kakheti"
  | "adjara";

export interface Region {
  id: RegionId;
  name: L;
  image: string;
  blurb: L;
  mountain: boolean;
}

export const REGIONS: Region[] = [
  { id: "svaneti", name: { ka: "სვანეთი", en: "Svaneti" }, image: svaneti, mountain: true,
    blurb: { ka: "მაღალმთიანი სოფლები, სვანური კოშკები და მყინვარები.", en: "High-mountain villages, Svan towers and glaciers." } },
  { id: "samegrelo", name: { ka: "სამეგრელო", en: "Samegrelo" }, image: samegrelo, mountain: false,
    blurb: { ka: "კანიონები, ჭაობიანი ჭალები და დადიანების მემკვიდრეობა.", en: "Canyons, wetlands and the legacy of the Dadiani princes." } },
  { id: "imereti", name: { ka: "იმერეთი", en: "Imereti" }, image: imereti, mountain: false,
    blurb: { ka: "ქუთაისი, ძველი მონასტრები და მღვიმეები.", en: "Kutaisi, medieval monasteries and caves." } },
  { id: "kazbegi", name: { ka: "ყაზბეგი", en: "Kazbegi" }, image: kazbegi, mountain: true,
    blurb: { ka: "მყინვარწვერის ძირში — სამება და მთის ბილიკები.", en: "Beneath Mount Kazbek — Gergeti Trinity and mountain trails." } },
  { id: "mtskheta", name: { ka: "მცხეთა", en: "Mtskheta" }, image: mtskheta, mountain: false,
    blurb: { ka: "საქართველოს ძველი დედაქალაქი და სულიერი გული.", en: "Georgia's ancient capital and spiritual heart." } },
  { id: "kakheti", name: { ka: "კახეთი", en: "Kakheti" }, image: kakheti, mountain: false,
    blurb: { ka: "ღვინის მხარე — ვენახები, მარნები და სიღნაღი.", en: "Wine country — vineyards, cellars and Sighnaghi." } },
  { id: "adjara", name: { ka: "აჭარა", en: "Adjara" }, image: adjara, mountain: false,
    blurb: { ka: "ბათუმი, შავი ზღვა და სუბტროპიკული ბაღები.", en: "Batumi, the Black Sea and subtropical gardens." } },
];

export interface Destination {
  id: string;
  region: RegionId;
  name: L;
  desc: L;
  activity: L;
  styles: Style[];
  hours: number; // approximate visit duration
  hub?: boolean; // good arrival/base point
  seasonal?: boolean; // access depends on season/weather
  query: string; // Google Maps search query
}

export const DESTINATIONS: Destination[] = [
  // Svaneti
  { id: "mestia", region: "svaneti", hub: true, hours: 3, styles: ["history", "nature"], query: "Mestia, Georgia",
    name: { ka: "მესტია", en: "Mestia" },
    desc: { ka: "ზემო სვანეთის ცენტრი, ძველი კოშკებითა და მთის ხედებით.", en: "The hub of Upper Svaneti, with old towers and mountain views." },
    activity: { ka: "გაისეირნეთ ძველ უბნებში და ეწვიეთ ისტორიულ-ეთნოგრაფიულ მუზეუმს.", en: "Walk the old quarters and visit the Museum of History and Ethnography." } },
  { id: "svan-towers", region: "svaneti", hours: 2, styles: ["history"], query: "Svan towers Mestia",
    name: { ka: "სვანური კოშკები", en: "Svan Towers" },
    desc: { ka: "შუა საუკუნეების საცხოვრებელი-თავდაცვითი კოშკები — UNESCO-ს მემკვიდრეობის ნაწილი.", en: "Medieval defensive tower-houses, part of a UNESCO-listed heritage." },
    activity: { ka: "დაათვალიერეთ კოშკი და გაიცანით სვანური ყოფა და ტრადიციები.", en: "Climb a tower and learn about Svan family life and traditions." } },
  { id: "hatsvali", region: "svaneti", hours: 3, seasonal: true, styles: ["nature", "adventure"], query: "Hatsvali, Mestia",
    name: { ka: "ჰაწვალი", en: "Hatsvali" },
    desc: { ka: "მესტიის ზემოთ მდებარე სამთო კურორტი პანორამული ხედებით.", en: "A small mountain resort above Mestia with panoramic views." },
    activity: { ka: "ავიდეთ საბაგიროთი (თუ მუშაობს) და გაისეირნეთ ხედის წერტილებზე.", en: "Ride the lift (if operating) and walk to the viewpoints." } },
  { id: "chalaadi", region: "svaneti", hours: 4, seasonal: true, styles: ["nature", "adventure"], query: "Chalaadi Glacier",
    name: { ka: "ჭალაადის მყინვარი", en: "Chalaadi Glacier" },
    desc: { ka: "ტყიანი ბილიკი მყინვარის ენამდე მესტიის მახლობლად.", en: "A forest trail to a glacier tongue near Mestia." },
    activity: { ka: "ნახევარდღიანი ლაშქრობა; ნუ მიუახლოვდებით ყინულს.", en: "Half-day hike; keep a safe distance from the ice." } },
  { id: "koruldi", region: "svaneti", hours: 6, seasonal: true, styles: ["nature", "adventure"], query: "Koruldi Lakes",
    name: { ka: "კორულდის ტბები", en: "Koruldi Lakes" },
    desc: { ka: "მაღალმთიანი ტბები უშბის ხედით.", en: "Alpine lakes with views of Mount Ushba." },
    activity: { ka: "მთლიანი დღის ლაშქრობა ან 4x4 მგზავრობა ზაფხულში.", en: "Full-day hike or 4x4 ride in summer." } },
  { id: "ushguli", region: "svaneti", hours: 6, seasonal: true, styles: ["history", "nature", "adventure"], query: "Ushguli, Georgia",
    name: { ka: "უშგული", en: "Ushguli" },
    desc: { ka: "ევროპის ერთ-ერთი უმაღლესი დასახლება შხარას ძირში.", en: "One of Europe's highest settlements, beneath Mount Shkhara." },
    activity: { ka: "დღიური გასვლა მესტიიდან (~2–3 სთ ცალ მხარეს), ხშირად 4x4-ით.", en: "Day trip from Mestia (~2–3 h each way), often by 4x4." } },
  // Samegrelo
  { id: "zugdidi", region: "samegrelo", hub: true, hours: 2, styles: ["history"], query: "Zugdidi, Georgia",
    name: { ka: "ზუგდიდი", en: "Zugdidi" },
    desc: { ka: "სამეგრელოს ცენტრი და კარიბჭე სვანეთისკენ.", en: "Samegrelo's main town and gateway to Svaneti." },
    activity: { ka: "გაისეირნეთ ბოტანიკურ ბაღში და გასინჯეთ მეგრული სამზარეულო.", en: "Stroll the botanical garden and try Megrelian cuisine." } },
  { id: "dadiani", region: "samegrelo", hours: 2, styles: ["history"], query: "Dadiani Palace Zugdidi",
    name: { ka: "დადიანების სასახლე", en: "Dadiani Palace" },
    desc: { ka: "სამეგრელოს მთავრების სასახლე-მუზეუმი ზუგდიდში.", en: "Palace museum of the Princes of Samegrelo in Zugdidi." },
    activity: { ka: "დაათვალიერეთ მუზეუმის კოლექცია და პარკი.", en: "Explore the museum collection and the park." } },
  { id: "martvili", region: "samegrelo", hours: 2.5, styles: ["nature", "adventure"], query: "Martvili Canyon",
    name: { ka: "მარტვილის კანიონი", en: "Martvili Canyon" },
    desc: { ka: "ფირუზისფერი წყალი და ჩანჩქერები ვიწრო კანიონში.", en: "Turquoise water and waterfalls in a narrow canyon." },
    activity: { ka: "ფეხით ბილიკი; ნავით გასეირნება სეზონზეა დამოკიდებული.", en: "Walking trail; boat rides depend on season." } },
  { id: "okatse", region: "samegrelo", hours: 3, styles: ["nature", "adventure"], query: "Okatse Canyon",
    name: { ka: "ოკაცეს კანიონი", en: "Okatse Canyon" },
    desc: { ka: "კლდეზე დაკიდებული ბილიკი ღრმა კანიონზე (იმერეთის საზღვართან).", en: "A cliff-hanging walkway above a deep canyon (on the Imereti border)." },
    activity: { ka: "გაიარეთ ბილიკი; კარგად ერწყმის მარტვილს ერთ დღეში.", en: "Walk the trail; pairs well with Martvili in one day." } },
  { id: "kolkheti", region: "samegrelo", hours: 3, styles: ["nature"], query: "Kolkheti National Park",
    name: { ka: "კოლხეთის ეროვნული პარკი", en: "Kolkheti National Park" },
    desc: { ka: "ჭარბტენიანი ტერიტორიები, ტბა პალიასტომი და ფრინველები.", en: "Wetlands, Lake Paliastomi and birdlife." },
    activity: { ka: "ნავით ან ფეხით ტური ვიზიტორთა ცენტრიდან.", en: "Boat or walking tour from the visitor centre." } },
  // Imereti
  { id: "kutaisi", region: "imereti", hub: true, hours: 3, styles: ["history", "wine"], query: "Kutaisi, Georgia",
    name: { ka: "ქუთაისი", en: "Kutaisi" },
    desc: { ka: "ძველი ქალაქი ბაგრატის ტაძრითა და ცოცხალი ბაზრით.", en: "Ancient city with Bagrati Cathedral and a lively market." },
    activity: { ka: "ეწვიეთ ბაგრატს, მწვანე ბაზარს და გასინჯეთ იმერული ღვინო.", en: "Visit Bagrati, the green market and taste Imeretian wine." } },
  { id: "gelati", region: "imereti", hours: 2, styles: ["history"], query: "Gelati Monastery",
    name: { ka: "გელათის მონასტერი", en: "Gelati Monastery" },
    desc: { ka: "XII საუკუნის მონასტერი და აკადემია — UNESCO-ს ძეგლი.", en: "12th-century monastery and academy, a UNESCO site." },
    activity: { ka: "დაათვალიერეთ მოზაიკები და ფრესკები.", en: "See the mosaics and frescoes." } },
  { id: "prometheus", region: "imereti", hours: 2, styles: ["nature", "adventure"], query: "Prometheus Cave",
    name: { ka: "პრომეთეს მღვიმე", en: "Prometheus Cave" },
    desc: { ka: "კარსტული მღვიმე სტალაქტიტებით ქუთაისის მახლობლად.", en: "Karst cave with stalactites near Kutaisi." },
    activity: { ka: "მეგზურით ტური მღვიმის დარბაზებში.", en: "Guided walk through the cave halls." } },
  // Kazbegi
  { id: "gergeti", region: "kazbegi", hub: true, hours: 3, styles: ["history", "nature"], query: "Gergeti Trinity Church",
    name: { ka: "გერგეტის სამება", en: "Gergeti Trinity" },
    desc: { ka: "XIV საუკუნის ეკლესია მყინვარწვერის ფონზე.", en: "14th-century church framed by Mount Kazbek." },
    activity: { ka: "ავიდეთ ფეხით სტეფანწმინდიდან ან ადგილობრივი ტრანსპორტით.", en: "Hike up from Stepantsminda or take a local ride." } },
  { id: "juta", region: "kazbegi", hours: 5, seasonal: true, styles: ["nature", "adventure"], query: "Juta, Georgia",
    name: { ka: "ჯუთა", en: "Juta" },
    desc: { ka: "მაღალმთიანი სოფელი ჭაუხის კლდეების ძირში.", en: "Mountain village beneath the Chaukhi peaks." },
    activity: { ka: "ლაშქრობა ხეობაში; მისასვლელი გზა ზამთარში შეიძლება ჩაკეტილი იყოს.", en: "Valley hike; the access road may close in winter." } },
  // Mtskheta
  { id: "jvari", region: "mtskheta", hub: true, hours: 1.5, styles: ["history"], query: "Jvari Monastery",
    name: { ka: "ჯვრის მონასტერი", en: "Jvari Monastery" },
    desc: { ka: "VI საუკუნის მონასტერი მტკვრისა და არაგვის შესართავთან.", en: "6th-century monastery above the river confluence." },
    activity: { ka: "დატკბით ხედით მცხეთაზე.", en: "Enjoy the view over Mtskheta." } },
  { id: "svetitskhoveli", region: "mtskheta", hours: 2, styles: ["history"], query: "Svetitskhoveli Cathedral",
    name: { ka: "სვეტიცხოველი", en: "Svetitskhoveli" },
    desc: { ka: "საქართველოს ერთ-ერთი უმნიშვნელოვანესი ტაძარი.", en: "One of Georgia's most important cathedrals." },
    activity: { ka: "დაათვალიერეთ ტაძარი და ძველი ქუჩები.", en: "Visit the cathedral and old streets." } },
  // Kakheti
  { id: "sighnaghi", region: "kakheti", hub: true, hours: 3, styles: ["history", "wine"], query: "Sighnaghi, Georgia",
    name: { ka: "სიღნაღი", en: "Sighnaghi" },
    desc: { ka: "გალავნიანი ქალაქი ალაზნის ველის ხედით.", en: "Walled hill town overlooking the Alazani Valley." },
    activity: { ka: "გაისეირნეთ გალავანზე და ეწვიეთ ბოდბეს.", en: "Walk the walls and visit nearby Bodbe." } },
  { id: "tsinandali", region: "kakheti", hours: 2.5, styles: ["wine", "history"], query: "Tsinandali Estate",
    name: { ka: "წინანდალი", en: "Tsinandali" },
    desc: { ka: "ჭავჭავაძეების მამული ბაღითა და ისტორიული მარანით.", en: "Chavchavadze estate with gardens and a historic cellar." },
    activity: { ka: "ეწვიეთ მუზეუმს და დააგემოვნეთ ღვინო.", en: "Tour the museum and enjoy a wine tasting." } },
  { id: "kakheti-wineries", region: "kakheti", hours: 3, styles: ["wine"], query: "wineries Telavi Kakheti",
    name: { ka: "კახური მარნები", en: "Kakhetian Wineries" },
    desc: { ka: "ოჯახური მარნები ქვევრის ღვინით.", en: "Family cellars making qvevri wine." },
    activity: { ka: "დეგუსტაცია და ტრადიციული სადილი (წინასწარ დაჯავშნეთ).", en: "Tasting and traditional lunch (book ahead)." } },
  // Adjara
  { id: "batumi", region: "adjara", hub: true, hours: 3, styles: ["history", "wine"], query: "Batumi Boulevard",
    name: { ka: "ბათუმის ბულვარი", en: "Batumi Boulevard" },
    desc: { ka: "ზღვისპირა სასეირნო და ძველი ბათუმი.", en: "Seaside promenade and Old Batumi." },
    activity: { ka: "გაისეირნეთ ბულვარზე და გასინჯეთ აჭარული ხაჭაპური.", en: "Walk the boulevard and try Adjarian khachapuri." } },
  { id: "botanical", region: "adjara", hours: 3, styles: ["nature"], query: "Batumi Botanical Garden",
    name: { ka: "ბათუმის ბოტანიკური ბაღი", en: "Batumi Botanical Garden" },
    desc: { ka: "ზღვისპირა ბაღი მთელი მსოფლიოს მცენარეებით.", en: "Seaside garden with plants from around the world." },
    activity: { ka: "ნახევარდღიანი სეირნობა ბილიკებზე.", en: "Half-day walk along the paths." } },
];

export const mapsUrl = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const regionById = (id: RegionId) => REGIONS.find((r) => r.id === id)!;
export const destById = (id: string) => DESTINATIONS.find((d) => d.id === id)!;
