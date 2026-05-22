// intercept module loading to mock react-native and expo-file-system
const moduleAlias = require('module');
const originalRequire = moduleAlias.prototype.require;
moduleAlias.prototype.require = function(path) {
  if (path === 'react-native') {
    return {
      Platform: { OS: 'web' }
    };
  }
  if (path === 'expo-file-system') {
    return {
      documentDirectory: './dist_temp/'
    };
  }
  return originalRequire.apply(this, arguments);
};

console.log('🚀 Initializing draft store test...');

const { useMockMaxxingStore, getTeamIndexForPick, getUserTeamName } = require('../dist_temp/src/store/useMockMaxxingStore.js');

const store = useMockMaxxingStore;

// Initialize state
console.log('📦 Starting draft...');
store.getState().startDraft();

console.log('Initial draftStatus:', store.getState().draftStatus);
console.log('Initial currentPick:', store.getState().currentPick);
console.log('User Team Name:', getUserTeamName());

// Get available players
const available = store.getState().players.filter(p => !p.draftedBy);
console.log('Available players count:', available.length);
if (available.length === 0) {
  console.error('❌ No players available!');
  process.exit(1);
}

const firstPlayer = available[0];
console.log(`Selecting first player to draft: ${firstPlayer.name} (Rank: ${firstPlayer.rank}, Position: ${firstPlayer.position})`);

// Calculate active team index for pick 1
const initialPick = store.getState().currentPick;
const initialTeamIdx = getTeamIndexForPick(initialPick, store.getState().setup.leagueSize, store.getState().setup.draftType);
console.log('Initial activeTeamIdx:', initialTeamIdx);

// Draft the first player for the user
console.log(' Drafting player...');
try {
  store.getState().draftPlayer(firstPlayer.rank, initialTeamIdx, getUserTeamName());
} catch (err) {
  console.error('❌ Error during draftPlayer:', err);
  process.exit(1);
}

console.log('Draft player call completed.');
console.log('New currentPick:', store.getState().currentPick);
console.log('New draftStatus:', store.getState().draftStatus);

// Check user roster
const userRoster = store.getState().players.filter(p => p.draftedBy === getUserTeamName());
console.log('User roster count:', userRoster.length);
if (userRoster.length > 0) {
  console.log('User roster:', userRoster.map(p => `${p.name} (${p.position})`).join(', '));
} else {
  console.error('❌ User roster is empty after draft!');
}

// Now we need to simulate the CPU turns.
// Since simulateCpuTurn has a setTimeout of 450ms, we should poll the store status.
console.log('🤖 Starting CPU turn simulation...');

function onUserTurnReached() {
  console.log('🎉 onUserTurnReached callback triggered!');
  console.log('Current pick:', store.getState().currentPick);
  console.log('Draft status:', store.getState().draftStatus);
  console.log('Is user turn now?');
  const activeIdx = getTeamIndexForPick(store.getState().currentPick, store.getState().setup.leagueSize, store.getState().setup.draftType);
  console.log(`Active team index: ${activeIdx}, User position index: ${store.getState().setup.userPosition - 1}`);
  if (activeIdx === store.getState().setup.userPosition - 1) {
    console.log('✅ Yes! It is the user\'s turn again.');
    console.log('Draft History length:', store.getState().draftHistory.length);
    console.log('All drafted players so far:', store.getState().draftHistory.map(h => `${h.pickNumber}. ${h.teamName} -> ${h.player.name} (${h.player.position})`).join('\n'));
    process.exit(0);
  } else {
    console.error('❌ No! It is NOT the user\'s turn.');
  }
}

// Emulate React's useEffect hook that triggers simulateCpuTurn when currentPick changes and it's CPU's turn
function checkCpuTrigger() {
  const state = store.getState();
  const activeIdx = getTeamIndexForPick(state.currentPick, state.setup.leagueSize, state.setup.draftType);
  const isUserTurn = activeIdx === state.setup.userPosition - 1;
  
  if (state.draftStatus === 'drafting' && !isUserTurn) {
    if (!state.cpuIsThinking) {
      console.log(`[Effect Emulation] Triggering CPU turn for pick ${state.currentPick} (Team Index: ${activeIdx})`);
      try {
        state.simulateCpuTurn(onUserTurnReached);
      } catch (err) {
        console.error('❌ Error inside simulateCpuTurn:', err);
        process.exit(1);
      }
    }
  }
}

// Run polling to check store state changes and log them
let lastPick = store.getState().currentPick;
const intervalId = setInterval(() => {
  const state = store.getState();
  if (state.currentPick !== lastPick) {
    console.log(`🔄 Store state updated: currentPick = ${state.currentPick}, cpuIsThinking = ${state.cpuIsThinking}, thinkingCpuName = ${state.thinkingCpuName}`);
    lastPick = state.currentPick;
    
    const activeIdx = getTeamIndexForPick(state.currentPick, state.setup.leagueSize, state.setup.draftType);
    const isUserTurn = activeIdx === state.setup.userPosition - 1;
    if (state.draftStatus === 'drafting' && isUserTurn) {
      clearInterval(intervalId);
      onUserTurnReached();
      return;
    }
  }
  
  checkCpuTrigger();
}, 50);

setTimeout(() => {
  console.error('❌ Test timed out! The draft is stuck and never returned to the user.');
  console.log('Final draft status:', store.getState().draftStatus);
  console.log('Final currentPick:', store.getState().currentPick);
  console.log('cpuIsThinking:', store.getState().cpuIsThinking);
  console.log('thinkingCpuName:', store.getState().thinkingCpuName);
  console.log('Draft History length:', store.getState().draftHistory.length);
  console.log('Drafted players:', store.getState().draftHistory.map(h => `${h.pickNumber}. ${h.teamName} -> ${h.player.name}`).join(', '));
  process.exit(1);
}, 20000);
