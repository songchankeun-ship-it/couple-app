import { useFirebase } from '../../contexts/FirebaseContext'
import { SPACE_PRESETS } from '../../types/data'

export default function HomeDashboard() {
  const { data, connected, roomName } = useFirebase()
  const spaceType = data.spaceType || 'couple'
  const preset = SPACE_PRESETS[spaceType]

  const diffDays = data.ddayDate
    ? Math.floor((Date.now() - new Date(data.ddayDate).getTime()) / 86400000) + 1
    : 0

  const streakEmoji = data.streak.current >= 365 ? '👑' :
    data.streak.current >= 100 ? '💎' :
    data.streak.current >= 30 ? '🔥' :
    data.streak.current >= 7 ? '⚡' :
    data.streak.current >= 3 ? '✨' : '💤'

  const lastPhoto = data.album[data.album.length - 1]
  const lastMsg = data.chat[data.chat.length - 1]
  const lastMemo = data.memos[data.memos.length - 1]

  // Non-couple space types get a different home
  if (spaceType !== 'couple') {
    const todosDone = (data.todos || []).filter(t => t.done).length
    const todosTotal = (data.todos || []).length
    const budgetTotal = (data.budget || []).reduce((s: number, b: any) => s + (b.amount || 0), 0)
    const checkDone = (data.checklist || []).filter((c: any) => c.checked).length
    const checkTotal = (data.checklist || []).length

    return (
      <div className="animate-fade-in-up">
        {/* Hero */}
        <div className="relative rounded-[28px] overflow-hidden mx-4 mt-2 mb-4 px-5 py-8 text-center shadow-lg"
          style={{ background: `linear-gradient(135deg, ${preset.color}DD, ${preset.color}99)` }}>
          <div className="relative z-10">
            <div className="text-5xl mb-2">{preset.emoji}</div>
            <div className="text-xl font-black text-white">{data.spaceName || preset.label}</div>
            <div className="text-xs text-white/70 mt-1">{data.names.me || '나'}{(data.members || []).length > 0 ? ` 외 ${data.members!.length}명` : ''}</div>
            {connected && roomName && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/15 text-white/90 border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                  🔗 {roomName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mx-4 mb-4">
          <div className="glass-card p-3 text-center">
            <div className="text-xl mb-0.5">💬</div>
            <div className="text-lg font-black text-gray-800">{data.chat.length}</div>
            <div className="text-[10px] text-gray-400 font-bold">대화</div>
          </div>
          <div className="glass-card p-3 text-center">
            <div className="text-xl mb-0.5">📸</div>
            <div className="text-lg font-black text-gray-800">{data.album.length}</div>
            <div className="text-[10px] text-gray-400 font-bold">사진</div>
          </div>
          <div className="glass-card p-3 text-center">
            <div className="text-xl mb-0.5">📅</div>
            <div className="text-lg font-black text-gray-800">{data.events.length}</div>
            <div className="text-[10px] text-gray-400 font-bold">일정</div>
          </div>
        </div>

        {/* Space-specific cards */}
        <div className="mx-4 space-y-3">
          {todosTotal > 0 && (
            <div className="glass-card p-4">
              <div className="text-[11px] font-bold text-teal mb-1.5">📋 할 일</div>
              <div className="text-[22px] font-black text-gray-800">{todosDone} / {todosTotal}</div>
              <div className="h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-teal rounded-full" style={{ width: `${todosTotal ? todosDone / todosTotal * 100 : 0}%` }} />
              </div>
            </div>
          )}

          {budgetTotal > 0 && (
            <div className="glass-card p-4">
              <div className="text-[11px] font-bold text-coral mb-1.5">💰 총 지출</div>
              <div className="text-[22px] font-black text-gray-800">{budgetTotal.toLocaleString()}원</div>
            </div>
          )}

          {checkTotal > 0 && (
            <div className="glass-card p-4">
              <div className="text-[11px] font-bold text-purple-500 mb-1.5">✅ 체크리스트</div>
              <div className="text-[22px] font-black text-gray-800">{checkDone} / {checkTotal}</div>
            </div>
          )}

          {lastMsg && (
            <div className="glass-card p-4">
              <div className="text-[11px] font-bold text-teal mb-1.5">💬 최근 대화</div>
              <div className="text-[13px] font-semibold text-gray-800">{lastMsg.text}</div>
              <div className="text-[10px] text-gray-400 mt-1">{lastMsg.time}</div>
            </div>
          )}

          {todosTotal === 0 && budgetTotal === 0 && checkTotal === 0 && !lastMsg && (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-3">{preset.emoji}</div>
              <p className="text-sm font-semibold">공간을 채워보세요!</p>
              <p className="text-xs mt-1">채팅, 일정, 사진을 추가해보세요</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up">
      {/* Hero - Cute Pink Gradient */}
      <div className="hero-gradient relative rounded-[32px] overflow-hidden mx-4 mt-2 mb-5 px-5 py-10 text-center shadow-[0_12px_40px_rgba(236,72,153,0.2)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.15)_0%,transparent_50%),radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.1)_0%,transparent_40%)]" />

        <div className="relative z-10">
          {data.ddayDate ? (
            <>
              {/* Cute label */}
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold text-white/90 mb-3 border border-white/15">
                💕 우리가 함께한 날
              </div>

              <div className="text-[72px] font-black text-white tracking-tighter leading-none mb-1 drop-shadow-lg animate-bounce-in">
                {diffDays}
              </div>
              <div className="text-[12px] font-bold text-white/70 tracking-[3px] uppercase mb-4">
                days together
              </div>

              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-white border border-white/20 shadow-[0_2px_12px_rgba(255,255,255,0.1)]">
                  {streakEmoji} {data.streak.current}일 연속
                </span>
              </div>
            </>
          ) : (
            <div className="text-white text-lg font-bold animate-float">💕 사귄 날짜를 설정해주세요</div>
          )}
        </div>

        {/* Connection badge */}
        {roomName && (
          <div className="relative z-10 mt-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${connected ? 'bg-white/20 text-white/90 border border-white/25' : 'bg-yellow-400/20 text-yellow-100 border border-yellow-300/30'}`}>   <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-300 animate-pulse' : 'bg-yellow-300'}`} />
              {connected ? `🔗 ${roomName}` : '⏳ 연결 중...'}
            </span>
          </div>
        )}

        {/* Floating decorations */}
        {['💖', '✨', '🌸', '💫'].map((emoji, i) => (
          <span
            key={i}
            className="absolute text-sm animate-float opacity-60"
            style={{
              left: `${[8, 82, 42, 92][i]}%`,
              top: `${[12, 18, 72, 55][i]}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${2.5 + i * 0.5}s`
            }}
          >
            {emoji}
          </span>
        ))}

        {/* Sparkles */}
        {[15, 75, 50, 90].map((left, i) => (
          <span key={`s${i}`} className="absolute w-1.5 h-1.5 rounded-full bg-white animate-sparkle shadow-[0_0_6px_rgba(255,255,255,0.6)]"
            style={{ left: `${left}%`, top: `${20 + i * 15}%`, animationDelay: `${i * 0.6}s` }} />
        ))}

        {/* Wave curve */}
        <div className="absolute -bottom-px left-0 right-0 h-8 bg-bg rounded-t-[28px] z-20" />
      </div>

      {/* Profile Section - Cute */}
      <div className="flex items-center justify-center gap-6 py-2 mb-3">
        <div className="text-center animate-fade-in-up stagger-1">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-2xl border-[3px] border-white shadow-[0_4px_20px_rgba(236,72,153,0.15)] overflow-hidden">
              {data.couplePhoto ? <img src={data.couplePhoto} alt="" className="w-full h-full object-cover" /> : '🧑'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 text-xs animate-wiggle">💝</span>
          </div>
          <div className="text-[11px] font-bold text-gray-500 mt-2">{data.names.me || '나'}</div>
        </div>

        <div className="flex flex-col items-center gap-1 animate-fade-in-up stagger-2">
          <div className="flex items-center gap-1">
            <div className="w-5 h-px bg-gradient-to-r from-transparent to-pink-300" />
            <span className="text-lg animate-heartbeat">💕</span>
            <div className="w-5 h-px bg-gradient-to-r from-pink-300 to-transparent" />
          </div>
          {data.ddayDate && (
            <span className="text-[10px] font-bold text-pink-300">D+{diffDays}</span>
          )}
        </div>

        <div className="text-center animate-fade-in-up stagger-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-2xl border-[3px] border-white shadow-[0_4px_20px_rgba(236,72,153,0.15)] overflow-hidden">
              {data.couplePhoto ? <img src={data.couplePhoto} alt="" className="w-full h-full object-cover" /> : '👩'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 text-xs animate-wiggle" style={{ animationDelay: '0.5s' }}>💝</span>
          </div>
          <div className="text-[11px] font-bold text-gray-500 mt-2">{data.names.you || '너'}</div>
        </div>
      </div>

      {/* Quick Stats - Cute Mini Cards */}
      <div className="grid grid-cols-3 gap-2 px-4 mb-4">
        <div className="glass-card p-2.5 text-center animate-fade-in-up stagger-1">
          <div className="text-lg mb-0.5">📸</div>
          <div className="text-base font-black text-gray-800">{data.album.length}</div>
          <div className="text-[9px] text-pink-400 font-bold">추억</div>
        </div>
        <div className="glass-card p-2.5 text-center animate-fade-in-up stagger-2">
          <div className="text-lg mb-0.5">💬</div>
          <div className="text-base font-black text-gray-800">{data.chat.length}</div>
          <div className="text-[9px] text-pink-400 font-bold">대화</div>
        </div>
        <div className="glass-card p-2.5 text-center animate-fade-in-up stagger-3">
          <div className="text-lg mb-0.5">📅</div>
          <div className="text-base font-black text-gray-800">{data.events.length}</div>
          <div className="text-[9px] text-pink-400 font-bold">일정</div>
        </div>
      </div>

      {/* Bento Grid - Cute Cards */}
      <div className="grid grid-cols-2 gap-2.5 px-4 pb-24">
        {/* Photo - Full width */}
        <div className="glass-card col-span-2 h-[150px] overflow-hidden cursor-pointer animate-fade-in-up stagger-2">
          {lastPhoto ? (
            <div className="relative w-full h-full">
              <img src={lastPhoto.src} alt="" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-pink-900/40 to-transparent px-4 pt-6 pb-3">
                <span className="text-white text-xs font-bold flex items-center gap-1">🌸 {data.album.length}장의 추억</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-pink-300 text-sm font-semibold bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 rounded-[20px]">
              <span className="text-3xl animate-float">📷</span>
              <span>첫 사진을 남겨보세요 💕</span>
            </div>
          )}
        </div>

        {/* Last message */}
        <div className="glass-card p-4 min-h-[110px] cursor-pointer animate-fade-in-up stagger-3">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-sm">💬</span>
            <span className="text-[11px] font-bold text-teal">마지막 대화</span>
          </div>
          {lastMsg ? (
            <>
              <div className="text-[13px] font-semibold text-gray-700 line-clamp-2 leading-relaxed">{lastMsg.text}</div>
              <div className="text-[10px] text-pink-300 mt-1.5 font-medium">{lastMsg.time}</div>
            </>
          ) : (
            <div className="text-[13px] font-semibold text-pink-200 mt-2">아직 대화가 없어요 🤫</div>
          )}
        </div>

        {/* Letter */}
        <div className="glass-card p-4 min-h-[110px] cursor-pointer animate-fade-in-up stagger-4">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-sm">💌</span>
            <span className="text-[11px] font-bold text-coral">편지함</span>
          </div>
          {lastMemo ? (
            <div className="text-[13px] font-semibold text-gray-700 italic line-clamp-2 leading-relaxed">
              "{(lastMemo.title || lastMemo.body || lastMemo.text || '').substring(0, 30)}..."
            </div>
          ) : (
            <div className="text-[13px] font-semibold text-pink-200 mt-2">첫 편지를 써보세요 🩷</div>
          )}
        </div>

        {/* Garden */}
        <div className="glass-card col-span-2 p-4 flex items-center justify-between bg-gradient-to-br from-pink-50/90 to-purple-50/90 cursor-pointer animate-fade-in-up stagger-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-wiggle">🌳</span>
            <div>
              <div className="text-[13px] font-extrabold text-teal-dark">우리의 정원</div>
              <div className="text-[11px] font-semibold text-pink-400">함께 가꿔봐요</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-pink-100">
            <span className="text-xs">✨</span>
            <span className="text-[12px] font-black text-teal-dark">{data.garden?.feeds ? data.garden.feeds * 10 : 0} XP</span>
          </div>
        </div>
      </div>
    </div>
  )
}
