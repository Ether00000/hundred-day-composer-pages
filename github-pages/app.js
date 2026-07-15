const phases = [
  {title:"声音与工具",range:"Day 1–10",description:"先会听、会操作，再开始写。认识 DAW、节拍、音高和最小创作流程。",outcome:"做出第一段 8 小节音乐草图",days:["声音的四个维度","认识你的 DAW","节拍与小节","音名与键盘","半音、全音与八度","第一次 MIDI 录入","速度与拍号","量化但不僵硬","搭出 4 小节循环","阶段作品：声音明信片"]},
  {title:"节奏与律动",range:"Day 11–20",description:"用鼓点建立推动力，理解强弱拍、切分、律动与不同风格的节奏骨架。",outcome:"完成一段有层次的鼓组 Loop",days:["鼓组里的四个角色","四四拍的基本律动","八分与十六分音符","强拍、弱拍与重音","切分：制造向前感","Swing 与松紧感","Ghost Note 小幽灵","三种常见风格节奏","鼓组的加法与减法","阶段作品：会呼吸的节奏"]},
  {title:"旋律写作",range:"Day 21–30",description:"从音阶出发，用动机、重复、变化和问答写出能记住的旋律。",outcome:"写出一条 16 小节主旋律",days:["大调音阶与音级","小调音阶与情绪","五声音阶快速上手","动机：旋律的种子","重复与微小变化","旋律的问与答","级进、跳进与轮廓","留白比音符更重要","为和弦写旋律","阶段作品：16 小节主题"]},
  {title:"和声与情绪",range:"Day 31–40",description:"理解三和弦、调内和弦与功能，让和弦进行真正服务情绪。",outcome:"完成一版旋律与和声 Demo",days:["三和弦是怎样组成的","大三和弦与小三和弦","调内七个和弦","主、下属与属功能","I–V–vi–IV 为什么好用","和弦转位让连接更顺","七和弦增加色彩","借用和弦制造惊喜","为旋律配和弦","阶段作品：情绪和声 Demo"]},
  {title:"曲式与叙事",range:"Day 41–50",description:"把好听的循环发展成完整歌曲，用段落、能量和对比讲故事。",outcome:"画出自己的完整曲式蓝图",days:["循环为何容易无聊","前奏的三种任务","主歌：建立世界","预副歌：蓄力","副歌：兑现期待","桥段：打开新视角","重复中的变化","能量曲线怎么画","拆解一首喜欢的歌","阶段作品：完整曲式蓝图"]},
  {title:"音色与设计",range:"Day 51–60",description:"学会挑选、塑造与分层音色，建立服务作品而非堆砌预设的审美。",outcome:"建立一套统一的歌曲音色板",days:["音色选择的三个问题","振荡器与波形","包络：声音的形状","滤波器与明暗","LFO 让声音动起来","采样与切片","Layer 分层的边界","Bass 音色与低频角色","空间系效果入门","阶段作品：专属音色板"]},
  {title:"编曲与配器",range:"Day 61–70",description:"管理频率、节奏与声部角色，让不同乐器在同一首歌里各司其职。",outcome:"完成第一版全曲编曲",days:["编曲就是分配注意力","低频：鼓和 Bass 的合作","中频：和声的主体","高频：空气与点缀","主角、配角与背景","声部进行与避让","填充句与过门","自动化塑造变化","做减法的编曲检查","阶段作品：全曲编曲 V1"]},
  {title:"录音与编辑",range:"Day 71–80",description:"掌握家庭录音、素材整理、音高校正与节奏编辑的实用工作流。",outcome:"得到干净、自然、可混音的素材",days:["信号链与增益","家庭录音空间","人声录音准备","多 Take 与 Comp","噪声和呼吸的处理","节奏编辑不失自然","基础音高校正","吉他与真实乐器录音","文件命名与工程整理","阶段作品：整理可混音素材"]},
  {title:"混音与空间",range:"Day 81–90",description:"从音量平衡开始，逐步使用 EQ、压缩、声像和空间效果完成混音。",outcome:"输出一版清晰、有层次的混音",days:["先只用音量做平衡","声像与宽度","EQ：先解决再美化","压缩：控制与律动","瞬态与冲击力","混响创造空间","Delay 创造深度","总线与分组","参考曲与多设备检查","阶段作品：全曲混音 V1"]},
  {title:"完成与发布",range:"Day 91–100",description:"用可执行的反馈与修改流程完成作品，理解母带、导出和发布准备。",outcome:"发布你的第一首完整作品",days:["完成比完美更重要","三层反馈法","第一轮：结构修改","第二轮：编曲修改","第三轮：混音修改","母带到底做什么","响度、动态与导出","封面与作品说明","发布前最终清单","毕业作品：我的第一首歌"]}
];

const lessons = phases.flatMap((phase, phaseIndex) => phase.days.map((title, index) => ({day:phaseIndex*10+index+1,phaseIndex,title,duration:25+((phaseIndex+index)%4)*5,description:phase.description,guide:lessonGuides[phaseIndex*10+index]})));
const chords = [{name:"C",degree:"I",mood:"明亮起点",notes:[261.63,329.63,392]},{name:"Am",degree:"vi",mood:"内敛转折",notes:[220,261.63,329.63]},{name:"F",degree:"IV",mood:"开阔铺陈",notes:[174.61,220,261.63]},{name:"G",degree:"V",mood:"期待回归",notes:[196,246.94,293.66]}];
const milestoneData = [[20,"鼓组 Loop","建立稳定律动"],[40,"旋律和声 Demo","表达一个清晰情绪"],[70,"全曲编曲 V1","完成所有段落"],[100,"毕业作品","导出可分享成品"]];

let saved = {};
try { saved = JSON.parse(localStorage.getItem("composer-learning-state") || "{}"); } catch (_) {}
let completedDays = Math.min(Number(saved.completedDays)||0,100);
let streak = Number(saved.streak)||0;
let lastCheckin = saved.lastCheckin||"";
let lessonSteps = saved.lessonSteps && typeof saved.lessonSteps === "object" ? saved.lessonSteps : {};
let selectedPhase = 0;
let selectedDay = null;
let taskChecks = [false,false,false];
let courseStep = 0;
let lessonAudioPlayed = false;
let audioContext = null;
let activeNodes = [];
let activePlayback = null;
let audioEndTimer = null;

const $ = (id) => document.getElementById(id);
const currentDay = () => Math.min(completedDays + 1, 100);
const localDate = () => new Date().toLocaleDateString("en-CA");
const saveState = () => localStorage.setItem("composer-learning-state",JSON.stringify({completedDays,streak,lastCheckin,lessonSteps}));

function renderDashboard() {
  const day = currentDay();
  const lesson = lessons[day-1];
  $("header-day").textContent = `Day ${day}/100`;
  $("header-percent").textContent = `${completedDays}%`;
  $("header-bar").style.width = `${completedDays}%`;
  $("header-progress").setAttribute("aria-label",`课程进度 ${completedDays}%`);
  $("start-today").innerHTML = `开始第 ${day} 天 <span aria-hidden="true">▶</span>`;
  $("today-title").textContent = lesson.title;
  $("today-meta").textContent = `◷ ${lesson.duration}分钟 · 第 ${lesson.phaseIndex+1} 阶段`;
  $("stat-day").textContent = `Day ${completedDays}/100`;
  $("stat-percent").textContent = `${completedDays}%`;
  $("streak-count").textContent = streak;
  $("audio-status").textContent = completedDays < 10 ? "等待第一段录音" : "00:28 / 01:30";
  $("segments").innerHTML = Array.from({length:25},(_,i)=>`<i class="${i<Math.ceil(completedDays/4)?"done":""}"></i>`).join("");
  $("week-row").innerHTML = ["一","二","三","四","五","六","日"].map((d,i)=>`<span><i class="${i<Math.min(streak,7)?"checked":""}">${i<Math.min(streak,7)?"✓":"·"}</i><small>${d}</small></span>`).join("");
  $("milestones").innerHTML = milestoneData.map(([dayNum,title,desc])=>`<article class="milestone-card panel"><span>DAY ${dayNum}</span><div class="disc" aria-hidden="true"><i></i></div><h3>${title}</h3><p>${desc}</p><small>${completedDays>=dayNum?"已解锁 ✓":`还需 ${dayNum-completedDays} 天`}</small></article>`).join("");
}

function renderRoadmap() {
  $("phase-tabs").innerHTML = phases.map((phase,i)=>`<button role="tab" aria-selected="${selectedPhase===i}" class="${selectedPhase===i?"active":""}" data-phase="${i}"><small>${String(i+1).padStart(2,"0")}</small><span>${phase.title}</span></button>`).join("");
  const phase = phases[selectedPhase];
  $("phase-summary").innerHTML = `<div><span>${phase.range}</span><h3>${phase.title}</h3><p>${phase.description}</p></div><div class="outcome"><small>阶段成果</small><strong>${phase.outcome}</strong></div>`;
  $("lesson-grid").innerHTML = lessons.filter(l=>l.phaseIndex===selectedPhase).map(lesson=>{const status=lesson.day<=completedDays?"done":lesson.day===currentDay()?"current":"upcoming";return `<button class="roadmap-lesson ${status}" data-day="${lesson.day}"><span class="day-index">DAY ${String(lesson.day).padStart(2,"0")}</span><strong>${lesson.title}</strong><small>${lesson.duration} 分钟</small><i>${status==="done"?"✓ 已完成":status==="current"?"● 今日":"○ 可预览"}</i></button>`}).join("");
  document.querySelectorAll("[data-phase]").forEach(button=>button.addEventListener("click",()=>{selectedPhase=Number(button.dataset.phase);renderRoadmap()}));
  document.querySelectorAll("[data-day]").forEach(button=>button.addEventListener("click",()=>openLesson(Number(button.dataset.day))));
}

function renderChordPads() {
  $("chord-pads").innerHTML = chords.map(c=>`<button data-chord="${c.name}"><small>${c.degree}</small><strong>${c.name}</strong><span>${c.mood}</span></button>`).join("");
  document.querySelectorAll("[data-chord]").forEach(button=>button.addEventListener("click",()=>{const chord=chords.find(c=>c.name===button.dataset.chord);playChord(chord,button)}));
}

async function ensureAudio() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) throw new Error("当前浏览器不支持 Web Audio");
  if (!audioContext) audioContext = new AudioCtx();
  if (audioContext.state === "suspended") await audioContext.resume();
  return audioContext;
}

async function playChord(chord, button) {
  document.querySelectorAll("[data-chord]").forEach(el=>el.classList.remove("active"));
  button.classList.add("active");
  let audio;
  try { audio = await ensureAudio(); } catch (_) { button.classList.remove("active"); return; }
  const master = audio.createGain();
  master.gain.setValueAtTime(.0001,audio.currentTime);
  master.gain.exponentialRampToValueAtTime(.12,audio.currentTime+.03);
  master.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+1.2);
  master.connect(audio.destination);
  chord.notes.forEach((frequency,index)=>{const oscillator=audio.createOscillator();oscillator.type=index===0?"triangle":"sine";oscillator.frequency.value=frequency;oscillator.connect(master);oscillator.start(audio.currentTime+index*.025);oscillator.stop(audio.currentTime+1.25)});
  setTimeout(()=>button.classList.remove("active"),1250);
}

const midiFrequency = note => 440 * Math.pow(2,(note-69)/12);

function scheduleVoice(audio, frequency, start, duration, type="triangle", level=.065) {
  const oscillator=audio.createOscillator();
  const gain=audio.createGain();
  oscillator.type=type;
  oscillator.frequency.setValueAtTime(frequency,start);
  gain.gain.setValueAtTime(.0001,start);
  gain.gain.exponentialRampToValueAtTime(level,start+.025);
  gain.gain.exponentialRampToValueAtTime(Math.max(level*.55,.0002),start+Math.max(.05,duration*.55));
  gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
  oscillator.connect(gain).connect(audio.destination);
  oscillator.start(start);
  oscillator.stop(start+duration+.03);
  activeNodes.push(oscillator);
}

function scheduleKick(audio, start) {
  const oscillator=audio.createOscillator();
  const gain=audio.createGain();
  oscillator.type="sine";
  oscillator.frequency.setValueAtTime(125,start);
  oscillator.frequency.exponentialRampToValueAtTime(48,start+.16);
  gain.gain.setValueAtTime(.16,start);
  gain.gain.exponentialRampToValueAtTime(.0001,start+.22);
  oscillator.connect(gain).connect(audio.destination);
  oscillator.start(start);
  oscillator.stop(start+.24);
  activeNodes.push(oscillator);
}

function resetAudioUI(finished=false) {
  $("piano-roll").classList.remove("is-playing");
  $("waveform").classList.remove("is-playing");
  $("music-play").textContent="▶";
  $("track-play").textContent="▶";
  $("lesson-audio-play").textContent="▶";
  $("music-play").setAttribute("aria-label","播放音乐示例");
  $("track-play").setAttribute("aria-label","播放创作片段");
  $("lesson-audio-play").setAttribute("aria-label","播放今日音乐示例");
  const bar=$("lesson-audio-bar");
  bar.style.transition="none";
  bar.style.width="0";
  $("lesson-audio-status").textContent=finished?"播放完成 · 可以再听一次":"点击播放 · 约 8 秒";
}

function stopPlayback(finished=false) {
  if (audioEndTimer) clearTimeout(audioEndTimer);
  audioEndTimer=null;
  activeNodes.forEach(node=>{try{node.stop()}catch(_){}});
  activeNodes=[];
  activePlayback=null;
  resetAudioUI(finished);
}

function scheduleLessonSequence(audio, day, mode) {
  const lesson=lessons[day-1];
  const phase=lesson.phaseIndex;
  const patterns=[
    [0,1,2,4,2,1,0,-1,0,2,4,5,4,2,1,0],
    [0,-1,0,2,-1,2,4,-1,4,2,1,-1,2,1,0,-1],
    [0,2,4,2,5,4,2,1,0,1,2,4,5,4,2,0],
    [0,4,2,5,4,2,1,2,0,2,5,4,2,1,0,-1]
  ];
  const scale=phase===2||phase===9?[0,2,3,5,7,8,10,12]:[0,2,4,5,7,9,11,12];
  const pattern=patterns[(day-1)%patterns.length];
  const root=60+[0,2,5,7][phase%4];
  const type=["sine","triangle","triangle","sine","triangle","sawtooth","square","triangle","sine","triangle"][phase];
  const step=.43;
  const start=audio.currentTime+.07;
  pattern.forEach((degree,index)=>{
    if (degree<0) return;
    const note=root+scale[degree%scale.length]+(degree>=scale.length?12:0);
    const accent=index%4===0?1.2:1;
    scheduleVoice(audio,midiFrequency(note),start+index*step,step*.82,type,.055*accent);
  });
  const roots=[0,9,5,7];
  roots.forEach((offset,index)=>{
    const chordStart=start+index*step*4;
    [0,4,7].forEach((interval,n)=>scheduleVoice(audio,midiFrequency(root-12+offset+interval),chordStart,step*3.6,n===0?"triangle":"sine",mode==="track"?.026:.018));
    if (mode==="track"||phase===1||phase===6) scheduleKick(audio,chordStart);
  });
  return pattern.length*step+.55;
}

async function toggleExample(mode, button) {
  if (activePlayback && activePlayback.button===button) { stopPlayback(false); return; }
  stopPlayback(false);
  try {
    const audio=await ensureAudio();
    const day=selectedDay||currentDay();
    const duration=scheduleLessonSequence(audio,day,mode);
    activePlayback={button,mode};
    button.textContent="Ⅱ";
    button.setAttribute("aria-label","暂停播放");
    if(mode==="hero") $("piano-roll").classList.add("is-playing");
    if(mode==="track") $("waveform").classList.add("is-playing");
    if(mode==="lesson") {
      lessonAudioPlayed=true;
      $("lesson-audio-status").textContent="播放中…再次点击可暂停";
      const bar=$("lesson-audio-bar");
      bar.style.transition="none";
      bar.style.width="0";
      requestAnimationFrame(()=>requestAnimationFrame(()=>{bar.style.transition=`width ${duration}s linear`;bar.style.width="100%"}));
    }
    audioEndTimer=setTimeout(()=>stopPlayback(true),duration*1000);
  } catch (_) {
    resetAudioUI(false);
    $("lesson-audio-status").textContent="浏览器未能启动声音，请检查是否静音后重试";
  }
}

function openLesson(day) {
  selectedDay = day;
  const savedStep=Math.max(0,Math.min(Number(lessonSteps[day])||0,4));
  const isDone=day<=completedDays;
  courseStep=isDone?0:day===currentDay()?savedStep:0;
  taskChecks=isDone?[true,true,true]:day===currentDay()?[savedStep>=1,savedStep>=3,savedStep>=4]:[false,false,false];
  lessonAudioPlayed=isDone||savedStep>=3;
  const lesson = lessons[day-1];
  const guide = lesson.guide;
  $("modal-kicker").textContent = `DAY ${String(day).padStart(2,"0")} · ${phases[lesson.phaseIndex].title}`;
  $("modal-title").textContent = lesson.title;
  $("modal-intro").textContent = lesson.description;
  $("modal-goal").textContent = guide.deliverable;
  $("reader-summary").textContent = guide.summary;
  $("reader-concepts").innerHTML = guide.concepts.map(item=>`<li>${item}</li>`).join("");
  $("reader-example").textContent = guide.example;
  $("reader-listen").textContent = guide.listen;
  $("reader-practice").innerHTML = guide.practice.map(item=>`<li>${item}</li>`).join("");
  $("reader-deliverable").textContent = guide.deliverable;
  $("previous-day").disabled = day===1;
  $("next-day").disabled = day===100;
  $("notice").hidden = true;
  renderCourseStep();
  $("lesson-modal").hidden = false;
  document.body.classList.add("modal-open");
  $("modal-close").focus();
}

function renderCourseStep() {
  const labels=["学习","例子","听辨","实操","打卡"];
  const isDone=selectedDay<=completedDays;
  const isFuture=selectedDay>currentDay();
  const savedStep=Math.max(0,Math.min(Number(lessonSteps[selectedDay])||0,4));
  const maxUnlocked=isDone||isFuture?4:Math.max(courseStep,savedStep);
  $("course-progress").innerHTML=labels.map((label,index)=>`<button data-step="${index}" class="${index===courseStep?"active":""} ${isDone||index<maxUnlocked?"done":""}" ${index>maxUnlocked?"disabled":""}><i>${isDone||index<maxUnlocked?"✓":index+1}</i><span>${label}</span></button>`).join("");
  document.querySelectorAll("[data-course-panel]").forEach(panel=>panel.hidden=Number(panel.dataset.coursePanel)!==courseStep);
  document.querySelectorAll("[data-step]").forEach(button=>button.addEventListener("click",()=>{
    if(Number(button.dataset.step)>maxUnlocked)return;
    if(activePlayback?.mode==="lesson")stopPlayback(false);
    courseStep=Number(button.dataset.step);
    renderCourseStep();
  }));
  $("course-position").textContent=`${courseStep+1} / 5`;
  $("course-previous").disabled=courseStep===0;
  const nextLabels=["学完概念，继续 →","看懂例子，继续 →","完成听辨，继续 →","完成实操，去打卡 →",""];
  $("course-next").textContent=nextLabels[courseStep];
  $("course-next").hidden=courseStep===4;
  renderTasks();
}

function advanceCourse() {
  if(courseStep>=4)return;
  if(courseStep===2&&selectedDay===currentDay()&&!lessonAudioPlayed){
    $("lesson-audio-status").textContent="请先点击播放，听完或开始听辨后再继续";
    $("lesson-audio-play").focus();
    return;
  }
  if(selectedDay===currentDay()){
    if(courseStep===0)taskChecks[0]=true;
    if(courseStep===2)taskChecks[1]=true;
    if(courseStep===3)taskChecks[2]=true;
  }
  if(activePlayback?.mode==="lesson")stopPlayback(false);
  courseStep=Math.min(courseStep+1,4);
  if(selectedDay===currentDay()){
    lessonSteps[selectedDay]=Math.max(Number(lessonSteps[selectedDay])||0,courseStep);
    saveState();
  }
  renderCourseStep();
  $("modal-title").scrollIntoView({block:"start"});
}

function renderTasks() {
  const lesson = lessons[selectedDay-1];
  const guide = lesson.guide;
  const taskData = [{tag:"学",time:"10 分钟",text:`读完「${lesson.title}」，能复述至少两个核心知识点`},{tag:"听",time:"8 分钟",text:guide.listen},{tag:"做",time:`${lesson.duration-18} 分钟`,text:guide.deliverable}];
  $("daily-tasks").innerHTML = taskData.map((task,index)=>`<label class="${taskChecks[index]?"checked":""} locked"><input type="checkbox" ${taskChecks[index]?"checked":""} disabled><span>${task.tag}</span><div><strong>${task.text}</strong><small>${task.time}</small></div><i>${taskChecks[index]?"✓":""}</i></label>`).join("");
  const button = $("complete-button");
  const isDone=selectedDay<=completedDays;
  button.disabled=isDone||(selectedDay===currentDay()&&!taskChecks.every(Boolean));
  button.className="complete-button"+(isDone?" completed":selectedDay>currentDay()?" preview":"");
  button.textContent=isDone?"这一天已完成 ✓":selectedDay>currentDay()?`这是预览 · 返回 Day ${currentDay()}`:"完成今天并打卡";
}

function completeToday() {
  if (selectedDay>currentDay()) { openLesson(currentDay()); return; }
  if (selectedDay!==currentDay() || completedDays>=100) return;
  if (!taskChecks.every(Boolean)) { $("notice").textContent="先完成上面的 3 个小任务，再打卡。慢一点也没关系。";$("notice").hidden=false;return; }
  const today=localDate();
  const previous=lastCheckin?new Date(`${lastCheckin}T00:00:00`):null;
  const now=new Date(`${today}T00:00:00`);
  const gap=previous?Math.round((now-previous)/86400000):1;
  streak=lastCheckin===today?streak:gap===1?streak+1:1;
  lessonSteps[selectedDay]=4;
  completedDays=Math.min(completedDays+1,100);
  lastCheckin=today;
  saveState();
  $("notice").textContent=completedDays===100?"毕业了！你的第一首完整作品已经走完 100 天。":`Day ${selectedDay} 打卡成功，下一站是 Day ${completedDays+1}。`;
  $("notice").hidden=false;
  renderDashboard();renderRoadmap();renderCourseStep();
}

function closeModal() { stopPlayback(false);$("lesson-modal").hidden=true;document.body.classList.remove("modal-open");$("start-today").focus(); }

$("waveform").innerHTML = Array.from({length:70},(_,i)=>`<i style="height:${18+((i*17)%58)}%"></i>`).join("")+"<b></b>";
$("music-play").addEventListener("click",event=>toggleExample("hero",event.currentTarget));
$("track-play").addEventListener("click",event=>toggleExample("track",event.currentTarget));
$("lesson-audio-play").addEventListener("click",event=>toggleExample("lesson",event.currentTarget));
$("start-today").addEventListener("click",()=>openLesson(currentDay()));
$("modal-close").addEventListener("click",closeModal);
$("lesson-modal").addEventListener("click",event=>{if(event.target===$("lesson-modal"))closeModal()});
$("complete-button").addEventListener("click",completeToday);
$("course-next").addEventListener("click",advanceCourse);
$("course-previous").addEventListener("click",()=>{if(courseStep>0){if(activePlayback?.mode==="lesson")stopPlayback(false);courseStep--;renderCourseStep()}});
$("previous-day").addEventListener("click",()=>{if(selectedDay>1)openLesson(selectedDay-1)});
$("next-day").addEventListener("click",()=>{if(selectedDay<100)openLesson(selectedDay+1)});
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!$("lesson-modal").hidden)closeModal()});

renderDashboard();renderRoadmap();renderChordPads();
