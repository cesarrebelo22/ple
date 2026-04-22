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

# 2. Media por parametro_id
query = """
SELECT
    i.parametro_id AS Parametro,
    AVG(i.valor) AS Media_Valor
FROM Indicador i
GROUP BY i.parametro_id
ORDER BY Media_Valor DESC
"""

# 3. Carregar dados para DataFrame
df = pd.read_sql(query, conexao)

# 4. Fechar ligacao
conexao.close()

# 5. Grafico de barras
plt.figure(figsize=(9, 5))
sns.barplot(data=df, x="Parametro", y="Media_Valor", palette="viridis")

plt.title("Media de Valor por Parametro", fontsize=14)
plt.xlabel("Parametro ID", fontsize=12)
plt.ylabel("Media", fontsize=12)
plt.grid(axis="y", linestyle="--", alpha=0.6)

plt.tight_layout()
plt.show()
