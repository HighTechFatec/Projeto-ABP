// Lógica da conexão entre o ESP32 e o banco de dados:

/* 

ESP32  ↔  API (Node.js + Express)  ↔  PostgreSQL
                              ↑
                      App React Native

*/



// Teste Local:

/* Inserção de dados

    curl -X POST http://localhost:3000/api/dados \
     -H "Content-Type: application/json" \
     -d '{"temperatura": 25.5, "umidade": 62.1}'
 
*/

// Teste Real:

/* ESP32 

    const char* serverName = "http://<IP_DO_SEU_PC>:3000/api/dados";

*/


