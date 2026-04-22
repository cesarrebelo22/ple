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

# 2. Distribuicao de SO2 (parametro_id = 1)
query = """
SELECT
    i.valor AS SO2
FROM Indicador i
WHERE i.parametro_id = 1
"""

# 3. Carregar dados para DataFrame
df = pd.read_sql(query, conexao)

# 4. Fechar ligacao
conexao.close()

# 5. Histograma com curva KDE
plt.figure(figsize=(9, 5))
sns.histplot(data=df, x="SO2", bins=20, kde=True, color="steelblue")

plt.title("Distribuicao de Concentracao de SO2", fontsize=14)
plt.xlabel("SO2", fontsize=12)
plt.ylabel("Frequencia", fontsize=12)
plt.grid(axis="y", linestyle="--", alpha=0.5)

plt.tight_layout()
plt.show()
