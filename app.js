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
let selectedPhase = 0;
let selectedDay = null;
let taskChecks = [false,false,false];
let playing = false;

const $ = (id) => document.getElementById(id);
const currentDay = () => Math.min(completedDays + 1, 100);
const localDate = () => new Date().toLocaleDateString("en-CA");

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

function playChord(chord, button) {
  document.querySelectorAll("[data-chord]").forEach(el=>el.classList.remove("active"));
  button.classList.add("active");
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const audio = new AudioCtx();
  const master = audio.createGain();
  master.gain.setValueAtTime(.0001,audio.currentTime);
  master.gain.exponentialRampToValueAtTime(.12,audio.currentTime+.03);
  master.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+1.2);
  master.connect(audio.destination);
  chord.notes.forEach((frequency,index)=>{const oscillator=audio.createOscillator();oscillator.type=index===0?"triangle":"sine";oscillator.frequency.value=frequency;oscillator.connect(master);oscillator.start(audio.currentTime+index*.025);oscillator.stop(audio.currentTime+1.25)});
  setTimeout(()=>{button.classList.remove("active");audio.close()},1250);
}

function togglePlay() {
  playing = !playing;
  $("piano-roll").classList.toggle("is-playing",playing);
  $("waveform").classList.toggle("is-playing",playing);
  $("music-play").textContent = playing ? "Ⅱ" : "▶";
  $("music-play").setAttribute("aria-label",playing?"暂停音乐示例":"播放音乐示例");
  $("track-play").textContent = playing ? "Ⅱ" : "▶";
  $("track-play").setAttribute("aria-label",playing?"暂停创作片段":"播放创作片段");
}

function openLesson(day) {
  selectedDay = day;
  taskChecks = day<=completedDays?[true,true,true]:[false,false,false];
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
  renderTasks();
  $("lesson-modal").hidden = false;
  document.body.classList.add("modal-open");
  $("modal-close").focus();
}

function renderTasks() {
  const lesson = lessons[selectedDay-1];
  const guide = lesson.guide;
  const taskData = [{tag:"学",time:"10 分钟",text:`读完「${lesson.title}」，能复述至少两个核心知识点`},{tag:"听",time:"8 分钟",text:guide.listen},{tag:"做",time:`${lesson.duration-18} 分钟`,text:guide.deliverable}];
  $("daily-tasks").innerHTML = taskData.map((task,index)=>`<label class="${taskChecks[index]?"checked":""}" data-task="${index}"><input type="checkbox" ${taskChecks[index]?"checked":""} ${selectedDay>currentDay()?"disabled":""}><span>${task.tag}</span><div><strong>${task.text}</strong><small>${task.time}</small></div><i>${taskChecks[index]?"✓":""}</i></label>`).join("");
  document.querySelectorAll("[data-task]").forEach(label=>label.addEventListener("click",event=>{if(event.target.tagName==="INPUT")return;event.preventDefault();if(selectedDay>currentDay())return;const index=Number(label.dataset.task);taskChecks[index]=!taskChecks[index];renderTasks()}));
  const button = $("complete-button");
  button.disabled = selectedDay<currentDay();
  button.className = "complete-button"+(selectedDay<currentDay()?" completed":selectedDay>currentDay()?" preview":"");
  button.textContent = selectedDay<currentDay()?"这一天已完成 ✓":selectedDay>currentDay()?`这是预览 · 返回 Day ${currentDay()}`:completedDays===100?"100 天已全部完成":"完成今天并打卡";
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
  completedDays=Math.min(completedDays+1,100);
  lastCheckin=today;
  localStorage.setItem("composer-learning-state",JSON.stringify({completedDays,streak,lastCheckin}));
  $("notice").textContent=completedDays===100?"毕业了！你的第一首完整作品已经走完 100 天。":`Day ${selectedDay} 打卡成功，下一站是 Day ${completedDays+1}。`;
  $("notice").hidden=false;
  renderDashboard();renderRoadmap();renderTasks();
}

function closeModal() { $("lesson-modal").hidden=true;document.body.classList.remove("modal-open");$("start-today").focus(); }

$("waveform").innerHTML = Array.from({length:70},(_,i)=>`<i style="height:${18+((i*17)%58)}%"></i>`).join("")+"<b></b>";
$("music-play").addEventListener("click",togglePlay);
$("track-play").addEventListener("click",togglePlay);
$("start-today").addEventListener("click",()=>openLesson(currentDay()));
$("modal-close").addEventListener("click",closeModal);
$("lesson-modal").addEventListener("click",event=>{if(event.target===$("lesson-modal"))closeModal()});
$("complete-button").addEventListener("click",completeToday);
$("previous-day").addEventListener("click",()=>{if(selectedDay>1)openLesson(selectedDay-1)});
$("next-day").addEventListener("click",()=>{if(selectedDay<100)openLesson(selectedDay+1)});
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!$("lesson-modal").hidden)closeModal()});

renderDashboard();renderRoadmap();renderChordPads();
