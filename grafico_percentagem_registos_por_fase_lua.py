import pandas as pd
import mysql.connector
import matplotlib.pyplot as plt

# 1. Ligacao ao MySQL local
conexao = mysql.connector.connect(
    host="localhost",
    user="root",            # Ajusta se necessario
    password="1234",        # Ajusta se necessario
    database="minha_base"
)

# 2. Percentagem de registos SO2 por fase da lua
query = """
SELECT
    f.nome AS Fase_Lua,
    COUNT(*) AS Total_Registos
FROM Indicador i
JOIN fase_da_lua f ON i.fase_lua_id = f.id
WHERE i.parametro_id = 1
GROUP BY f.nome
ORDER BY Total_Registos DESC
"""

# 3. Carregar dados para DataFrame
df = pd.read_sql(query, conexao)

# 4. Fechar ligacao
conexao.close()

# 5. Grafico circular
plt.figure(figsize=(7, 7))
plt.pie(
    df["Total_Registos"],
    labels=df["Fase_Lua"],
    autopct="%1.1f%%",
    startangle=90,
)

plt.title("Percentagem de Registos de SO2 por Fase da Lua", fontsize=14)
plt.tight_layout()
plt.show()
