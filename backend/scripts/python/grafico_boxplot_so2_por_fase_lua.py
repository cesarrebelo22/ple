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

# 2. Valores de SO2 por fase da lua
query = """
SELECT
    f.nome AS Fase_Lua,
    i.valor AS SO2
FROM Indicador i
JOIN fase_da_lua f ON i.fase_lua_id = f.id
WHERE i.parametro_id = 1
"""

# 3. Carregar dados para DataFrame
df = pd.read_sql(query, conexao)

# 4. Fechar ligacao
conexao.close()

# 5. Boxplot por fase
plt.figure(figsize=(10, 5))
sns.boxplot(data=df, x="Fase_Lua", y="SO2", palette="Blues")

plt.title("Distribuicao de SO2 por Fase da Lua", fontsize=14)
plt.xlabel("Fase da Lua", fontsize=12)
plt.ylabel("SO2", fontsize=12)
plt.grid(axis="y", linestyle="--", alpha=0.5)

plt.tight_layout()
plt.show()
