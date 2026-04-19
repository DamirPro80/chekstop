// AdminPanel.jsx — companion desktop admin view shown next to the phone
const { useState: useAdminState } = React;
const C = window.MiniApp.COLORS;

function AdminPanel({ t, lang, members, activity, stats, recent, queueCount }) {
  return (
    <div style={{
      width: 720, height: 892, background: C.bg,
      borderRadius: 18, border: `1px solid ${C.divider}`,
      boxShadow: '0 30px 80px rgba(0,0,0,0.18)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: 'Manrope, sans-serif',
    }}>
      {/* Top chrome */}
      <div style={{
        padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: `1px solid ${C.divider}`, background: C.card,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, background: C.accent,
          display: 'grid', placeItems: 'center', color: '#fff',
        }}>
          <Icon name="shield-check" size={18} strokeWidth={2.2} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{t.adminTitle}</div>
          <div style={{ fontSize: 11.5, color: C.inkMuted }}>{t.adminSub} · t.me/chekstop_bot</div>
        </div>
        {queueCount > 0 && (
          <div style={{
            padding: '6px 10px', borderRadius: 99, background: C.pendingSoft,
            fontSize: 11, fontWeight: 700, color: C.pendingInk,
            display: 'flex', alignItems: 'center', gap: 5, border: `1px solid ${C.divider}`,
          }}>
            <Icon name="clock" size={11} strokeWidth={2.5} />
            {queueCount} {t.waiting}
          </div>
        )}
        <div style={{
          padding: '6px 10px', borderRadius: 99, background: C.bgWarm,
          fontSize: 11, fontWeight: 600, color: C.inkSoft,
          display: 'flex', alignItems: 'center', gap: 5, border: `1px solid ${C.divider}`,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: C.success,
          }} />
          live
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Stats row */}
        <div>
          <div style={{
            fontSize: 11, fontWeight: 600, color: C.inkMuted,
            textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10,
          }}>{t.weekStats}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            <BigStat label={t.verified_count} value={stats.verified} icon="check"
              color={C.successInk} bg={C.successSoft} delta="+18%" />
            <BigStat label={t.fraud_count} value={stats.fraud} icon="x"
              color={C.alertInk} bg={C.alertSoft} delta="+2" deltaBad />
            <BigStat label={t.pending_count} value={stats.pending} icon="clock"
              color={'oklch(50% 0.13 75)'} bg={C.pendingSoft} delta="−1" />
            <BigStat label={t.totalAmount} value={`${(stats.amount/1000).toFixed(0)}k`} unit="₸"
              icon="wallet" color={C.accentInk} bg={C.accentSoft} delta="+24%" />
          </div>
        </div>

        {/* Chart card */}
        <ChartCard t={t} lang={lang} />

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 14 }}>
          {/* Team */}
          <div style={{
            background: C.card, borderRadius: 16, border: `1px solid ${C.divider}`,
            padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{t.team}</div>
                <div style={{ fontSize: 11.5, color: C.inkMuted }}>
                  {members.length} {t.members} · {members.filter(m => m.online).length} {t.online}
                </div>
              </div>
              <button style={{
                background: C.accentSoft, color: C.accentInk, border: 'none',
                borderRadius: 10, padding: '6px 10px', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: 'inherit',
              }}>
                <Icon name="plus" size={13} strokeWidth={2.5} /> {t.addMember}
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {members.map((m, i) => <MemberRow key={i} m={m} t={t} />)}
            </div>
          </div>

          {/* Activity */}
          <div style={{
            background: C.card, borderRadius: 16, border: `1px solid ${C.divider}`,
            padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{t.activityFeed}</div>
              <Icon name="bell" size={14} color={C.inkMuted} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 2 }}>
              {activity.map((a, i) => <ActivityItem key={i} a={a} t={t} last={i === activity.length - 1} />)}
            </div>
          </div>
        </div>

        {/* Operations table */}
        <div style={{
          background: C.card, borderRadius: 16, border: `1px solid ${C.divider}`, overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 16px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', borderBottom: `1px solid ${C.divider}`,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{t.operations}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={pillBtn}><Icon name="download" size={12} /> CSV</button>
              <button style={pillBtn}><Icon name="filter" size={12} /></button>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: C.bgWarm }}>
                {[t.operation, t.sender, t.amount, t.date, t.status, ''].map((h, i) => (
                  <th key={i} style={{
                    padding: '9px 14px', textAlign: i === 2 ? 'right' : 'left',
                    fontSize: 11, fontWeight: 600, color: C.inkMuted,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    borderBottom: `1px solid ${C.divider}`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.slice(0, 5).map((r, i) => <OpRow key={i} r={r} t={t} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const pillBtn = {
  background: C.bgWarm, border: `1px solid ${C.divider}`, borderRadius: 8,
  padding: '5px 9px', fontSize: 11, fontWeight: 600, color: C.inkSoft,
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
  fontFamily: 'inherit',
};

function BigStat({ label, value, unit, icon, color, bg, delta, deltaBad }) {
  return (
    <div style={{
      background: C.card, borderRadius: 14, padding: 14,
      border: `1px solid ${C.divider}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 9, background: bg, color,
          display: 'grid', placeItems: 'center',
        }}>
          <Icon name={icon} size={15} strokeWidth={2.2} />
        </div>
        {delta && (
          <span style={{
            fontSize: 10.5, fontWeight: 700,
            color: deltaBad ? C.alertInk : C.successInk,
            background: deltaBad ? C.alertSoft : C.successSoft,
            padding: '3px 6px', borderRadius: 6,
          }}>{delta}</span>
        )}
      </div>
      <div style={{ fontSize: 11, color: C.inkMuted, fontWeight: 500 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 1 }}>
        <span style={{
          fontSize: 22, fontWeight: 700, color: C.ink, letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
        }}>{value}</span>
        {unit && <span style={{ fontSize: 12, color: C.inkSoft, fontWeight: 500 }}>{unit}</span>}
      </div>
    </div>
  );
}

function ChartCard({ t, lang }) {
  // Mock 7-day bars: each = [verified, pending, fraud]
  const data = [
    [4, 1, 0], [6, 0, 1], [3, 1, 0], [8, 2, 0], [5, 0, 1], [7, 1, 0], [9, 1, 0],
  ];
  const days = lang === 'ru'
    ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    : ['Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сн', 'Жс'];
  const max = Math.max(...data.map(d => d.reduce((a, b) => a + b, 0)));
  return (
    <div style={{
      background: C.card, borderRadius: 16, border: `1px solid ${C.divider}`, padding: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>
            {lang === 'ru' ? 'Поток чеков' : 'Чектер ағыны'}
          </div>
          <div style={{ fontSize: 11.5, color: C.inkMuted }}>
            {lang === 'ru' ? 'Последние 7 дней' : 'Соңғы 7 күн'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, fontSize: 11, color: C.inkSoft }}>
          <Legend dot={C.success} label={t.verified_count} />
          <Legend dot={C.pending} label={t.pending_count} />
          <Legend dot={C.alert} label={t.fraud_count} />
        </div>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 14,
        height: 130, alignItems: 'end',
      }}>
        {data.map((d, i) => {
          const total = d.reduce((a, b) => a + b, 0);
          const h = (total / max) * 110;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: '100%', maxWidth: 36, height: h, borderRadius: 6,
                display: 'flex', flexDirection: 'column-reverse', overflow: 'hidden',
                background: C.bgWarm,
              }}>
                <div style={{ background: C.success, height: `${(d[0]/total)*100}%` }} />
                <div style={{ background: C.pending, height: `${(d[1]/total)*100}%` }} />
                <div style={{ background: C.alert, height: `${(d[2]/total)*100}%` }} />
              </div>
              <div style={{ fontSize: 10.5, color: C.inkMuted, fontWeight: 600 }}>{days[i]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Legend({ dot, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 8, height: 8, borderRadius: 3, background: dot }} />
      {label}
    </div>
  );
}

function MemberRow({ m, t }) {
  const roleLabels = { owner: t.role_owner, admin: t.role_admin, staff: t.role_staff };
  const roleColor = { owner: C.accentInk, admin: C.successInk, staff: C.inkSoft };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', background: m.avatarBg,
        color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0,
        fontSize: 12, fontWeight: 700,
      }}>{m.initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: 'flex', alignItems: 'center', gap: 6 }}>
          {m.name}
          {m.role === 'owner' && <Icon name="crown" size={12} color={C.accent} />}
        </div>
        <div style={{ fontSize: 11, color: C.inkMuted }}>{m.checks} {t.checks}</div>
      </div>
      <div style={{
        fontSize: 10.5, fontWeight: 600, color: roleColor[m.role],
        textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>{roleLabels[m.role]}</div>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: m.online ? C.success : C.divider, marginLeft: 4,
      }} />
    </div>
  );
}

function ActivityItem({ a, t, last }) {
  const map = {
    verified: { color: C.successInk, bg: C.successSoft, icon: 'check' },
    fraud: { color: C.alertInk, bg: C.alertSoft, icon: 'x' },
    member: { color: C.accentInk, bg: C.accentSoft, icon: 'users' },
  };
  const s = map[a.kind];
  return (
    <div style={{ display: 'flex', gap: 10, position: 'relative' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 8, background: s.bg, color: s.color,
          display: 'grid', placeItems: 'center',
        }}>
          <Icon name={s.icon} size={13} strokeWidth={2.4} />
        </div>
        {!last && (
          <div style={{
            position: 'absolute', left: 13, top: 28, bottom: -10, width: 1,
            background: C.divider,
          }} />
        )}
      </div>
      <div style={{ flex: 1, paddingBottom: last ? 0 : 2 }}>
        <div style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.4 }}>
          <strong style={{ fontWeight: 600 }}>{a.who}</strong> {a.text}
        </div>
        <div style={{ fontSize: 10.5, color: C.inkMuted, marginTop: 2 }}>{a.time}</div>
      </div>
    </div>
  );
}

function OpRow({ r, t }) {
  const map = {
    verified: { color: C.successInk, bg: C.successSoft, label: t.verified_count },
    fraud: { color: C.alertInk, bg: C.alertSoft, label: t.fraud_count },
    pending: { color: 'oklch(50% 0.13 75)', bg: C.pendingSoft, label: t.pending_count },
  };
  const s = map[r.status];
  return (
    <tr style={{ borderBottom: `1px solid ${C.divider}` }}>
      <td style={{ padding: '11px 14px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11.5, color: C.inkSoft }}>
        {r.opId}
      </td>
      <td style={{ padding: '11px 14px', fontWeight: 600, color: C.ink, fontSize: 12.5 }}>
        {r.sender}
      </td>
      <td style={{
        padding: '11px 14px', textAlign: 'right', fontWeight: 600, color: C.ink,
        fontVariantNumeric: 'tabular-nums', fontSize: 12.5,
      }}>
        {r.amount.toLocaleString('ru-KZ')} ₸
      </td>
      <td style={{ padding: '11px 14px', color: C.inkSoft, fontSize: 12 }}>{r.timeLabel}</td>
      <td style={{ padding: '11px 14px' }}>
        <span style={{
          fontSize: 10.5, fontWeight: 600, color: s.color, background: s.bg,
          padding: '3px 8px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>{s.label}</span>
      </td>
      <td style={{ padding: '11px 14px', textAlign: 'right' }}>
        <Icon name="more" size={14} color={C.inkMuted} />
      </td>
    </tr>
  );
}

window.AdminPanel = AdminPanel;
