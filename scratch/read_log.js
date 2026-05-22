const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\loubr\\.gemini\\antigravity\\brain\\a47d10da-590a-48ac-957c-75d0e7def1f8\\.system_generated\\logs\\transcript.jsonl';

async function run() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  console.log("Searching user messages and video/notes mentions...\n");
  let index = 0;
  for await (const line of rl) {
    index++;
    try {
      const obj = JSON.parse(line);
      // Let's check if it's a USER_INPUT or contains drive link or video/notes keywords
      const isUserInput = obj.type === 'USER_INPUT' || obj.source === 'USER_EXPLICIT';
      const text = obj.content || '';
      const hasKeywords = text.includes('1n32d6O7e9Z54oRa7gSuUZUCj9kQH8o4_') || text.toLowerCase().includes('video') || text.toLowerCase().includes('notes');
      
      if (isUserInput || hasKeywords) {
        console.log(`[Step ${obj.step_index || index}] Source: ${obj.source} | Type: ${obj.type}`);
        console.log(`Content: ${text}\n`);
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
}

run();
