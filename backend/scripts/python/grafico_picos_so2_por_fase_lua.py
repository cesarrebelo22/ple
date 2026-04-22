import pandas as pd
import mysql.connector
import matplotlib.pyplot as plt
import seaborn as sns

# 1. Ligacao ao MySQL local
conexao = mysql.connector.connect(
    host="localhost",
    user="root",            # Ajusta se necessario
    password="1234",        # Ajusta se necessario
    database="minha_base"
)

# 2. Pico (MAX) de SO2 por fase da lua
query = """
SELECT
    f.nome AS Fase_Lua,
    MAX(i.valor) AS Pico_SO2
FROM Indicador i
JOIN fase_da_lua f ON i.fase_lua_id = f.id
WHERE i.parametro_id = 1
GROUP BY f.nome
ORDER BY Pico_SO2 DESC
"""

# 3. Carregar dados para DataFrame
df = pd.read_sql(query, conexao)

# 4. Fechar ligacao
conexao.close()

# 5. Grafico de barras horizontal
plt.figure(figsize=(9, 5))
sns.barplot(data=df, y="Fase_Lua", x="Pico_SO2", palette="mako")

plt.title("Picos de SO2 por Fase da Lua", fontsize=14)
plt.xlabel("Pico de SO2", fontsize=12)
plt.ylabel("Fase da Lua", fontsize=12)
plt.grid(axis="x", linestyle="--", alpha=0.5)

plt.tight_layout()
plt.show()
