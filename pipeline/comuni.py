"""
Terre di Comino Smart Land — 32 comuni (prov. Frosinone).
Per ogni comune: coordinate centroide (lat/lon WGS84) e quota media (m s.l.m.).
La quota serve al downscaling altimetrico (lapse-rate) perche' la griglia ERA5
a 0.25 deg raggruppa piu' comuni nella stessa cella.

Nota: i valori sono i centroidi amministrativi ufficiali approssimati. Verificare
con shapefile ISTAT in produzione (i centroidi qui sono adeguati per il lapse-rate
a scala di cella 0.25 deg ~ 25-28 km).
"""

# nome, lat, lon, quota_m
COMUNI = [
    # --- Valle di Comino (core) ---
    {"nome": "Alvito",                  "lat": 41.6913, "lon": 13.7430, "quota_m": 480},
    {"nome": "Atina",                   "lat": 41.6190, "lon": 13.8000, "quota_m": 490},
    {"nome": "Belmonte Castello",       "lat": 41.6440, "lon": 13.8300, "quota_m": 420},
    {"nome": "Campoli Appennino",       "lat": 41.7330, "lon": 13.6760, "quota_m": 650},
    {"nome": "Casalattico",             "lat": 41.6190, "lon": 13.7240, "quota_m": 412},
    {"nome": "Casalvieri",              "lat": 41.5930, "lon": 13.7470, "quota_m": 412},
    {"nome": "Fontechiari",             "lat": 41.6660, "lon": 13.6760, "quota_m": 412},
    {"nome": "Gallinaro",               "lat": 41.6520, "lon": 13.8270, "quota_m": 550},
    {"nome": "Picinisco",               "lat": 41.6470, "lon": 13.8780, "quota_m": 725},
    {"nome": "Pescosolido",             "lat": 41.7160, "lon": 13.6440, "quota_m": 632},
    {"nome": "Posta Fibreno",           "lat": 41.6920, "lon": 13.6840, "quota_m": 430},
    {"nome": "San Biagio Saracinisco",  "lat": 41.6420, "lon": 13.9510, "quota_m": 850},
    {"nome": "San Donato Val di Comino", "lat": 41.7000, "lon": 13.8200, "quota_m": 728},
    {"nome": "Settefrati",              "lat": 41.6670, "lon": 13.8700, "quota_m": 790},
    {"nome": "Vicalvi",                 "lat": 41.6850, "lon": 13.7170, "quota_m": 460},
    {"nome": "Villa Latina",            "lat": 41.6360, "lon": 13.8650, "quota_m": 500},
    # --- Media Valle del Liri / cintura ---
    {"nome": "Arpino",                  "lat": 41.6470, "lon": 13.6110, "quota_m": 450},
    {"nome": "Broccostella",            "lat": 41.7060, "lon": 13.6390, "quota_m": 290},
    {"nome": "Sora",                    "lat": 41.7170, "lon": 13.6150, "quota_m": 300},
    {"nome": "Isola del Liri",          "lat": 41.6770, "lon": 13.5710, "quota_m": 217},
    {"nome": "Fontana Liri",            "lat": 41.6210, "lon": 13.5390, "quota_m": 280},
    {"nome": "Santopadre",              "lat": 41.6080, "lon": 13.5660, "quota_m": 415},
    {"nome": "Colle San Magno",         "lat": 41.5300, "lon": 13.6500, "quota_m": 547},
    {"nome": "Roccasecca",              "lat": 41.5530, "lon": 13.6680, "quota_m": 235},
    {"nome": "Castrocielo",             "lat": 41.5170, "lon": 13.6900, "quota_m": 250},
    # --- Cassinate ---
    {"nome": "Cassino",                 "lat": 41.4890, "lon": 13.8310, "quota_m": 45},
    {"nome": "Sant'Elia Fiumerapido",   "lat": 41.5320, "lon": 13.8590, "quota_m": 110},
    {"nome": "Villa Santa Lucia",       "lat": 41.5000, "lon": 13.7720, "quota_m": 109},
    # --- Bassa cintura ovest ---
    {"nome": "Frosinone",               "lat": 41.6400, "lon": 13.3500, "quota_m": 291},
    {"nome": "Ripi",                    "lat": 41.6900, "lon": 13.4070, "quota_m": 350},
    {"nome": "Torrice",                 "lat": 41.6450, "lon": 13.4030, "quota_m": 320},
    {"nome": "Boville Ernica",          "lat": 41.6430, "lon": 13.4730, "quota_m": 333},
]

assert len(COMUNI) == 32, f"Attesi 32 comuni, trovati {len(COMUNI)}"

# Baseline climatica di riferimento per ogni comune (Tmedia annua media 1961-1990,
# usata come ancoraggio per il backcast quando mancano dati GRIB).
# Stimata da quota con gradiente standard a partire da una baseline di pianura.
T_BASELINE_PIANURA_1975 = 14.2  # degC a quota ~150 m, periodo 1961-1990
LAPSE_RATE = 6.5 / 1000.0       # degC per metro (6.5 degC / km)

def baseline_t(quota_m: float) -> float:
    """Temperatura media annua di riferimento (1961-1990) per quota."""
    return T_BASELINE_PIANURA_1975 - (quota_m - 150) * LAPSE_RATE
