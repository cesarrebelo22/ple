import pandas as pd
import mysql.connector
import matplotlib.pyplot as plt
import seaborn as sns

# 1. Estabelecer a ligação ao MySQL local
conexao = mysql.connector.connect(
    host="localhost",
    user="root",             # Substitui pelo teu utilizador do MySQL
    password="1234", # Substitui pela tua password
    database="minha_base"
)

# 2. Escrever a Query SQL exatamente como fazes no Workbench
query = """
SELECT 
    f.nome AS Fase_Lua, 
    AVG(i.valor) AS Media_SO2
FROM Indicador i
JOIN fase_da_lua f ON i.fase_lua_id = f.id
WHERE i.parametro_id = 1
GROUP BY f.nome
ORDER BY Media_SO2 DESC
"""

# 3. Executar a query e carregar os dados para o Pandas
df = pd.read_sql(query, conexao)

# 4. Fechar a ligação por segurança
conexao.close()

# 5. Criar o Gráfico com Seaborn/Matplotlib
plt.figure(figsize=(8, 5))
sns.barplot(data=df, x='Fase_Lua', y='Media_SO2', palette='Blues_r')

plt.title('Média de Concentração de SO2 por Fase da Lua', fontsize=14)
plt.xlabel('Fase da Lua', fontsize=12)
plt.ylabel('Concentração SO2', fontsize=12)
plt.grid(axis='y', linestyle='--', alpha=0.7)

# Mostrar o gráfico no ecrã
plt.show()