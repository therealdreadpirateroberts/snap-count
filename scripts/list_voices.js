const ELEVENLABS_API_KEY = process.env.ELEVEN_API_KEY || 'YOUR_API_KEY_HERE';

async function listVoices() {
  console.log('🔗 Fetching custom voices from your ElevenLabs account...');
  try {
    const res = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to list voices with status ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const customVoices = data.voices;
    
    console.log('\n🎙️ --- YOUR FULL ELEVENLABS VOICE LIBRARY ---');
    if (customVoices.length === 0) {
      console.log('No voices found in your account.');
    } else {
      customVoices.forEach(v => {
        console.log(`- Name: "${v.name}" | Voice ID: ${v.voice_id} | Category: ${v.category}`);
      });
    }
    console.log('--------------------------------------------\n');
  } catch (error) {
    console.error('❌ Error listing voices:', error.message);
  }
}

listVoices();
