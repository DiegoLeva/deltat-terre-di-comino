"""
Distretto GAL Versante Laziale del PNA — 32 comuni (prov. Frosinone).
Per ogni comune: coordinate centroide (lat/lon WGS84) e quota media (m s.l.m.).
La quota serve al downscaling altimetrico (lapse-rate): la griglia ERA5/ERA5-Land
raggruppa più comuni nella stessa cella, quindi correggiamo per quota.
"""

# nome, lat, lon, quota_m
COMUNI = [
    {"nome": "Acquafondata",                 "lat": 41.5500, "lon": 13.9650, "quota_m": 926},
    {"nome": "Alvito",                        "lat": 41.6913, "lon": 13.7430, "quota_m": 480},
    {"nome": "Aquino",                        "lat": 41.4930, "lon": 13.6990, "quota_m": 110},
    {"nome": "Arpino",                        "lat": 41.6470, "lon": 13.6110, "quota_m": 450},
    {"nome": "Atina",                         "lat": 41.6190, "lon": 13.8000, "quota_m": 490},
    {"nome": "Belmonte Castello",             "lat": 41.6440, "lon": 13.8300, "quota_m": 412},
    {"nome": "Boville Ernica",                "lat": 41.6430, "lon": 13.4730, "quota_m": 333},
    {"nome": "Campoli Appennino",             "lat": 41.7330, "lon": 13.6760, "quota_m": 650},
    {"nome": "Casalvieri",                    "lat": 41.5930, "lon": 13.7470, "quota_m": 412},
    {"nome": "Castelliri",                    "lat": 41.6920, "lon": 13.5550, "quota_m": 244},
    {"nome": "Castrocielo",                   "lat": 41.5170, "lon": 13.6900, "quota_m": 250},
    {"nome": "Cervaro",                       "lat": 41.4810, "lon": 13.8330, "quota_m": 145},
    {"nome": "Colle San Magno",               "lat": 41.5300, "lon": 13.6500, "quota_m": 547},
    {"nome": "Gallinaro",                     "lat": 41.6520, "lon": 13.8270, "quota_m": 550},
    {"nome": "Monte San Giovanni Campano",    "lat": 41.6330, "lon": 13.5130, "quota_m": 420},
    {"nome": "Picinisco",                     "lat": 41.6470, "lon": 13.8780, "quota_m": 725},
    {"nome": "Piedimonte San Germano",        "lat": 41.4920, "lon": 13.7560, "quota_m": 130},
    {"nome": "Pontecorvo",                    "lat": 41.4580, "lon": 13.6680, "quota_m": 60},
    {"nome": "Ripi",                          "lat": 41.6900, "lon": 13.4070, "quota_m": 350},
    {"nome": "Roccasecca",                    "lat": 41.5530, "lon": 13.6680, "quota_m": 235},
    {"nome": "Villa Santa Lucia",             "lat": 41.5000, "lon": 13.7720, "quota_m": 109},
    {"nome": "San Biagio Saracinisco",        "lat": 41.6420, "lon": 13.9510, "quota_m": 850},
    {"nome": "San Donato Val di Comino",      "lat": 41.7000, "lon": 13.8200, "quota_m": 728},
    {"nome": "Sant'Elia Fiumerapido",         "lat": 41.5320, "lon": 13.8590, "quota_m": 110},
    {"nome": "San Vittore del Lazio",         "lat": 41.4640, "lon": 13.9330, "quota_m": 188},
    {"nome": "Settefrati",                    "lat": 41.6670, "lon": 13.8700, "quota_m": 790},
    {"nome": "Strangolagalli",                "lat": 41.6500, "lon": 13.4530, "quota_m": 270},
    {"nome": "Terelle",                       "lat": 41.5500, "lon": 13.6600, "quota_m": 880},
    {"nome": "Vallerotonda",                  "lat": 41.5520, "lon": 13.9200, "quota_m": 472},
    {"nome": "Veroli",                        "lat": 41.6920, "lon": 13.4180, "quota_m": 570},
    {"nome": "Vicalvi",                       "lat": 41.6850, "lon": 13.7170, "quota_m": 460},
    {"nome": "Villa Latina",                  "lat": 41.6360, "lon": 13.8650, "quota_m": 500},
]

assert len(COMUNI) == 32, f"Attesi 32 comuni, trovati {len(COMUNI)}"

# Baseline climatica indicativa (Tmedia annua 1961-1990) per quota, usata come
# ancoraggio del backcast quando mancano dati GRIB.
T_BASELINE_PIANURA_1975 = 14.2  # degC a quota ~150 m, periodo 1961-1990
LAPSE_RATE = 6.5 / 1000.0       # degC per metro (6.5 degC / km)

def baseline_t(quota_m: float) -> float:
    return T_BASELINE_PIANURA_1975 - (quota_m - 150) * LAPSE_RATE
