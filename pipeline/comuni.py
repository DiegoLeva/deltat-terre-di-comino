"""
Distretto GAL Versante Laziale del PNA — 32 comuni (prov. Frosinone).
Per ogni comune: coordinate centroide (lat/lon WGS84) e quota media (m s.l.m.).
La quota serve al downscaling altimetrico (lapse-rate): la griglia ERA5/ERA5-Land
raggruppa più comuni nella stessa cella, quindi correggiamo per quota.
"""

# nome, lat, lon, quota_m   (coordinate centroidi ufficiali; quota stimata per lapse-rate)
COMUNI = [
    {"nome": "Acquafondata",                 "lat": 41.5439259, "lon": 13.9537592, "quota_m": 926},
    {"nome": "Alvito",                        "lat": 41.6919398, "lon": 13.7414529, "quota_m": 480},
    {"nome": "Aquino",                        "lat": 41.4922037, "lon": 13.7056296, "quota_m": 110},
    {"nome": "Arpino",                        "lat": 41.6484444, "lon": 13.6098703, "quota_m": 450},
    {"nome": "Atina",                         "lat": 41.6209240, "lon": 13.8011865, "quota_m": 490},
    {"nome": "Belmonte Castello",             "lat": 41.5775785, "lon": 13.8144235, "quota_m": 412},
    {"nome": "Boville Ernica",                "lat": 41.6427619, "lon": 13.4732421, "quota_m": 333},
    {"nome": "Campoli Appennino",             "lat": 41.7367222, "lon": 13.6847037, "quota_m": 650},
    {"nome": "Casalvieri",                    "lat": 41.6325931, "lon": 13.7149117, "quota_m": 412},
    {"nome": "Castelliri",                    "lat": 41.6793395, "lon": 13.5515014, "quota_m": 244},
    {"nome": "Castrocielo",                   "lat": 41.5293888, "lon": 13.6945555, "quota_m": 250},
    {"nome": "Cervaro",                       "lat": 41.4824920, "lon": 13.9051250, "quota_m": 145},
    {"nome": "Colle San Magno",               "lat": 41.5508639, "lon": 13.6940667, "quota_m": 547},
    {"nome": "Gallinaro",                     "lat": 41.6545291, "lon": 13.7978813, "quota_m": 550},
    {"nome": "Monte San Giovanni Campano",    "lat": 41.6401071, "lon": 13.5153739, "quota_m": 420},
    {"nome": "Picinisco",                     "lat": 41.6464138, "lon": 13.8677050, "quota_m": 725},
    {"nome": "Piedimonte San Germano",        "lat": 41.4973190, "lon": 13.7499240, "quota_m": 130},
    {"nome": "Pontecorvo",                    "lat": 41.4569200, "lon": 13.6664006, "quota_m": 60},
    {"nome": "Ripi",                          "lat": 41.6132913, "lon": 13.4267270, "quota_m": 350},
    {"nome": "Roccasecca",                    "lat": 41.5523518, "lon": 13.6681481, "quota_m": 235},
    {"nome": "Villa Santa Lucia",             "lat": 41.5130733, "lon": 13.7737459, "quota_m": 109},
    {"nome": "San Biagio Saracinisco",        "lat": 41.6132711, "lon": 13.9292369, "quota_m": 850},
    {"nome": "San Donato Val di Comino",      "lat": 41.7092407, "lon": 13.8136111, "quota_m": 728},
    {"nome": "Sant'Elia Fiumerapido",         "lat": 41.5400448, "lon": 13.8657389, "quota_m": 110},
    {"nome": "San Vittore del Lazio",         "lat": 41.4625000, "lon": 13.9337777, "quota_m": 188},
    {"nome": "Settefrati",                    "lat": 41.6700905, "lon": 13.8506426, "quota_m": 790},
    {"nome": "Strangolagalli",                "lat": 41.6006912, "lon": 13.4951328, "quota_m": 270},
    {"nome": "Terelle",                       "lat": 41.5528537, "lon": 13.7769080, "quota_m": 1050},
    {"nome": "Vallerotonda",                  "lat": 41.5519669, "lon": 13.9111780, "quota_m": 472},
    {"nome": "Veroli",                        "lat": 41.6905320, "lon": 13.4172760, "quota_m": 570},
    {"nome": "Vicalvi",                       "lat": 41.6779505, "lon": 13.7074773, "quota_m": 460},
    {"nome": "Villa Latina",                  "lat": 41.6152367, "lon": 13.8365717, "quota_m": 500},
]

assert len(COMUNI) == 32, f"Attesi 32 comuni, trovati {len(COMUNI)}"

# Baseline climatica indicativa (Tmedia annua 1961-1990) per quota, usata come
# ancoraggio del backcast quando mancano dati GRIB.
T_BASELINE_PIANURA_1975 = 14.2  # degC a quota ~150 m, periodo 1961-1990
LAPSE_RATE = 6.5 / 1000.0       # degC per metro (6.5 degC / km)

def baseline_t(quota_m: float) -> float:
    return T_BASELINE_PIANURA_1975 - (quota_m - 150) * LAPSE_RATE
