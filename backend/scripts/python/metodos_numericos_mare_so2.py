"""
Metodos Numericos - Media SO2 por Intervalos de Mare
=====================================================
Replica a logica do script MATLAB (Curve Fitter):
  - parametro_id=1  -> SO2 (ug/m3)
  - parametro_id=3  -> Altura das mares (metros)
  - parametro_id=5  -> Direcao do vento (graus)
  - Filtra dados com vento de Sul (135 a 225 graus)
  - Calcula medias de SO2 em intervalos de 0.2m de mare (0.5m a 3.5m)
  - Exporta resultado como JSON para stdout (consumido pelo backend Node.js)
"""

import sys
import json

try:
    import mysql.connector
except ImportError:
    print(json.dumps({
        "ok": False,
        "error": "mysql-connector-python nao instalado. Execute: pip install mysql-connector-python"
    }))
    sys.exit(1)

# ── Configuracao da ligacao ──────────────────────────────────────────────────
DB_CONFIG = {
    "host":     "localhost",
    "user":     "root",
    "password": "1234",
    "database": "minha_base",
}

# ── IDs dos parametros (confirmados na BD) ───────────────────────────────────
PARAM_SO2       = 1   # Dioxido de Enxofre (ug/m3)
PARAM_MARE      = 3   # Altura das mares (metros)
PARAM_VENTO_DIR = 5   # Direcao do vento (graus)

# ── Query: SO2, mare e direcao do vento com o mesmo data_utc ────────────────
QUERY = """
SELECT
    so2.valor   AS so2,
    mare.valor  AS mare,
    vento.valor AS vento_dir
FROM indicador AS so2
JOIN indicador AS mare
    ON so2.data_utc = mare.data_utc
JOIN indicador AS vento
    ON so2.data_utc = vento.data_utc
WHERE
    so2.parametro_id   = %s
    AND mare.parametro_id  = %s
    AND vento.parametro_id = %s
    AND so2.data_utc   IS NOT NULL
    AND so2.valor      IS NOT NULL
    AND mare.valor     IS NOT NULL
    AND vento.valor    IS NOT NULL
"""

def run():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        cursor.execute(QUERY, (PARAM_SO2, PARAM_MARE, PARAM_VENTO_DIR))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
    except Exception as e:
        print(json.dumps({"ok": False, "error": f"Erro na ligacao MySQL: {str(e)}"}))
        sys.exit(1)

    total_registos = len(rows)

    # ── Filtro: vento de Sul (135 a 225 graus) ──────────────────────────────
    filtrados = [
        r for r in rows
        if r["vento_dir"] is not None
        and 135.0 <= float(r["vento_dir"]) <= 225.0
        and r["mare"] is not None
        and r["so2"]  is not None
    ]

    total_filtrados = len(filtrados)

    if not filtrados:
        print(json.dumps({
            "ok": True,
            "fonte": "simulado",
            "total_registos_bd": total_registos,
            "total_vento_sul": 0,
            "aviso": f"Nenhum registo com vento de Sul (135-225 graus) encontrado entre {total_registos} registos. A mostrar dados simulados.",
            "pontos": gerar_dados_simulados()
        }))
        return

    # ── Binned Averages: intervalos de 0.2m entre 0.5m e 3.5m ──────────────
    PASSO  = 0.2
    INICIO = 0.5
    FIM    = 3.5
    n_bins = round((FIM - INICIO) / PASSO)

    edges   = [round(INICIO + i * PASSO, 4) for i in range(n_bins + 1)]
    centros = [round((edges[i] + edges[i + 1]) / 2, 4) for i in range(n_bins)]

    pontos = []
    for i in range(n_bins):
        e_min = edges[i]
        e_max = edges[i + 1]
        bin_vals = [
            float(r["so2"])
            for r in filtrados
            if e_min <= float(r["mare"]) < e_max
        ]
        if bin_vals:
            media = sum(bin_vals) / len(bin_vals)
            pontos.append({
                "x": centros[i],
                "y": round(media, 4),
                "n": len(bin_vals)
            })

    print(json.dumps({
        "ok":                 True,
        "fonte":              "base_de_dados",
        "total_registos_bd":  total_registos,
        "total_vento_sul":    total_filtrados,
        "bins_com_dados":     len(pontos),
        "pontos":             pontos
    }))


def gerar_dados_simulados():
    """Fallback de dados simulados realistas (tendencia inversa: mare alta = SO2 menor)."""
    import random
    random.seed(42)
    PASSO  = 0.2
    INICIO = 0.5
    FIM    = 3.5
    n_bins = round((FIM - INICIO) / PASSO)
    edges  = [round(INICIO + i * PASSO, 4) for i in range(n_bins + 1)]
    centros = [round((edges[i] + edges[i + 1]) / 2, 4) for i in range(n_bins)]
    pontos = []
    for centro in centros:
        base = 80 - (centro - 0.5) * 18 + random.gauss(0, 4)
        base = max(10, base)
        pontos.append({"x": centro, "y": round(base, 2), "n": random.randint(5, 40)})
    return pontos


if __name__ == "__main__":
    run()
