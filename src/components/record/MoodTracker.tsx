import { useFirebase } from '../../contexts/FirebaseContext'

const MOODS = [
  { emoji: '😢', label: '슬퍼요', value: 0 },
  { emoji: '😕', label: '별로예요', value: 1 },
  { emoji: '😊', label: '괜찮아요', value: 2 },
  { emoji: '😄', label: '좋아요', value: 3 },
  { emoji: '🥰', label: '최고예요', value: 4 },
]

export default function MoodTracker() {
  const { data, updateData } = useFirebase()
  const todayStr = new Date().toISOString().split('T')[0]
  const todayMood = data.moods?.today || {}
  const myMood = todayMood['나'] ?? todayMood.na
  const yourMood = todayMood['너'] ?? todayMood.you

  const selectMood = (who: 'na' | 'you', value: number) => {
    const keyMap = who === 'na' ? '나' : '너'
    updateData(prev => ({
      ...prev,
      moods: {
        ...prev.moods,
        today: { ...prev.moods.today, [keyMap]: value },
        history: [
          ...prev.moods.history.filter((m: any) => m.date !== todayStr),
          { date: todayStr, mood_na: who === 'na' ? value : (prev.moods.today?.['나'] ?? prev.moods.today?.na), mood_you: who === 'you' ? value : (prev.moods.today?.['너'] ?? prev.moods.today?.you) }
        ]
      }
    }))
  }

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      <div className="glass-card p-6 mb-4 text-center">
        <h3 className="text-lg font-black text-gray-800 mb-1">😊 오늘의 기분</h3>
        <p className="text-xs text-gray-400 mb-6">서로의 감정을 공유해보세요</p>

        {/* My mood */}
        <div className="mb-6">
          <div className="text-[12px] font-bold text-gray-500 mb-3">{data.names.me || '나'}의 기분</div>
          <div className="flex justify-center gap-3">
            {MOODS.map(m => (
              <button key={m.value} onClick={() => selectMood('na', m.value)}
                className={`text-3xl transition-all duration-300 ${myMood === m.value ? 'scale-[1.35] drop-shadow-lg' : 'opacity-40 hover:opacity-70 hover:scale-110'}`}>
                {m.emoji}
              </button>
            ))}
          </div>
          {myMood !== undefined && (
            <div className="text-xs text-teal font-bold mt-2">{MOODS[myMood]?.label}</div>
          )}
        </div>

        <div className="h-px bg-gray-100 my-4" />

        {/* Partner mood */}
        <div>
          <div className="text-[12px] font-bold text-gray-500 mb-3">{data.names.you || '너'}의 기분</div>
          <div className="flex justify-center gap-3">
            {MOODS.map(m => (
              <button key={m.value} onClick={() => selectMood('you', m.value)}
                className={`text-3xl transition-all duration-300 ${yourMood === m.value ? 'scale-[1.35] drop-shadow-lg' : 'opacity-40 hover:opacity-70 hover:scale-110'}`}>
                {m.emoji}
              </button>
            ))}
          </div>
          {yourMood !== undefined && (
            <div className="text-xs text-coral font-bold mt-2">{MOODS[yourMood]?.label}</div>
          )}
        </div>
      </div>

      {/* History */}
      {data.moods.history.length > 0 && (
        <div>
          <h4 className="text-[14px] font-bold text-gray-800 mb-3 px-1">📊 기분 기록</h4>
          <div className="space-y-2">
            {[...data.moods.history].reverse().slice(0, 14).map((entry, i) => (
              <div key={i} className="glass-card p-3 flex items-center justify-between">
                <span className="text-[12px] text-gray-400 font-semibold">{entry.date}</span>
                <div className="flex gap-4">
                  <span className="text-lg">{(entry.na ?? (entry as any).mood_na) !== undefined ? MOODS[(entry.na ?? (entry as any).mood_na)]?.emoji : '—'}</span>
                  <span className="text-lg">{(entry.you ?? (entry as any).mood_you) !== undefined ? MOODS[(entry.you ?? (entry as any).mood_you)]?.emoji : '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
