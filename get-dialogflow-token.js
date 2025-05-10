const { GoogleAuth } = require('google-auth-library');
const path = require('path');

// Reemplaza con la ruta a tu archivo JSON
const KEYFILE_PATH = path.join(__dirname, 'tu-archivo.json');

const auth = new GoogleAuth({
  keyFile: KEYFILE_PATH,
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

async function getAccessToken() {
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  console.log('\n🔑 Token generado:\n');
  console.log(`Bearer ${tokenResponse.token}\n`);
}

getAccessToken().catch(console.error);
