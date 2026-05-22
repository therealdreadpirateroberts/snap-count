const { Communicate } = require('edge-tts-universal');

async function test(ssml, label) {
  try {
    console.log(`Testing ${label}...`);
    const communicate = new Communicate("__RAW_SSML__" + ssml, { voice: 'en-US-RogerNeural' });
    const audioChunks = [];
    for await (const chunk of communicate.stream()) {
      if (chunk.type === 'audio' && chunk.data) {
        audioChunks.push(chunk.data);
      }
    }
    console.log(`✅ Success for ${label}! Received ${audioChunks.length} chunks.`);
    return true;
  } catch (error) {
    console.error(`❌ Failed for ${label}:`, error.message);
    return false;
  }
}

async function runTests() {
  const VOICE = 'Microsoft Server Speech Text to Speech Voice (en-US, RogerNeural)';

  // Test A: break with no attributes
  const ssmlA = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${VOICE}'><prosody pitch='-14%' rate='+4%'>Usually the team <break/> that scores the most points wins the game!</prosody></voice></speak>`;
  await test(ssmlA, "Break no attributes");

  // Test B: break with double quotes seconds
  const ssmlB = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${VOICE}'><prosody pitch='-14%' rate='+4%'>Usually the team <break time="1s"/> that scores the most points wins the game!</prosody></voice></speak>`;
  await test(ssmlB, "Break time double quotes 1s");

  // Test C: break with single quotes ms
  const ssmlC = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${VOICE}'><prosody pitch='-14%' rate='+4%'>Usually the team <break time='200ms'/> that scores the most points wins the game!</prosody></voice></speak>`;
  await test(ssmlC, "Break time single quotes 200ms");

  // Test D: break with no space before slash
  const ssmlD = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${VOICE}'><prosody pitch='-14%' rate='+4%'>Usually the team <break time="500ms"/> that scores the most points wins the game!</prosody></voice></speak>`;
  await test(ssmlD, "Break time double quotes 500ms");

  // Test E: punctuation only (commas, ellipsis, periods) for pacing
  const ssmlE = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${VOICE}'><prosody pitch='-14%' rate='+4%'>Usually the team... that scores the most points, wins the game! ... BOOM!</prosody></voice></speak>`;
  await test(ssmlE, "Punctuation only");
}

runTests();
