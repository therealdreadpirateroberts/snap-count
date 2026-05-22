const { Communicate } = require('edge-tts-universal');

async function run() {
  const VOICE = 'Microsoft Server Speech Text to Speech Voice (en-US, RogerNeural)';
  const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${VOICE}'><prosody pitch='-14Hz' rate='+4%'>Usually the team that scores the most points wins the game! <break time='180ms'/> BOOM!</prosody></voice></speak>`;

  try {
    console.log("Starting simple SSML test...");
    const communicate = new Communicate("__RAW_SSML__" + ssml, { voice: 'en-US-RogerNeural' });
    const audioChunks = [];
    for await (const chunk of communicate.stream()) {
      if (chunk.type === 'audio' && chunk.data) {
        audioChunks.push(chunk.data);
      }
    }
    console.log(`✅ Success! Received ${audioChunks.length} audio chunks.`);
  } catch (err) {
    console.error("❌ Failed:", err.message);
  }
}

run();
