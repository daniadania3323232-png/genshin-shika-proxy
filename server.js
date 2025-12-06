// Простой прокси сервер для Shika
const http = require('http');
const net = require('net');
const url = require('url');

console.log('🚀 Shika Cloud Proxy запускается...');

const server = http.createServer((req, res) => {
  // Проверка работы
  if (req.url === '/test') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Shika Proxy is working! F1-F4 in game\n');
    return;
  }
  
  // Меню читов
  if (req.url === '/menu') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h1>🎮 Shika Cloud Cheats</h1>
      <p>Сервер работает! Настрой прокси на этот адрес.</p>
      <p>В игре нажимай:</p>
      <ul>
        <li>F1 - God Mode</li>
        <li>F2 - No Cooldown</li>
        <li>F3 - Unlimited Stamina</li>
        <li>F4 - Auto Farm</li>
      </ul>
    `);
    return;
  }
  
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Shika Proxy Server\n');
});

server.on('connect', (req, clientSocket, head) => {
  // Проксирование HTTPS трафика
  const { port, hostname } = url.parse(`https://${req.url}`);
  
  const serverSocket = net.connect(port || 443, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
  
  serverSocket.on('error', (err) => {
    console.error('Proxy error:', err);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
  console.log(`🌐 URL: https://ВАШ-РЕПО.herokuapp.com`);
});
