const { Communicate } = require('edge-tts-universal');
const fs = require('fs/promises');
const path = require('path');

const VOICE = 'en-US-RogerNeural'; // The library expands this to Microsoft Server Speech Text to Speech Voice (en-US, RogerNeural)

const COACH_SSML_TEMPLATES = [
  // Quote 1: "Usually the team that scores the most points wins the game! BOOM!"
  `__RAW_SSML__<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='Microsoft Server Speech Text to Speech Voice (en-US, RogerNeural)'><prosody pitch='-14%' rate='+4%'>Usually the team... that scores the most points... wins the game! ... BOOM!</prosody></voice></speak>`,

  // Quote 2: "If you can't run, you can't pass! And if you can't pass, you can't run! BOOM!"
  `__RAW_SSML__<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='Microsoft Server Speech Text to Speech Voice (en-US, RogerNeural)'><prosody pitch='-14%' rate='+4%'>If you can't run... you can't pass! ... And if you can't pass... you can't run! ... BOOM!</prosody></voice></speak>`,

  // Quote 3: "If a player doesn't draft well, it's gonna be a long season!"
  `__RAW_SSML__<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='Microsoft Server Speech Text to Speech Voice (en-US, RogerNeural)'><prosody pitch='-14%' rate='+4%'>If a player doesn't draft well... it's gonna be a... long, long season!</prosody></voice></speak>`,

  // Quote 4: "You got one quarterback, you got a quarterback. You got two, you don't have any! BOOM!"
  `__RAW_SSML__<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='Microsoft Server Speech Text to Speech Voice (en-US, RogerNeural)'><prosody pitch='-14%' rate='+4%'>You got one quarterback... you got a quarterback. ... You got two... you don't have any! ... BOOM!</prosody></voice></speak>`,

  // Quote 5: "There's only one way to win this thing, and that's to score more points than the other guy!"
  `__RAW_SSML__<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='Microsoft Server Speech Text to Speech Voice (en-US, RogerNeural)'><prosody pitch='-14%' rate='+4%'>There's only one way to win this thing... and that's to score more points... than the other guy!</prosody></voice></speak>`,

  // Quote 6: "The fewer mistakes you make, the better chance you have to win! That's football! BOOM!"
  `__RAW_SSML__<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='Microsoft Server Speech Text to Speech Voice (en-US, RogerNeural)'><prosody pitch='-14%' rate='+4%'>The fewer mistakes you make... the better chance you have to win! ... That's football! ... BOOM!</prosody></voice></speak>`
];

async function generateAll() {
  const audioDir = path.join(process.cwd(), 'assets', 'audio');
  
  // Ensure the assets/audio directory exists
  try {
    await fs.mkdir(audioDir, { recursive: true });
  } catch (err) {
    // Already exists or handles nicely
  }

  console.log(`Starting custom raw SSML voice synthesis via edge-tts-universal for ${COACH_SSML_TEMPLATES.length} quotes...`);

  for (let i = 0; i < COACH_SSML_TEMPLATES.length; i++) {
    const rawSsml = COACH_SSML_TEMPLATES[i];
    const fileName = `quote_${i + 1}.mp3`;
    const outputPath = path.join(audioDir, fileName);

    try {
      console.log(`Synthesizing Quote ${i + 1} with custom pacing and energetic accents...`);
      
      const communicate = new Communicate(rawSsml, { voice: VOICE });
      const audioChunks = [];

      for await (const chunk of communicate.stream()) {
        if (chunk.type === 'audio' && chunk.data) {
          audioChunks.push(chunk.data);
        }
      }

      if (audioChunks.length === 0) {
        throw new Error("No audio chunks received");
      }

      const fullAudio = Buffer.concat(audioChunks);
      await fs.writeFile(outputPath, fullAudio);
      console.log(`✅ Saved ${fileName} (${fullAudio.length} bytes)`);
    } catch (error) {
      console.error(`❌ Failed to synthesize Quote ${i + 1}:`, error);
    }
  }

  console.log('Voice synthesis completed!');
}

generateAll();
