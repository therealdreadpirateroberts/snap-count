const fs = require('fs');
const path = require('path');

const ELEVENLABS_API_KEY = process.env.ELEVEN_API_KEY || 'YOUR_API_KEY_HERE';
const BILL_OXLEY_VOICE_ID = 'iiidtqDt9FBdT1vfBluA';
const WELCOME_QUOTE = "Welcome to MockMaxxing, brother! Where every Sunday, thunder rains down and only one team walks out standing tall!";

async function generateWelcome() {
  if (ELEVENLABS_API_KEY === 'YOUR_API_KEY_HERE') {
    console.error('❌ Error: Please set your ELEVEN_API_KEY environment variable.');
    process.exit(1);
  }

  const audioDir = path.join(__dirname, '..', 'assets', 'audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  const outputPath = path.join(audioDir, 'welcome.mp3');
  console.log(`🎙️ Synthesizing welcome audio using Bill Oxley (Voice ID: ${BILL_OXLEY_VOICE_ID})...`);

  try {
    const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${BILL_OXLEY_VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: WELCOME_QUOTE,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.35,
          similarity_boost: 0.85,
          style: 0.55,
          use_speaker_boost: true
        }
      })
    });

    if (!ttsRes.ok) {
      const errText = await ttsRes.text();
      throw new Error(`TTS synthesis failed with status ${ttsRes.status}: ${errText}`);
    }

    const arrayBuffer = await ttsRes.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
    console.log(`\n🏆 Welcome quote generated successfully and saved to assets/audio/welcome.mp3 (${arrayBuffer.byteLength} bytes)!`);
  } catch (error) {
    console.error('❌ Error synthesizing welcome:', error.message);
  }
}

generateWelcome();
