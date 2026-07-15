const AudioEngine = (() => {
  const sampleRate = 22050;
  let player = null;
  let objectUrl = null;
  let attachedUrl = null;

  const envelope = (t,duration,attack=.025,release=.12) => {
    if(t<0||t>duration)return 0;
    const a=Math.min(1,t/attack);
    const r=Math.min(1,(duration-t)/release);
    return Math.max(0,Math.min(a,r));
  };
  const osc = (phase,wave="sine") => {
    if(wave==="square")return Math.sin(phase)>=0?1:-1;
    if(wave==="triangle")return 2/Math.PI*Math.asin(Math.sin(phase));
    if(wave==="sawtooth")return 2*((phase/(Math.PI*2))%1)-1;
    return Math.sin(phase);
  };
  const tone = (t,start,duration,frequency,wave="sine",level=.22) => t<start||t>start+duration?0:osc((t-start)*frequency*Math.PI*2,wave)*envelope(t-start,duration)*level;

  function wavBlob(samples) {
    const buffer=new ArrayBuffer(44+samples.length*2);
    const view=new DataView(buffer);
    const text=(offset,value)=>{for(let i=0;i<value.length;i++)view.setUint8(offset+i,value.charCodeAt(i))};
    text(0,"RIFF");view.setUint32(4,36+samples.length*2,true);text(8,"WAVE");text(12,"fmt ");view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);text(36,"data");view.setUint32(40,samples.length*2,true);
    samples.forEach((sample,index)=>view.setInt16(44+index*2,Math.max(-1,Math.min(1,sample))*32767,true));
    return new Blob([buffer],{type:"audio/wav"});
  }

  function makeSamples(duration,renderer) {
    const samples=new Float32Array(Math.floor(duration*sampleRate));
    for(let i=0;i<samples.length;i++)samples[i]=Math.tanh(renderer(i/sampleRate)*1.1)*.82;
    return samples;
  }

  function lessonSamples(day,phase) {
    const duration=7.2;
    const roots=[261.63,293.66,329.63,349.23,392,440,493.88];
    const root=roots[(day-1)%roots.length];
    const notes=day%2?[0,2,4,7,4,2,0,2,4,5,7,5,4,2]:[7,5,4,2,4,5,7,5,4,2,0,2,4,0];
    const scale=[0,2,4,5,7,9,11,12];
    const events=[];
    const step=.45;
    notes.forEach((degree,index)=>{
      const frequency=root*Math.pow(2,scale[degree%8]/12)*(degree>=8?2:1);
      const wave=phase===5&&index>=7?"sawtooth":phase===1?"square":phase===2?"triangle":"sine";
      const level=phase===9&&index>=7?.13:.18;
      events.push({start:.18+index*step,duration:step*.78,frequency,wave,level});
      if(phase===8&&index>=7)events.push({start:.18+index*step+.22,duration:step*.62,frequency,wave:"sine",level:.07});
    });
    [0,1.8,3.6,5.4].forEach((start,index)=>{
      const chordRoot=root*Math.pow(2,[0,9,5,7][index]/12)/2;
      [0,4,7].forEach(interval=>events.push({start:start+.12,duration:1.55,frequency:chordRoot*Math.pow(2,interval/12),wave:"sine",level:phase===6&&index>=2?.075:.045}));
      if(phase===1||phase===4||phase===6)events.push({start:start+.08,duration:.22,frequency:62,wave:"sine",level:.3});
    });
    const samples=new Float32Array(Math.floor(duration*sampleRate));
    events.forEach(event=>{
      const first=Math.max(0,Math.floor(event.start*sampleRate));
      const last=Math.min(samples.length,Math.ceil((event.start+event.duration)*sampleRate));
      for(let i=first;i<last;i++){
        const local=i/sampleRate-event.start;
        samples[i]+=osc(local*event.frequency*Math.PI*2,event.wave)*envelope(local,event.duration)*event.level;
      }
    });
    for(let i=0;i<samples.length;i++){
      let value=samples[i];
      if(phase===7&&i/sampleRate>3.6)value=Math.max(-.34,Math.min(.34,value*3.1));
      samples[i]=Math.tanh(value*1.1)*.82;
    }
    return samples;
  }

  function playSamples(samples,{onStart,onEnd,onError}={}) {
    stop();
    objectUrl=URL.createObjectURL(wavBlob(samples));
    player=new Audio(objectUrl);
    player.preload="auto";
    player.addEventListener("playing",()=>onStart?.(),{once:true});
    player.addEventListener("ended",()=>{onEnd?.();cleanup()}, {once:true});
    player.addEventListener("error",()=>{onError?.("音频解码失败");cleanup()}, {once:true});
    const promise=player.play();
    if(promise?.catch)promise.catch(error=>{onError?.(error?.message||"浏览器阻止了播放");cleanup()});
    return player;
  }

  function cleanup(){if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl=null}player=null}
  function stop(){if(player){player.pause();player.currentTime=0}cleanup()}

  function attach(element,day,phase,onPlay) {
    if(attachedUrl)URL.revokeObjectURL(attachedUrl);
    attachedUrl=URL.createObjectURL(wavBlob(lessonSamples(day,phase)));
    element.src=attachedUrl;
    element.volume=.9;
    element.load();
    element.onplay=()=>onPlay?.();
    element.onerror=()=>onPlay?.(new Error("播放器无法读取声音"));
  }

  function playLesson(day,phase,callbacks){return playSamples(lessonSamples(day,phase),callbacks)}
  function playTone(frequency=261.63,duration=.8,wave="sine",callbacks){return playSamples(makeSamples(duration,t=>tone(t,0,duration-.02,frequency,wave,.32)),callbacks)}
  function playChord(frequencies,duration=1.25,callbacks){return playSamples(makeSamples(duration,t=>frequencies.reduce((sum,f)=>sum+tone(t,0,duration-.03,f,"sine",.15),0)),callbacks)}
  function playMelody(notes,wave="triangle",callbacks){
    const step=.36,duration=Math.max(1,notes.length*step+.2);
    return playSamples(makeSamples(duration,t=>notes.reduce((sum,n,index)=>sum+tone(t,index*step,step*.82,440*Math.pow(2,(n-69)/12),wave,.24),0)),callbacks);
  }
  function playRhythm(pattern,callbacks){
    const step=.18,duration=16*step+.2;
    return playSamples(makeSamples(duration,t=>pattern.reduce((sum,on,index)=>on?sum+tone(t,index*step,.095,index%4===0?72:180,index%4===0?"sine":"square",index%4===0?.38:.15):sum,0)),callbacks);
  }

  return {attach,playLesson,playTone,playChord,playMelody,playRhythm,stop};
})();

const InteractiveCourse = (() => {
  const states={};
  let update=()=>{};
  const wrongBank=[
    ["声音越高就一定越响","音色只由音名决定"],
    ["节奏越密就一定越有律动","所有鼓点都必须完全一样重"],
    ["旋律必须一直填满不能留白","音符越多旋律越容易记住"],
    ["任何和弦都必须使用原位","非和弦音永远都是错音"],
    ["歌曲每个段落能量都应相同","完整歌曲只能使用一种固定曲式"],
    ["好音色单独听好听就一定合适","所有音色都需要加很多效果器"],
    ["轨道越多编曲就一定越丰满","每个乐器都应该一直演奏"],
    ["录音峰值必须贴近 0 dBFS","所有呼吸声都应该完全删除"],
    ["EQ 节点越多混音越专业","母线越响混音质量就越高"],
    ["作品必须毫无瑕疵才能发布","所有反馈建议都必须照做"]
  ];
  const earData=[
    ["这段示例的主要变化更接近哪一种？",["音高轮廓发生变化","只有画面在变化"],0],
    ["你能听到的稳定时间参照来自哪里？",["周期性重音","随机噪声"],0],
    ["旋律整体最明显的特征是什么？",["有方向的高低轮廓","每个音完全相同"],0],
    ["最后的和声听感更接近什么？",["形成回归或落点","完全没有重心"],0],
    ["后半段相比前半段发生了什么？",["密度或能量改变","所有内容完全没变"],0],
    ["前后音色最大的区别是什么？",["明暗和谐波改变","音高系统消失"],0],
    ["声部增加后，整体听感如何变化？",["层次和密度增加","所有声部自动静音"],0],
    ["后半段的信号出现了什么问题？",["更接近过载失真","动态变得无限大"],0],
    ["后半段空间感为什么更明显？",["出现了延迟尾音","音符全部被删除"],0],
    ["这段声音提醒你发布前要关注什么？",["动态、响度与完整播放","只看文件名不必试听"],0]
  ];

  const getState=day=>states[day]||(states[day]={complete:[false,false,false,false],actions:{},earPlayed:false,earCorrect:false});
  const mark=(day,step)=>{getState(day).complete[step]=true;update(day,step)};
  const isComplete=(day,step)=>Boolean(getState(day).complete[step]);
  const message=(container,text,ok=false)=>{const el=container.querySelector(".interaction-message");if(el){el.textContent=text;el.className=`interaction-message ${ok?"ok":"warn"}`}};

  function renderConcept(container,day,lesson) {
    const state=getState(day);
    const correct=lesson.guide.concepts[day%lesson.guide.concepts.length];
    const options=[correct,...wrongBank[lesson.phaseIndex]];
    const rotated=options.slice(day%3).concat(options.slice(0,day%3));
    container.innerHTML=`<div class="interaction-box"><p class="interaction-kicker">理解挑战</p><h4>关于「${lesson.title}」，哪一项说法正确？</h4><div class="choice-grid">${rotated.map(option=>`<button data-choice="${option===correct?"correct":"wrong"}">${option}</button>`).join("")}</div><p class="interaction-message ${state.complete[0]?"ok":""}">${state.complete[0]?"✓ 已通过概念挑战":"选择后会立即告诉你结果"}</p></div>`;
    container.querySelectorAll("[data-choice]").forEach(button=>button.addEventListener("click",()=>{
      if(button.dataset.choice==="correct"){
        container.querySelectorAll("[data-choice]").forEach(el=>el.disabled=true);
        button.classList.add("correct");mark(day,0);message(container,"✓ 回答正确，可以进入声音实验",true);
      }else{button.classList.add("wrong");message(container,"还不对。回看上面的知识卡，再试一次。")}
    }));
  }

  function labShell(container,title,instruction,body) {
    container.innerHTML=`<div class="interaction-box lab-box"><p class="interaction-kicker">互动实验台</p><h4>${title}</h4><p>${instruction}</p>${body}<p class="interaction-message">先操作控件，再点击“验证并保存”</p></div>`;
  }

  function bindFinish(container,day,step,getValid) {
    const button=container.querySelector("[data-finish-lab]");
    button.addEventListener("click",()=>{
      const result=getValid();
      if(result.ok){mark(day,step);message(container,`✓ ${result.text}`,true)}else message(container,result.text);
    });
  }

  function renderSoundLab(container,day,lesson,step,creative) {
    let actions=0,played=false;
    const body=`<div class="sound-controls"><label>波形<select data-wave><option value="sine">柔和正弦</option><option value="triangle">三角</option><option value="square">方波</option><option value="sawtooth">锯齿</option></select></label><label>音高 <output data-pitch-out>C4</output><input data-pitch type="range" min="48" max="72" value="60"></label><label>时值 <output data-duration-out>0.8s</output><input data-duration type="range" min="3" max="16" value="8"></label></div><div class="mini-keys">${[60,62,64,65,67,69,71,72].map((note,index)=>`<button data-note="${note}">${["C","D","E","F","G","A","B","C"][index]}</button>`).join("")}</div><button class="lab-save" data-finish-lab>${creative?"验证并保存声音设计":"完成声音实验"}</button>`;
    labShell(container,creative?`创作挑战：${lesson.title}`:"改变声音，马上听差别",creative?lesson.guide.deliverable:"调节波形、音高和时值，再点击键盘试听。",body);
    const pitch=container.querySelector("[data-pitch]"),duration=container.querySelector("[data-duration]"),wave=container.querySelector("[data-wave]");
    const names=["C","C♯","D","E♭","E","F","F♯","G","A♭","A","B♭","B"];
    pitch.addEventListener("input",()=>{actions++;container.querySelector("[data-pitch-out]").textContent=`${names[pitch.value%12]}${Math.floor(pitch.value/12)-1}`});
    duration.addEventListener("input",()=>{actions++;container.querySelector("[data-duration-out]").textContent=`${(duration.value/10).toFixed(1)}s`});
    wave.addEventListener("change",()=>actions++);
    container.querySelectorAll("[data-note]").forEach(key=>key.addEventListener("click",()=>{played=true;actions++;pitch.value=key.dataset.note;AudioEngine.playTone(440*Math.pow(2,(Number(key.dataset.note)-69)/12),Number(duration.value)/10,wave.value)}));
    bindFinish(container,day,step,()=>played&&actions>=(creative?4:2)?{ok:true,text:"声音参数已保存到今日实验"}:{ok:false,text:"请至少调节两个参数并试听声音"});
  }

  function renderRhythmLab(container,day,lesson,step,creative) {
    const pattern=Array(16).fill(false);let edits=0,played=false;
    const body=`<div class="step-sequencer">${pattern.map((_,index)=>`<button data-beat="${index}"><small>${index+1}</small></button>`).join("")}</div><div class="lab-actions"><button data-play-pattern>▶ 播放节奏</button><button data-clear-pattern>清空</button></div><button class="lab-save" data-finish-lab>${creative?"保存今日鼓组":"完成节奏实验"}</button>`;
    labShell(container,creative?`创作挑战：${lesson.title}`:"16 步节奏机",creative?lesson.guide.deliverable:"点击方格放置鼓点，绿色竖线代表每拍起点。",body);
    container.querySelectorAll("[data-beat]").forEach(button=>button.addEventListener("click",()=>{const i=Number(button.dataset.beat);pattern[i]=!pattern[i];button.classList.toggle("on",pattern[i]);edits++}));
    container.querySelector("[data-play-pattern]").addEventListener("click",()=>{played=true;AudioEngine.playRhythm(pattern)});
    container.querySelector("[data-clear-pattern]").addEventListener("click",()=>{pattern.fill(false);container.querySelectorAll("[data-beat]").forEach(el=>el.classList.remove("on"));edits++});
    bindFinish(container,day,step,()=>pattern.filter(Boolean).length>=(creative?5:3)&&played?{ok:true,text:"节奏 Pattern 已保存"}:{ok:false,text:"请放置至少 3 个鼓点并点击播放"});
  }

  function renderMelodyLab(container,day,lesson,step,creative) {
    const notes=[];let played=false;
    const body=`<div class="melody-display" data-melody-display>点击下方音符开始写旋律</div><div class="note-palette">${[60,62,64,65,67,69,71,72].map((note,index)=>`<button data-add-note="${note}">${["C","D","E","F","G","A","B","C5"][index]}</button>`).join("")}</div><div class="lab-actions"><button data-play-melody>▶ 播放旋律</button><button data-undo-note>撤销</button></div><button class="lab-save" data-finish-lab>${creative?"保存旋律动机":"完成旋律实验"}</button>`;
    labShell(container,creative?`创作挑战：${lesson.title}`:"旋律积木",creative?lesson.guide.deliverable:"依次点击音符写出短旋律，再播放检查轮廓。",body);
    const updateDisplay=()=>container.querySelector("[data-melody-display]").innerHTML=notes.length?notes.map((note,index)=>`<i style="height:${22+(note-60)*4}px"><small>${index+1}</small></i>`).join(""):"点击下方音符开始写旋律";
    container.querySelectorAll("[data-add-note]").forEach(button=>button.addEventListener("click",()=>{if(notes.length<16){notes.push(Number(button.dataset.addNote));updateDisplay();AudioEngine.playTone(440*Math.pow(2,(Number(button.dataset.addNote)-69)/12),.34,"triangle")}}));
    container.querySelector("[data-play-melody]").addEventListener("click",()=>{if(notes.length){played=true;AudioEngine.playMelody(notes)}});
    container.querySelector("[data-undo-note]").addEventListener("click",()=>{notes.pop();updateDisplay()});
    bindFinish(container,day,step,()=>notes.length>=(creative?8:4)&&played?{ok:true,text:"旋律动机已保存"}:{ok:false,text:`请至少写 ${creative?8:4} 个音并完整播放一次`});
  }

  function renderHarmonyLab(container,day,lesson,step,creative) {
    const progression=[];let played=false;
    const chordSet=[{n:"C",v:[261.63,329.63,392]},{n:"Dm",v:[293.66,349.23,440]},{n:"Em",v:[329.63,392,493.88]},{n:"F",v:[349.23,440,523.25]},{n:"G",v:[392,493.88,587.33]},{n:"Am",v:[440,523.25,659.25]}];
    const body=`<div class="progression-slots" data-progression>选择和弦组成进行</div><div class="chord-choice">${chordSet.map((chord,index)=>`<button data-add-chord="${index}">${chord.n}</button>`).join("")}</div><div class="lab-actions"><button data-play-chords>▶ 播放进行</button><button data-clear-chords>清空</button></div><button class="lab-save" data-finish-lab>${creative?"保存和弦进行":"完成和声实验"}</button>`;
    labShell(container,creative?`创作挑战：${lesson.title}`:"和弦进行搭建器",creative?lesson.guide.deliverable:"选 4 个和弦组成进行，播放感受稳定与张力。",body);
    const display=()=>container.querySelector("[data-progression]").innerHTML=progression.length?progression.map(i=>`<b>${chordSet[i].n}</b>`).join("<span>→</span>"):"选择和弦组成进行";
    container.querySelectorAll("[data-add-chord]").forEach(button=>button.addEventListener("click",()=>{if(progression.length<8){const i=Number(button.dataset.addChord);progression.push(i);display();AudioEngine.playChord(chordSet[i].v)}}));
    container.querySelector("[data-play-chords]").addEventListener("click",()=>{if(!progression.length)return;played=true;const notes=progression.flatMap(i=>chordSet[i].v.map(f=>Math.round(69+12*Math.log2(f/440))));AudioEngine.playMelody(notes,"sine")});
    container.querySelector("[data-clear-chords]").addEventListener("click",()=>{progression.length=0;display()});
    bindFinish(container,day,step,()=>progression.length>=(creative?4:3)&&played?{ok:true,text:"和弦进行已保存"}:{ok:false,text:"请选至少 3 个和弦并播放完整进行"});
  }

  function renderFormLab(container,day,lesson,step,creative) {
    const sections=[];let energyChanged=false;
    const body=`<div class="form-timeline" data-form-timeline>点击段落按钮搭建结构</div><div class="section-choice">${["前奏","主歌","预副歌","副歌","桥段","尾奏"].map(name=>`<button data-section="${name}">${name}</button>`).join("")}</div><label class="energy-control">当前段落能量 <output data-energy-out>5/10</output><input data-energy type="range" min="1" max="10" value="5"></label><button class="lab-save" data-finish-lab>${creative?"保存曲式蓝图":"完成曲式实验"}</button>`;
    labShell(container,creative?`创作挑战：${lesson.title}`:"曲式与能量搭建器",creative?lesson.guide.deliverable:"加入段落并为最后一个段落设置能量。",body);
    const display=()=>container.querySelector("[data-form-timeline]").innerHTML=sections.length?sections.map(item=>`<b style="--energy:${item.energy}">${item.name}<small>${item.energy}</small></b>`).join(""):"点击段落按钮搭建结构";
    container.querySelectorAll("[data-section]").forEach(button=>button.addEventListener("click",()=>{if(sections.length<10){sections.push({name:button.dataset.section,energy:Number(container.querySelector("[data-energy]").value)});display()}}));
    container.querySelector("[data-energy]").addEventListener("input",event=>{energyChanged=true;container.querySelector("[data-energy-out]").textContent=`${event.target.value}/10`;if(sections.length){sections.at(-1).energy=Number(event.target.value);display()}});
    bindFinish(container,day,step,()=>sections.length>=(creative?5:3)&&energyChanged?{ok:true,text:"曲式与能量蓝图已保存"}:{ok:false,text:`请添加至少 ${creative?5:3} 个段落并调节能量`});
  }

  function renderSynthLab(container,day,lesson,step,creative) {
    let changes=0,played=false;
    const body=`<div class="synth-panel"><label>波形<select data-synth-wave><option value="sine">Sine</option><option value="triangle">Triangle</option><option value="square">Square</option><option value="sawtooth">Saw</option></select></label><label>亮度<input data-cutoff type="range" min="1" max="10" value="5"></label><label>起音<input data-attack type="range" min="1" max="10" value="2"></label><label>尾音<input data-release type="range" min="1" max="10" value="5"></label></div><button class="big-audition" data-audition-synth>▶ 试听当前音色</button><button class="lab-save" data-finish-lab>${creative?"保存音色预设":"完成音色实验"}</button>`;
    labShell(container,creative?`创作挑战：${lesson.title}`:"合成器控制台",creative?lesson.guide.deliverable:"调节波形与声音形状，随时试听。",body);
    container.querySelectorAll("select,input").forEach(control=>control.addEventListener("input",()=>changes++));
    container.querySelector("[data-audition-synth]").addEventListener("click",()=>{played=true;AudioEngine.playTone(261.63,.5+Number(container.querySelector("[data-release]").value)/10,container.querySelector("[data-synth-wave]").value)});
    bindFinish(container,day,step,()=>changes>=(creative?3:2)&&played?{ok:true,text:"音色预设已保存"}:{ok:false,text:"请调节至少两个参数并试听"});
  }

  function renderMixerLab(container,day,lesson,step,creative,mode="arrange") {
    let changes=0,played=false;
    const tracks=mode==="record"?["输入增益","麦克风距离","房间反射","监听音量"]:mode==="mix"?["Drums","Bass","Music","Vocal"]:["低频","和声","主旋律","点缀"];
    const body=`<div class="mini-mixer">${tracks.map((track,index)=>`<div><strong>${track}</strong><label>${mode==="record"?"数值":"音量"}<input data-mix-control type="range" min="0" max="100" value="${55+index*7}"></label><label>${mode==="record"?"位置":"声像"}<input data-mix-control type="range" min="0" max="100" value="50"></label><button data-mute>启用</button></div>`).join("")}</div><button class="big-audition" data-play-mix>▶ 试听当前设置</button><button class="lab-save" data-finish-lab>${creative?"保存当前方案":"完成控制实验"}</button>`;
    labShell(container,creative?`创作挑战：${lesson.title}`:mode==="record"?"录音信号模拟器":mode==="mix"?"四轨混音台":"编曲角色混音台",creative?lesson.guide.deliverable:"拖动推子、切换轨道并试听整体变化。",body);
    container.querySelectorAll("[data-mix-control]").forEach(control=>control.addEventListener("input",()=>changes++));
    container.querySelectorAll("[data-mute]").forEach(button=>button.addEventListener("click",()=>{button.classList.toggle("off");button.textContent=button.classList.contains("off")?"静音":"启用";changes++}));
    container.querySelector("[data-play-mix]").addEventListener("click",()=>{played=true;AudioEngine.playLesson(day,lesson.phaseIndex)});
    bindFinish(container,day,step,()=>changes>=(creative?5:3)&&played?{ok:true,text:`${mode==="record"?"录音":"混音/编曲"}方案已保存`}:{ok:false,text:"请调节至少三个控件并试听一次"});
  }

  function renderFinishLab(container,day,lesson,step,creative) {
    let decisions=0;
    const body=`<div class="priority-board"><button data-priority="阻塞">阻塞问题</button><button data-priority="重要">重要修改</button><button data-priority="可选">可选优化</button></div><div class="export-choice"><label>格式<select data-decision><option>24-bit WAV</option><option>320 kbps MP3</option></select></label><label>版本<select data-decision><option>Master</option><option>Instrumental</option><option>Pre-master</option></select></label><label>发布状态<select data-decision><option>准备检查</option><option>已冻结</option><option>可发布</option></select></label></div><button class="lab-save" data-finish-lab>${creative?"冻结并保存决定":"完成发布决策"}</button>`;
    labShell(container,creative?`创作挑战：${lesson.title}`:"完成与发布决策板",creative?lesson.guide.deliverable:"选择问题优先级、导出格式与发布状态。",body);
    container.querySelectorAll("[data-priority]").forEach(button=>button.addEventListener("click",()=>{container.querySelectorAll("[data-priority]").forEach(el=>el.classList.remove("active"));button.classList.add("active");decisions++}));
    container.querySelectorAll("[data-decision]").forEach(select=>select.addEventListener("change",()=>decisions++));
    bindFinish(container,day,step,()=>decisions>=(creative?3:2)?{ok:true,text:"发布决定已记录"}:{ok:false,text:"请完成优先级与至少一个导出决定"});
  }

  function renderLab(container,day,lesson,step,creative) {
    const phase=lesson.phaseIndex;
    if(phase===0)return renderSoundLab(container,day,lesson,step,creative);
    if(phase===1)return renderRhythmLab(container,day,lesson,step,creative);
    if(phase===2)return renderMelodyLab(container,day,lesson,step,creative);
    if(phase===3)return renderHarmonyLab(container,day,lesson,step,creative);
    if(phase===4)return renderFormLab(container,day,lesson,step,creative);
    if(phase===5)return renderSynthLab(container,day,lesson,step,creative);
    if(phase===6)return renderMixerLab(container,day,lesson,step,creative,"arrange");
    if(phase===7)return renderMixerLab(container,day,lesson,step,creative,"record");
    if(phase===8)return renderMixerLab(container,day,lesson,step,creative,"mix");
    return renderFinishLab(container,day,lesson,step,creative);
  }

  function renderEar(container,day,lesson) {
    const state=getState(day),data=earData[lesson.phaseIndex];
    container.innerHTML=`<div class="interaction-box ear-box"><p class="interaction-kicker">听辨问题</p><h4>${data[0]}</h4><div class="choice-grid">${data[1].map((option,index)=>`<button data-ear-choice="${index}">${option}</button>`).join("")}</div><p class="interaction-message ${state.complete[2]?"ok":""}">${state.complete[2]?"✓ 已完成听辨":"先播放上方音频，再选择答案"}</p></div>`;
    const audio=document.getElementById("lesson-native-audio");
    AudioEngine.attach(audio,day,lesson.phaseIndex,error=>{
      if(error){message(container,"播放器读取失败：请检查浏览器标签页是否静音");return}
      state.earPlayed=true;checkEar();
    });
    const checkEar=()=>{if(state.earPlayed&&state.earCorrect){mark(day,2);message(container,"✓ 播放与听辨都已完成",true)}};
    container.querySelectorAll("[data-ear-choice]").forEach(button=>button.addEventListener("click",()=>{
      if(Number(button.dataset.earChoice)===data[2]){state.earCorrect=true;button.classList.add("correct");checkEar();if(!state.earPlayed)message(container,"答案正确。现在请点击上方原生播放器听一遍。")}
      else{button.classList.add("wrong");message(container,"再听一遍，关注题目要求的变化。")}
    }));
  }

  function prepare(day,lesson,savedStep,onUpdate) {
    update=onUpdate||(()=>{});
    const state=getState(day);
    for(let i=0;i<Math.min(savedStep,4);i++)state.complete[i]=true;
    renderConcept(document.getElementById("concept-interaction"),day,lesson);
    renderLab(document.getElementById("example-interaction"),day,lesson,1,false);
    renderEar(document.getElementById("ear-interaction"),day,lesson);
    renderLab(document.getElementById("creation-interaction"),day,lesson,3,true);
  }

  function showRequired(day,step) {
    const ids=["concept-interaction","example-interaction","ear-interaction","creation-interaction"];
    const container=document.getElementById(ids[step]);
    if(container){message(container,["请先回答概念挑战","请先完成互动实验并验证","请先播放音频并回答听辨问题","请完成创作挑战并保存"][step]);container.scrollIntoView({behavior:"smooth",block:"center"})}
  }

  return {prepare,isComplete,showRequired};
})();
