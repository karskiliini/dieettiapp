import type { Recipe, ProteinSource } from "./data";

type KetoRecipe = Omit<Recipe, "id" | "dietCategory"> & { proteinSource: ProteinSource };

function k(
  name: string,
  description: string,
  proteinSource: ProteinSource,
  mealType: Recipe["mealType"],
  ingredients: Recipe["ingredients"],
  instructions: string[],
  prep: number,
  cook: number,
  servings: number,
  cal: number,
  p: number,
  c: number,
  f: number
): KetoRecipe {
  return {
    name,
    description,
    proteinSource,
    mealType,
    ingredients,
    instructions,
    prepTimeMinutes: prep,
    cookTimeMinutes: cook,
    servings,
    calories: cal,
    proteinGrams: p,
    carbsGrams: c,
    fatGrams: f,
    imageUrl: null,
  };
}

export const KETO_RECIPES: KetoRecipe[] = [
  // =================== KANA (chicken) ===================
  k("Kana-fetasalaatti", "Grillattu kana fetajuustolla ja oliiveilla", "kana", "lounas",
    [{ amount: 300, unit: "g", name: "kananrintafilee" }, { amount: 100, unit: "g", name: "fetajuusto" }, { amount: 50, unit: "g", name: "oliivit" }, { amount: 100, unit: "g", name: "salaattisekoitus" }, { amount: 2, unit: "rkl", name: "oliiviöljy" }],
    ["Grillaa kana pannulla.", "Murustele feta ja lisää oliivit.", "Kokoa salaatti ja valuta öljy."],
    10, 15, 2, 460, 36, 4, 34),

  k("Kana-pekoniruukku", "Pekoniin käärittyjä kananpaloja juustotäytteellä", "kana", "päivällinen",
    [{ amount: 400, unit: "g", name: "kananrintafilee" }, { amount: 150, unit: "g", name: "pekoni" }, { amount: 100, unit: "g", name: "tuorejuusto" }, { amount: 1, unit: "tl", name: "paprikajauhe" }],
    ["Täytä kanapalat tuorejuustolla.", "Kääri pekonilla.", "Paista uunissa 200°C 25min."],
    15, 25, 4, 480, 40, 2, 34),

  k("Kreikkalainen kanasalaatti", "Kreikkalaistyyppinen salaatti grillibroilerilla", "kana", "lounas",
    [{ amount: 300, unit: "g", name: "grillattu kana" }, { amount: 100, unit: "g", name: "kurkku" }, { amount: 80, unit: "g", name: "kirsikkatomaatit" }, { amount: 50, unit: "g", name: "fetajuusto" }, { amount: 30, unit: "g", name: "kalamata-oliivit" }, { amount: 2, unit: "rkl", name: "oliiviöljy" }],
    ["Pilko kasvikset.", "Viipaloiti kana.", "Kokoa salaatti, murustele feta.", "Valuta oliiviöljy päälle."],
    10, 0, 2, 420, 34, 5, 30),

  k("Tikka masala -kana", "Kermainen tikka masala ilman riisiä", "kana", "päivällinen",
    [{ amount: 500, unit: "g", name: "kanankoipi" }, { amount: 2, unit: "dl", name: "kerma" }, { amount: 2, unit: "rkl", name: "tikka masala -tahna" }, { amount: 1, unit: "kpl", name: "sipuli" }, { amount: 2, unit: "kynsi", name: "valkosipuli" }],
    ["Paista kanaa mausteissa.", "Lisää kerma ja tahna.", "Hauduta 20min."],
    10, 25, 4, 440, 32, 5, 32),

  k("Kana-halloumivartaat", "Grillattuja kanaa ja halloumivartaita", "kana", "päivällinen",
    [{ amount: 400, unit: "g", name: "kananrintafilee" }, { amount: 200, unit: "g", name: "halloumi" }, { amount: 1, unit: "kpl", name: "paprika" }, { amount: 2, unit: "rkl", name: "oliiviöljy" }, { amount: 1, unit: "tl", name: "oregano" }],
    ["Kuutioi kana ja halloumi.", "Pujota vartaisiin paprikan kanssa.", "Grillaa 12min käännellen."],
    15, 12, 4, 420, 38, 3, 28),

  k("Kana-caesarsalaatti", "Klassinen caesar ilman krutongeja", "kana", "lounas",
    [{ amount: 300, unit: "g", name: "kananrintafilee" }, { amount: 200, unit: "g", name: "romaaninlehtisalaatti" }, { amount: 50, unit: "g", name: "parmesaani" }, { amount: 3, unit: "rkl", name: "caesar-kastike" }, { amount: 30, unit: "g", name: "pekonirouhe" }],
    ["Grillaa kana ja viipaloiti.", "Revit salaatti.", "Kokoa ja lisää kastike ja parmesaani."],
    10, 12, 2, 450, 38, 4, 32),

  k("Kana-pinaattigratiini", "Kermainen kana-pinaattigratiini juustokuorrutuksella", "kana", "päivällinen",
    [{ amount: 400, unit: "g", name: "kananrintafilee" }, { amount: 200, unit: "g", name: "pinaatti" }, { amount: 2, unit: "dl", name: "kerma" }, { amount: 100, unit: "g", name: "mozzarella" }, { amount: 1, unit: "kynsi", name: "valkosipuli" }],
    ["Paista kana ja pinaatti.", "Kaada kerma, asettele vuokaan.", "Lisää juusto ja gratinoitu 200°C 15min."],
    10, 20, 4, 430, 34, 3, 32),

  k("Kanawingsit", "Rapeat uunikana-wingsit", "kana", "päivällinen",
    [{ amount: 1, unit: "kg", name: "kanansiipi" }, { amount: 2, unit: "rkl", name: "oliiviöljy" }, { amount: 1, unit: "tl", name: "savupaprika" }, { amount: 1, unit: "tl", name: "valkosipulijauhe" }, { amount: 50, unit: "g", name: "voi" }],
    ["Mausta siivet ja öljyä.", "Paista uunissa 220°C 40min.", "Valuta maustevoi päälle."],
    10, 40, 4, 460, 34, 1, 36),

  k("Thai-kanakulho", "Kookos-kanakulho ilman nuudeleita", "kana", "päivällinen",
    [{ amount: 400, unit: "g", name: "kanankoipi" }, { amount: 400, unit: "ml", name: "kookosmaito" }, { amount: 2, unit: "rkl", name: "punainen currytahna" }, { amount: 100, unit: "g", name: "bambunverso" }, { amount: 1, unit: "rkl", name: "kalakastike" }],
    ["Paista kana.", "Lisää currytahna ja kookosmaito.", "Lisää bambunversot. Keitä 15min."],
    10, 20, 4, 420, 30, 5, 32),

  k("Kana-jogurttimarinaadi", "Jogurttimarinoitu uunikana yrteillä", "kana", "päivällinen",
    [{ amount: 500, unit: "g", name: "kanankoipi" }, { amount: 2, unit: "dl", name: "kreikkalainen jogurtti" }, { amount: 2, unit: "kynsi", name: "valkosipuli" }, { amount: 1, unit: "tl", name: "kurkuma" }, { amount: 1, unit: "rkl", name: "sitruunamehu" }],
    ["Marinoi kana jogurtissa vähintään 1h.", "Paista uunissa 200°C 30min.", "Tarjoile salaatin kanssa."],
    10, 30, 4, 380, 36, 4, 24),

  // =================== NAUTA (beef) ===================
  k("Juustohampurilainen", "Salaattikäärö juustohampurilainen", "nauta", "lounas",
    [{ amount: 400, unit: "g", name: "jauheliha" }, { amount: 4, unit: "viipale", name: "cheddar" }, { amount: 4, unit: "lehti", name: "jääsalaatti" }, { amount: 1, unit: "kpl", name: "tomaatti" }, { amount: 2, unit: "rkl", name: "majoneesi" }],
    ["Muotoile pihvit ja paista.", "Lisää juusto sulattumaan.", "Kääri salaattilehtiin."],
    10, 12, 4, 480, 32, 3, 38),

  k("Pippuripihvi", "Tulikastikkeinen pippuripihvi", "nauta", "päivällinen",
    [{ amount: 400, unit: "g", name: "entrecôte" }, { amount: 2, unit: "rkl", name: "musta pippuri (murskattu)" }, { amount: 1, unit: "dl", name: "kerma" }, { amount: 1, unit: "rkl", name: "konjakki" }, { amount: 1, unit: "rkl", name: "voi" }],
    ["Painele pippuri pihveihin.", "Paista pannulla halutusti.", "Tee kermapippurikastike samaan pannuun."],
    10, 12, 2, 520, 38, 2, 40),

  k("Naudanliha-wokki", "Nopea naudan suikaleita seesami-soijakastikkeessa", "nauta", "päivällinen",
    [{ amount: 400, unit: "g", name: "naudan sisäfilee" }, { amount: 200, unit: "g", name: "parsakaali" }, { amount: 2, unit: "rkl", name: "soijakastike" }, { amount: 1, unit: "rkl", name: "seesamiöljy" }, { amount: 1, unit: "tl", name: "inkivääri (raastettu)" }],
    ["Suikaloita naudan sisäfilee.", "Woki kuumalla pannulla.", "Lisää parsakaali ja mausteet."],
    10, 8, 2, 440, 40, 5, 28),

  k("Texmex-jauheliha", "Mausteinen jauheliha salaattikupeissa", "nauta", "lounas",
    [{ amount: 400, unit: "g", name: "jauheliha" }, { amount: 1, unit: "kpl", name: "jääsalaatti" }, { amount: 100, unit: "g", name: "cheddar (raaste)" }, { amount: 1, unit: "dl", name: "smetana" }, { amount: 2, unit: "rkl", name: "texmex-mauste" }],
    ["Paista jauheliha mausteissa.", "Annostele salaattikuppeihin.", "Lisää juusto ja smetana."],
    10, 12, 4, 440, 30, 4, 34),

  k("Nauta-bearnaise", "Paistettua nautaa bearnaisekastikkeella", "nauta", "päivällinen",
    [{ amount: 400, unit: "g", name: "naudan ulkofilee" }, { amount: 100, unit: "g", name: "bearnaisekastike" }, { amount: 200, unit: "g", name: "parsaa" }, { amount: 1, unit: "rkl", name: "voi" }],
    ["Paista filee medium.", "Grillaa parsat voissa.", "Tarjoile bearnaisekastikkeella."],
    5, 15, 2, 540, 36, 3, 44),

  k("Bibimbap-kulho", "Korealaistyyppinen nautakulho ilman riisiä", "nauta", "lounas",
    [{ amount: 300, unit: "g", name: "naudan suikaleet" }, { amount: 1, unit: "kpl", name: "kananmuna" }, { amount: 100, unit: "g", name: "pinaatti" }, { amount: 1, unit: "kpl", name: "kurkku" }, { amount: 2, unit: "rkl", name: "gochujang (vähähiilihydraattinen)" }, { amount: 1, unit: "rkl", name: "seesamiöljy" }],
    ["Paista naudan suikaleet.", "Paista munat.", "Kokoa kulho kasviksista ja lihasta."],
    10, 12, 2, 440, 34, 5, 32),

  k("Naudanliha-juustoruukku", "Hitaasti haudutettu naudanliha sulajuustolla", "nauta", "päivällinen",
    [{ amount: 500, unit: "g", name: "naudanpotka" }, { amount: 100, unit: "g", name: "cheddar" }, { amount: 1, unit: "kpl", name: "sipuli" }, { amount: 2, unit: "dl", name: "lihaliemi" }, { amount: 1, unit: "tl", name: "savupaprika" }],
    ["Hauduta naudanliha liemessä 2h miedolla.", "Revit liha haarukalla.", "Lisää juusto sulattumaan."],
    10, 120, 4, 480, 42, 3, 34),

  k("Flank steak -salaatti", "Viipaloitua kylkipihviä rucolan päällä", "nauta", "lounas",
    [{ amount: 400, unit: "g", name: "flank steak" }, { amount: 100, unit: "g", name: "rucola" }, { amount: 50, unit: "g", name: "parmesaani" }, { amount: 1, unit: "kpl", name: "avokado" }, { amount: 2, unit: "rkl", name: "balsamico" }],
    ["Grillaa pihvi medium-rare.", "Anna levätä 5min, viipaloiti.", "Kokoa salaatti."],
    5, 10, 2, 500, 38, 4, 38),

  k("Bolognese-kastike", "Keto-bolognese ilman pastaa", "nauta", "päivällinen",
    [{ amount: 500, unit: "g", name: "jauheliha" }, { amount: 200, unit: "ml", name: "tomaattimurska" }, { amount: 1, unit: "kpl", name: "sipuli" }, { amount: 2, unit: "kynsi", name: "valkosipuli" }, { amount: 200, unit: "g", name: "kesäkurpitsanauha" }, { amount: 50, unit: "g", name: "parmesaani" }],
    ["Paista jauheliha.", "Lisää sipuli, tomaatti, valkosipuli.", "Hauduta 20min. Tarjoile kesäkurpitsanauhojen päällä."],
    10, 25, 4, 420, 32, 6, 30),

  k("Naudan tagliata", "Ohuiksi viipaloitu entrecôte balsamicoglaseerilla", "nauta", "päivällinen",
    [{ amount: 400, unit: "g", name: "entrecôte" }, { amount: 100, unit: "g", name: "rucola" }, { amount: 50, unit: "g", name: "granapadano" }, { amount: 2, unit: "rkl", name: "balsamicoglaseeraus" }, { amount: 1, unit: "rkl", name: "oliiviöljy" }],
    ["Paista entrecôte 3min/puoli.", "Viipaloiti ohueksi.", "Asettele rucolalle, höylää juusto."],
    5, 8, 2, 510, 36, 3, 40),

  // =================== PORSAS (pork) ===================
  k("Pekoni-munakokkelit", "Rapea pekoni pehmeän kokkelin kera", "porsas", "aamiainen",
    [{ amount: 150, unit: "g", name: "pekoni" }, { amount: 4, unit: "kpl", name: "kananmuna" }, { amount: 1, unit: "rkl", name: "voi" }, { amount: 1, unit: "rkl", name: "ruohosipuli" }],
    ["Paista pekoni rapeaksi.", "Tee munakokkeli voissa.", "Tarjoile yhdessä."],
    5, 10, 2, 440, 28, 1, 36),

  k("Pulled pork -salaatti", "Revittyä possua salaattipedillä", "porsas", "lounas",
    [{ amount: 400, unit: "g", name: "possun niska (revittynä)" }, { amount: 100, unit: "g", name: "coleslaw-sekoitus" }, { amount: 2, unit: "rkl", name: "majoneesi" }, { amount: 1, unit: "rkl", name: "sinappi" }, { amount: 50, unit: "g", name: "suolakurkku" }],
    ["Lämmitä revitty possu.", "Sekoita coleslaw ja majoneesi.", "Kokoa salaatti."],
    10, 5, 2, 480, 34, 4, 36),

  k("Possun ulkofilee juustolla", "Pannupaistettua possua emmental-kuorrutuksella", "porsas", "päivällinen",
    [{ amount: 400, unit: "g", name: "possun ulkofilee" }, { amount: 100, unit: "g", name: "emmental" }, { amount: 200, unit: "g", name: "parsakaali" }, { amount: 1, unit: "rkl", name: "voi" }, { amount: 1, unit: "tl", name: "rosmariini" }],
    ["Paista filee pannulla.", "Siirrä uuniin, lisää juusto päälle.", "Gratinoitu 200°C 10min."],
    10, 20, 2, 480, 42, 3, 34),

  k("Possunkylki BBQ", "Mausteinen possunkylki ilman sokeria", "porsas", "päivällinen",
    [{ amount: 800, unit: "g", name: "possunkylki" }, { amount: 2, unit: "rkl", name: "savupaprika" }, { amount: 1, unit: "rkl", name: "valkosipulijauhe" }, { amount: 1, unit: "rkl", name: "sipulijauhe" }, { amount: 1, unit: "tl", name: "cayennepippuri" }],
    ["Hiero mausteet kylkiin.", "Kääri folioon.", "Paista uunissa 150°C 3h. Grillaa lopuksi 5min."],
    15, 180, 4, 520, 36, 2, 42),

  k("Kinkku-juusto-munakas", "Ruokaisa munakas kinkulla ja juustolla", "porsas", "aamiainen",
    [{ amount: 4, unit: "kpl", name: "kananmuna" }, { amount: 80, unit: "g", name: "kinkku" }, { amount: 60, unit: "g", name: "emmental" }, { amount: 1, unit: "rkl", name: "voi" }, { amount: 1, unit: "rkl", name: "persiljaa" }],
    ["Vatkaa munat.", "Paista voissa, lisää kinkku ja juusto.", "Taita ja tarjoile."],
    5, 8, 2, 420, 30, 2, 32),

  k("Porsaan sisäfilee kermakastikkeella", "Meheviä sisäfilemedaljongeja", "porsas", "päivällinen",
    [{ amount: 400, unit: "g", name: "porsaan sisäfilee" }, { amount: 2, unit: "dl", name: "kerma" }, { amount: 1, unit: "rkl", name: "dijonsinappi" }, { amount: 100, unit: "g", name: "herkkusieni" }, { amount: 1, unit: "rkl", name: "voi" }],
    ["Leikkaa medaljongeiksi ja paista.", "Paista sienet.", "Tee kermakastike sinapilla."],
    10, 15, 2, 460, 36, 3, 34),

  k("Chorizo-munakas", "Tulinen munakas chorizo-makkaralla", "porsas", "aamiainen",
    [{ amount: 100, unit: "g", name: "chorizo" }, { amount: 4, unit: "kpl", name: "kananmuna" }, { amount: 50, unit: "g", name: "manchego" }, { amount: 1, unit: "rkl", name: "oliiviöljy" }, { amount: 1, unit: "kpl", name: "vihreä chili" }],
    ["Paista chorizo pannulla.", "Kaada vatkatut munat päälle.", "Lisää juusto, grillaa."],
    5, 10, 2, 480, 30, 2, 40),

  k("Possunkauli savustettuna", "Hitaasti savustettu possunkauli", "porsas", "päivällinen",
    [{ amount: 600, unit: "g", name: "possunkaulanpihvi" }, { amount: 1, unit: "rkl", name: "suola" }, { amount: 1, unit: "rkl", name: "mustapippuri" }, { amount: 1, unit: "tl", name: "valkosipulijauhe" }, { amount: 200, unit: "g", name: "hapankaali" }],
    ["Mausta liha.", "Paista uunissa 160°C 2h.", "Tarjoile hapankaalin kanssa."],
    10, 120, 4, 500, 38, 3, 38),

  k("BLT-salaatti", "Pekoni-salaatti-tomaatti keto-versio", "porsas", "lounas",
    [{ amount: 150, unit: "g", name: "pekoni" }, { amount: 100, unit: "g", name: "jääsalaatti" }, { amount: 100, unit: "g", name: "kirsikkatomaatit" }, { amount: 1, unit: "kpl", name: "avokado" }, { amount: 2, unit: "rkl", name: "ranch-kastike" }],
    ["Paista pekoni rapeaksi.", "Kokoa salaatti.", "Viipaloiti avokado, lisää kastike."],
    5, 8, 2, 460, 22, 5, 40),

  k("Schnitzel ilman leivitystä", "Rapea porsaanleike parmesaanikuorrutuksella", "porsas", "päivällinen",
    [{ amount: 400, unit: "g", name: "possun sisäfilee" }, { amount: 50, unit: "g", name: "parmesaani (raaste)" }, { amount: 1, unit: "kpl", name: "kananmuna" }, { amount: 2, unit: "rkl", name: "voi" }, { amount: 1, unit: "kpl", name: "sitruuna" }],
    ["Litistä liha ohuksi.", "Dippaile munaan, sitten parmesaaniin.", "Paista voissa kultaiseksi."],
    10, 10, 2, 440, 40, 2, 30),

  // =================== KALA (fish/seafood) ===================
  k("Lohi teriyaki-glaseerilla", "Pannulohi keto-teriyakilla", "kala", "päivällinen",
    [{ amount: 400, unit: "g", name: "lohifilee" }, { amount: 2, unit: "rkl", name: "soijakastike" }, { amount: 1, unit: "rkl", name: "seesamiöljy" }, { amount: 1, unit: "tl", name: "inkivääri" }, { amount: 200, unit: "g", name: "pak choi" }],
    ["Paista lohi nahkapuoli ensin.", "Glaseeraa soija-seesami-inkiväärillä.", "Tarjoile pak choin kanssa."],
    10, 12, 2, 480, 36, 4, 36),

  k("Katkarapu-avokadosalaatti", "Raikas katkarapusalaatti", "kala", "lounas",
    [{ amount: 300, unit: "g", name: "katkaravut" }, { amount: 2, unit: "kpl", name: "avokado" }, { amount: 1, unit: "kpl", name: "kurkku" }, { amount: 2, unit: "rkl", name: "sitruunamehu" }, { amount: 2, unit: "rkl", name: "oliiviöljy" }],
    ["Keitä katkaravut.", "Kuutioi avokado ja kurkku.", "Sekoita kastike. Kokoa."],
    10, 5, 2, 400, 28, 5, 32),

  k("Voissa paistettu kampela", "Kokonainen kampela yrttivoin kera", "kala", "päivällinen",
    [{ amount: 2, unit: "kpl", name: "kampelan filee" }, { amount: 50, unit: "g", name: "voi" }, { amount: 1, unit: "rkl", name: "kaprikset" }, { amount: 1, unit: "rkl", name: "persilja" }, { amount: 1, unit: "kpl", name: "sitruuna" }],
    ["Paista fileet voissa.", "Lisää kaprikset ja persilja voihin.", "Kaada kapris-voi kalan päälle."],
    5, 10, 2, 380, 30, 1, 28),

  k("Tonnikalatartar", "Tuoretta tonnikalaa aasialaisittain", "kala", "lounas",
    [{ amount: 300, unit: "g", name: "sashimi-tonnikala" }, { amount: 2, unit: "rkl", name: "soijakastike" }, { amount: 1, unit: "tl", name: "seesamiöljy" }, { amount: 1, unit: "kpl", name: "avokado" }, { amount: 1, unit: "tl", name: "wasabi" }],
    ["Kuutioi tonnikala.", "Sekoita soija, seesami ja wasabi.", "Marinoi 10min. Tarjoile avokadon kanssa."],
    15, 0, 2, 360, 34, 4, 24),

  k("Lohipiirakat (muna)", "Lohimunakkaat muffinipellillä", "kala", "aamiainen",
    [{ amount: 200, unit: "g", name: "savulohi" }, { amount: 6, unit: "kpl", name: "kananmuna" }, { amount: 100, unit: "g", name: "tuorejuusto" }, { amount: 1, unit: "rkl", name: "tilli" }],
    ["Vatkaa munat ja tuorejuusto.", "Jaa lohipalat muffinivuokiin.", "Kaada munamassa, paista 180°C 20min."],
    10, 20, 6, 250, 20, 1, 18),

  k("Kuhaa sitruunavoissa", "Pannupaistettua kuhaa", "kala", "päivällinen",
    [{ amount: 400, unit: "g", name: "kuhanfilee" }, { amount: 50, unit: "g", name: "voi" }, { amount: 1, unit: "kpl", name: "sitruuna" }, { amount: 200, unit: "g", name: "parsaa" }, { amount: 1, unit: "rkl", name: "kaprikset" }],
    ["Paista kuha voissa.", "Grillaa parsat.", "Tee sitruuna-kaprisvoi."],
    10, 12, 2, 400, 34, 3, 28),

  k("Katkarapu-curry", "Kermainen katkarapu-curry", "kala", "päivällinen",
    [{ amount: 400, unit: "g", name: "jättikatkarapu" }, { amount: 400, unit: "ml", name: "kookosmaito" }, { amount: 2, unit: "rkl", name: "currypaahto" }, { amount: 1, unit: "kpl", name: "chili" }, { amount: 100, unit: "g", name: "pinaatti" }],
    ["Paista katkaravut.", "Lisää currypaahto ja kookosmaito.", "Keitä 10min, lisää pinaatti."],
    10, 15, 4, 380, 28, 5, 28),

  k("Graavilohi", "Kotitekoinen graavilohi", "kala", "lounas",
    [{ amount: 400, unit: "g", name: "lohifilee" }, { amount: 3, unit: "rkl", name: "suola" }, { amount: 2, unit: "rkl", name: "sokeriton makeutusaine" }, { amount: 1, unit: "dl", name: "tilli" }, { amount: 2, unit: "rkl", name: "sinappi-tillikastike" }],
    ["Sekoita suola ja makeutusaine.", "Hiero loheen tillin kanssa.", "Graavaa jääkaapissa 24-48h. Viipalointi."],
    15, 0, 4, 280, 28, 1, 18),

  k("Sinisimpukat valkosipulikermassa", "Tuoreita simpukoita kermakastikkeessa", "kala", "päivällinen",
    [{ amount: 1, unit: "kg", name: "sinisimpukat" }, { amount: 2, unit: "dl", name: "kerma" }, { amount: 3, unit: "kynsi", name: "valkosipuli" }, { amount: 1, unit: "dl", name: "valkoviini" }, { amount: 1, unit: "rkl", name: "persilja" }],
    ["Puhdista simpukat.", "Keitä valkosipuli, viini ja kerma.", "Lisää simpukat, hauduta 5min kannen alla."],
    15, 10, 2, 380, 30, 6, 24),

  k("Makrillia ja coleslaw", "Grillattu makrilli hapankaali-coleslawlla", "kala", "lounas",
    [{ amount: 2, unit: "kpl", name: "makrillifilee" }, { amount: 200, unit: "g", name: "kaali (raastettuna)" }, { amount: 2, unit: "rkl", name: "majoneesi" }, { amount: 1, unit: "rkl", name: "omenaviinietikka" }, { amount: 1, unit: "tl", name: "sinappi" }],
    ["Grillaa makrillit.", "Sekoita coleslaw-ainekset.", "Tarjoile yhdessä."],
    10, 8, 2, 440, 30, 4, 34),
];
