const fs = require('fs');
const path = require('path');

const ELEVENLABS_API_KEY = process.env.ELEVEN_API_KEY || 'YOUR_API_KEY_HERE';

const COACH_QUOTES = [
  "Usually the team that scores the most points wins the game! BOOM!",
  "If you can't run, you can't pass! And if you can't pass, you can't run! BOOM!",
  "If a player doesn't draft well, it's gonna be a long season!",
  "You got one quarterback, you got a quarterback. You got two, you don't have any! BOOM!",
  "There's only one way to win this thing, and that's to score more points than the other guy!",
  "The fewer mistakes you make, the better chance you have to win! That's football! BOOM!"
];

const TARGET_VOICE = { name: 'Bill Oxley', id: 'iiidtqDt9FBdT1vfBluA' };

async function generateMockMaxxingVoices() {
  if (ELEVENLABS_API_KEY === 'YOUR_API_KEY_HERE') {
    console.error('❌ Error: Please set your ELEVEN_API_KEY environment variable or edit the script with your API key.');
    console.log('\nYou can run the script from your terminal like this:');
    console.log('  $env:ELEVEN_API_KEY="your-api-key-here"; node scripts/clone_and_generate.js');
    process.exit(1);
  }

  const audioDir = path.join(__dirname, '..', 'assets', 'audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  console.log(`🎙️ Starting voice synthesis for ${COACH_QUOTES.length} quotes using ${TARGET_VOICE.name}...`);
  
  try {
    for (let i = 0; i < COACH_QUOTES.length; i++) {
      const quote = COACH_QUOTES[i];
      const fileName = `quote_${i + 1}.mp3`;
      const outputPath = path.join(audioDir, fileName);

      console.log(`Synthesizing Quote ${i + 1}/${COACH_QUOTES.length} using ${TARGET_VOICE.name} (ID: ${TARGET_VOICE.id})...`);

      const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${TARGET_VOICE.id}`, {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: quote,
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
        throw new Error(`TTS synthesis failed for quote ${i + 1} with voice ${TARGET_VOICE.name}: ${errText}`);
      }

      const arrayBuffer = await ttsRes.arrayBuffer();
      fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
      console.log(`✅ Saved ${fileName} using ${TARGET_VOICE.name} (${arrayBuffer.byteLength} bytes)`);
    }

    console.log('\n🏆 Premium coach voice synthesis completed successfully!');
  } catch (error) {
    console.error('\n❌ Error during synthesis:', error.message);
  }
}

generateMockMaxxingVoices();
