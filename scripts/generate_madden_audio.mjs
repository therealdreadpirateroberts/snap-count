import { UniversalEdgeTTS } from 'edge-tts-universal';
import { promises as fs } from 'fs';
import path from 'path';

const COACH_QUOTES = [
  "Usually the team that scores the most points wins the game! BOOM!",
  "If you can't run, you can't pass! And if you can't pass, you can't run! BOOM!",
  "If a player doesn't draft well, it's gonna be a long season!",
  "You got one quarterback, you got a quarterback. You got two, you don't have any! BOOM!",
  "There's only one way to win this thing, and that's to score more points than the other guy!",
  "The fewer mistakes you make, the better chance you have to win! That's football! BOOM!"
];

// Deep, energetic, mature male voice - en-US-AndrewNeural is very rich and masculine
const VOICE = 'en-US-AndrewNeural'; 

async function generateAll() {
  const audioDir = path.join(process.cwd(), 'assets', 'audio');
  
  // Ensure the assets/audio directory exists
  try {
    await fs.mkdir(audioDir, { recursive: true });
  } catch (err) {
    // Already exists or can't create
  }

  console.log(`Starting voice synthesis for ${COACH_QUOTES.length} quotes using ${VOICE}...`);

  for (let i = 0; i < COACH_QUOTES.length; i++) {
    const text = COACH_QUOTES[i];
    const fileName = `quote_${i + 1}.mp3`;
    const outputPath = path.join(audioDir, fileName);

    try {
      console.log(`Synthesizing Quote ${i + 1}: "${text}"`);
      const tts = new UniversalEdgeTTS(text, VOICE);
      const result = await tts.synthesize();

      const audioBuffer = Buffer.from(await result.audio.arrayBuffer());
      await fs.writeFile(outputPath, audioBuffer);
      console.log(`✅ Saved ${fileName}`);
    } catch (error) {
      console.error(`❌ Failed to synthesize Quote ${i + 1}:`, error);
    }
  }

  console.log('Voice synthesis completed!');
}

generateAll();
