"""
_grib_env.py
Bootstrap ecCodes su Windows / Python recenti.

Il wheel `eccodes` non sempre include il binario nativo; `ecmwflibs` fornisce
`eccodes.dll` ma `findlibs` cerca `libeccodes.dll` in `$ECCODES_HOME/lib`.
Questo modulo, importato PRIMA di `eccodes`/`cfgrib`, sistema l'ambiente:
  - aggiunge la dir di ecmwflibs alla ricerca DLL (dipendenze),
  - crea una copia `libeccodes.dll` col nome atteso,
  - imposta ECCODES_HOME cosi' findlibs la trova.

Su Linux/conda (es. ambiente CI) non fa nulla di dannoso: se ecmwflibs non c'e',
si affida all'ecCodes di sistema.
"""
import os
import shutil


def setup() -> None:
    try:
        import ecmwflibs
    except ImportError:
        return  # ecCodes di sistema / conda: niente da fare

    src = ecmwflibs.find("eccodes")
    if not src or not os.path.exists(src):
        return

    libdir = os.path.dirname(src)
    if hasattr(os, "add_dll_directory"):
        try:
            os.add_dll_directory(libdir)
        except OSError:
            pass

    home = os.path.join(libdir, "_eccodes_home")
    target_dir = os.path.join(home, "lib")
    os.makedirs(target_dir, exist_ok=True)
    target = os.path.join(target_dir, "libeccodes.dll")
    if not os.path.exists(target):
        shutil.copy2(src, target)

    os.environ.setdefault("ECCODES_HOME", home)


setup()
