const replyPlease=document.getElementById("replyPlease"),reply=document.getElementById("reply"),playPanel=document.getElementById("playPanel"),infoPanel=document.getElementById("infoPanel"),countPanel=document.getElementById("countPanel"),scorePanel=document.getElementById("scorePanel"),gameTime=60;let gameTimer,answer="Talk Numbers",firstRun=!0,catCounter=0,correctCount=0,allVoices=[],audioContext;const audioBufferCache={},voiceInput=setVoiceInput();loadConfig();function loadConfig(){localStorage.getItem("darkMode")==1&&document.documentElement.setAttribute("data-bs-theme","dark"),localStorage.getItem("voice")==0&&(document.getElementById("voiceOn").classList.remove("d-none"),document.getElementById("voiceOff").classList.add("d-none"))}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),document.documentElement.setAttribute("data-bs-theme","light")):(localStorage.setItem("darkMode",1),document.documentElement.setAttribute("data-bs-theme","dark"))}function toggleVoice(){localStorage.getItem("voice")!=0?(localStorage.setItem("voice",0),document.getElementById("voiceOn").classList.add("d-none"),document.getElementById("voiceOff").classList.remove("d-none"),speechSynthesis.cancel()):(localStorage.setItem("voice",1),document.getElementById("voiceOn").classList.remove("d-none"),document.getElementById("voiceOff").classList.add("d-none"),voiceInput.stop(),speak(answer))}function createAudioContext(){return globalThis.AudioContext?new globalThis.AudioContext:(console.error("Web Audio API is not supported in this browser"),null)}function unlockAudio(){audioContext?audioContext.resume():(audioContext=createAudioContext(),loadAudio("end","mp3/end.mp3"),loadAudio("error","mp3/cat.mp3"),loadAudio("correct","mp3/correct3.mp3")),document.removeEventListener("pointerdown",unlockAudio),document.removeEventListener("keydown",unlockAudio)}async function loadAudio(e,t){if(!audioContext)return;if(audioBufferCache[e])return audioBufferCache[e];try{const s=await fetch(t),o=await s.arrayBuffer(),n=await audioContext.decodeAudioData(o);return audioBufferCache[e]=n,n}catch(t){throw console.error(`Loading audio ${e} error:`,t),t}}function playAudio(e,t){if(!audioContext)return;const o=audioBufferCache[e];if(!o){console.error(`Audio ${e} is not found in cache`);return}const n=audioContext.createBufferSource();n.buffer=o;const s=audioContext.createGain();t&&(s.gain.value=t),s.connect(audioContext.destination),n.connect(s),n.start()}function loadVoices(){const e=new Promise(e=>{let t=speechSynthesis.getVoices();if(t.length!==0)e(t);else{let n=!1;speechSynthesis.addEventListener("voiceschanged",()=>{n=!0,t=speechSynthesis.getVoices(),e(t)}),setTimeout(()=>{n||document.getElementById("noTTS").classList.remove("d-none")},1e3)}}),t=["com.apple.speech.synthesis.voice.Bahh","com.apple.speech.synthesis.voice.Albert","com.apple.speech.synthesis.voice.Hysterical","com.apple.speech.synthesis.voice.Organ","com.apple.speech.synthesis.voice.Cellos","com.apple.speech.synthesis.voice.Zarvox","com.apple.speech.synthesis.voice.Bells","com.apple.speech.synthesis.voice.Trinoids","com.apple.speech.synthesis.voice.Boing","com.apple.speech.synthesis.voice.Whisper","com.apple.speech.synthesis.voice.Deranged","com.apple.speech.synthesis.voice.GoodNews","com.apple.speech.synthesis.voice.BadNews","com.apple.speech.synthesis.voice.Bubbles"];e.then(e=>{allVoices=e.filter(e=>!t.includes(e.voiceURI)),addLangRadioBox()})}loadVoices();function speak(e){speechSynthesis.cancel();const t=new globalThis.SpeechSynthesisUtterance(e),s=document.getElementById("langRadio").elements.lang.value,o=["com.apple.speech.synthesis.voice.Bahh","com.apple.speech.synthesis.voice.Albert","com.apple.speech.synthesis.voice.Hysterical","com.apple.speech.synthesis.voice.Organ","com.apple.speech.synthesis.voice.Cellos","com.apple.speech.synthesis.voice.Zarvox","com.apple.speech.synthesis.voice.Bells","com.apple.speech.synthesis.voice.Trinoids","com.apple.speech.synthesis.voice.Boing","com.apple.speech.synthesis.voice.Whisper","com.apple.speech.synthesis.voice.Deranged","com.apple.speech.synthesis.voice.GoodNews","com.apple.speech.synthesis.voice.BadNews","com.apple.speech.synthesis.voice.Bubbles"],n=allVoices.filter(e=>e.lang==s).filter(e=>!o.includes(e.voiceURI));t.onend=()=>{voiceInput.start()},t.voice=n[Math.floor(Math.random()*n.length)],t.lang=document.getElementById("langRadio").elements.lang.value,voiceInput.stop(),speechSynthesis.speak(t)}function respeak(){speak(answer)}function addLangRadioBox(){const e=document.getElementById("langRadio");e.replaceChildren();const t=allVoices.map(e=>e.lang),n=[...new Set(t)];n.sort().forEach(t=>{const o=document.createElement("div");o.className="form-check form-check-inline";const n=document.createElement("input");n.className="form-check-input",n.name="lang",n.type="radio",n.value=t;const s=document.createElement("label");s.className="from-check-label",s.textContent=t,s.appendChild(n),o.appendChild(s),e.appendChild(o),(t=="en-US"||t=="en_US")&&(n.checked=!0)})}function getRandomInt(e,t){return e=Math.ceil(e),t=Math.floor(t),Math.floor(Math.random()*(t-e)+e)}function nextProblem(){replyPlease.classList.remove("d-none"),reply.classList.add("d-none");const e=document.getElementById("grade").selectedIndex+1,t=Math.pow(10,e);answer=getRandomInt(0,t).toString(),document.getElementById("answer").textContent=answer,localStorage.getItem("voice")!=0&&speak(answer),firstRun&&(firstRun=!1)}function catNyan(){playAudio("error")}function loadImage(e){return new Promise((t,n)=>{const s=new Image;s.onload=()=>t(s),s.onerror=e=>n(e),s.src=e})}function loadCatImage(e){const t=128;return new Promise(n=>{loadImage(e).then(e=>{const s=document.createElement("canvas");s.setAttribute("role","button"),s.width=t,s.height=t,s.style.position="absolute",s.getContext("2d").drawImage(e,0,0),n(s)}).catch(e=>{console.log(e)})})}loadCatImage("kohacu.webp").then(e=>{catsWalk(e)});function catWalk(e,t){const s=document.getElementById("catsWalk"),i=s.offsetWidth,a=s.offsetHeight,n=t.cloneNode(!0);n.getContext("2d").drawImage(t,0,0);const o=128;n.style.top=getRandomInt(0,a-o)+"px",n.style.left=i-o+"px",n.addEventListener("click",()=>{catCounter+=1,speak(catCounter),n.remove()},{once:!0}),s.appendChild(n);const r=setInterval(()=>{const e=parseInt(n.style.left)-1;e>-o?n.style.left=e+"px":(clearInterval(r),n.remove())},e)}function catsWalk(e){setInterval(()=>{Math.random()>.995&&catWalk(getRandomInt(5,20),e)},10)}function countdown(){correctCount=0,countPanel.classList.remove("d-none"),infoPanel.classList.add("d-none"),playPanel.classList.add("d-none"),scorePanel.classList.add("d-none");const e=document.getElementById("counter");e.textContent=3;const t=setInterval(()=>{const n=["skyblue","greenyellow","violet","tomato"];if(parseInt(e.textContent)>1){const t=parseInt(e.textContent)-1;e.style.backgroundColor=n[t],e.textContent=t}else clearTimeout(t),countPanel.classList.add("d-none"),infoPanel.classList.remove("d-none"),playPanel.classList.remove("d-none"),nextProblem(),startGameTimer()},1e3)}function startGameTimer(){clearInterval(gameTimer);const e=document.getElementById("time");initTime(),gameTimer=setInterval(()=>{const t=parseInt(e.textContent);t>0?e.textContent=t-1:(clearInterval(gameTimer),playAudio("end"),scoring())},1e3)}function initTime(){document.getElementById("time").textContent=gameTime}function scoring(){playPanel.classList.add("d-none"),scorePanel.classList.remove("d-none"),document.getElementById("score").textContent=correctCount}function formatReply(e){return e.toLowerCase().split(" ").slice(0,-1).join(" ")}function setVoiceInput(){if(globalThis.webkitSpeechRecognition){const e=new globalThis.webkitSpeechRecognition;return e.lang=document.getElementById("langRadio").elements.lang.value,e.continuous=!0,e.onstart=()=>voiceInputOnStart,e.onend=()=>{speechSynthesis.speaking||e.start()},e.onresult=t=>{const n=t.results[0][0].transcript;document.getElementById("reply").textContent=n,n.toLowerCase()==answer.toLowerCase()?(correctCount+=1,playAudio("correct",.3),nextProblem()):(e.lang=="en_US"||e.lang=="en-US")&&formatReply(n)==answer.toLowerCase()&&(playAudio("correct",.3),nextProblem()),replyPlease.classList.add("d-none"),reply.classList.remove("d-none"),e.stop()},e}document.getElementById("noSTT").classList.remove("d-none")}function voiceInputOnStart(){document.getElementById("startVoiceInput").classList.add("d-none"),document.getElementById("stopVoiceInput").classList.remove("d-none")}function voiceInputOnStop(){document.getElementById("startVoiceInput").classList.remove("d-none"),document.getElementById("stopVoiceInput").classList.add("d-none")}function startVoiceInput(){try{voiceInput.start()}catch{}}function stopVoiceInput(){voiceInputOnStop(),voiceInput.stop()}document.getElementById("toggleDarkMode").onclick=toggleDarkMode,document.getElementById("toggleVoice").onclick=toggleVoice,document.getElementById("startVoiceInput").onclick=startVoiceInput,document.getElementById("stopVoiceInput").onclick=stopVoiceInput,document.getElementById("restartButton").onclick=countdown,document.getElementById("startButton").onclick=countdown,document.getElementById("respeak").onclick=respeak,document.getElementById("kohacu").onclick=catNyan,document.getElementById("langRadio").onchange=()=>{voiceInput=setVoiceInput()},document.addEventListener("pointerdown",unlockAudio,{once:!0}),document.addEventListener("keydown",unlockAudio,{once:!0})