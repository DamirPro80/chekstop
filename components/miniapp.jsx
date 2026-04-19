// MiniApp.jsx — Telegram Mini App content (PDF upload + team moderation)
const { useState, useEffect, useRef } = React;

const COLORS = {
  bg: 'oklch(98% 0.008 80)',
  bgWarm: 'oklch(96% 0.014 75)',
  card: '#ffffff',
  cardHover: 'oklch(97% 0.01 80)',
  ink: 'oklch(22% 0.012 60)',
  inkSoft: 'oklch(45% 0.015 60)',
  inkMuted: 'oklch(62% 0.012 60)',
  divider: 'oklch(92% 0.008 70)',
  accent: 'oklch(66% 0.14 40)',
  accentSoft: 'oklch(94% 0.04 50)',
  accentInk: 'oklch(38% 0.13 40)',
  success: 'oklch(60% 0.11 155)',
  successSoft: 'oklch(95% 0.04 155)',
  successInk: 'oklch(34% 0.09 155)',
  alert: 'oklch(58% 0.18 28)',
  alertSoft: 'oklch(95% 0.05 28)',
  alertInk: 'oklch(38% 0.16 28)',
  pending: 'oklch(72% 0.13 75)',
  pendingSoft: 'oklch(95% 0.05 80)',
  pendingInk: 'oklch(50% 0.13 75)',
};

function TgMiniHeader({ lang, onLang, onBack, title, subtitle, badge }) {
  return (
    <div style={{
      background: COLORS.bg, padding: '12px 14px 10px',
      display: 'flex', alignItems: 'center', gap: 10,
      borderBottom: `1px solid ${COLORS.divider}`,
    }}>
      {onBack ? (
        <button onClick={onBack} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          width: 32, height: 32, borderRadius: 16, display: 'grid', placeItems: 'center',
          color: COLORS.ink, padding: 0,
        }}><Icon name="arrow-left" size={20} /></button>
      ) : (
        <div style={{
          width: 32, height: 32, borderRadius: 10, display: 'grid', placeItems: 'center',
          background: COLORS.accent, color: '#fff',
        }}><Icon name="shield-check" size={18} strokeWidth={2.2} /></div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.ink, lineHeight: '18px', display: 'flex', alignItems: 'center', gap: 6 }}>
          {title || 'ЧекСтоп'}
          {badge != null && (
            <span style={{
              background: COLORS.accent, color: '#fff', fontSize: 10, fontWeight: 700,
              padding: '1px 6px', borderRadius: 99, minWidth: 16, textAlign: 'center',
            }}>{badge}</span>
          )}
        </div>
        <div style={{ fontSize: 12, color: COLORS.inkMuted, lineHeight: '14px' }}>
          {subtitle || 'mini app · bot'}
        </div>
      </div>
      <button onClick={onLang} style={{
        background: COLORS.bgWarm, border: `1px solid ${COLORS.divider}`,
        borderRadius: 14, padding: '6px 10px', fontSize: 11, fontWeight: 600,
        color: COLORS.inkSoft, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
        fontFamily: 'inherit',
      }}><Icon name="globe" size={12} />{lang.toUpperCase()}</button>
    </div>
  );
}

// ─── HOME ──────────────────────────────────────────────
function HomeScreen({ t, onUpload, onQueue, onResult, queue, recent, todayCount, todaySum }) {
  return (
    <div style={{ padding: '18px 16px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.ink, letterSpacing: '-0.01em', fontFamily: 'Manrope, sans-serif' }}>
          {t.homeGreeting}
        </div>
        <div style={{ fontSize: 13.5, color: COLORS.inkSoft, lineHeight: 1.45, marginTop: 4, textWrap: 'pretty' }}>
          {t.homeSub}
        </div>
      </div>

      {/* Upload card */}
      <div style={{
        background: 'linear-gradient(160deg, oklch(95% 0.04 50) 0%, oklch(97% 0.025 60) 100%)',
        borderRadius: 20, padding: 18, border: `1px solid ${COLORS.divider}`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -30, top: -20, width: 130, height: 130,
          borderRadius: '50%', background: 'oklch(88% 0.08 50)', opacity: 0.6, filter: 'blur(2px)',
        }} />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 5,
            background: COLORS.card, color: COLORS.accentInk,
            padding: '4px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600,
            border: `1px solid ${COLORS.divider}`,
          }}><Icon name="file-pdf" size={11} strokeWidth={2.5} /> PDF</div>
          <div style={{ fontSize: 15, color: COLORS.ink, fontWeight: 500, lineHeight: 1.35 }}>{t.uploadPdf}</div>

          <button onClick={onUpload} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: '100%',
            background: COLORS.card, border: `1.5px dashed oklch(78% 0.06 50)`,
            borderRadius: 14, padding: '20px 14px', cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: COLORS.accentSoft,
              color: COLORS.accentInk, display: 'grid', placeItems: 'center',
            }}><Icon name="upload" size={20} strokeWidth={2} /></div>
            <span style={{ fontSize: 13, color: COLORS.inkSoft, textAlign: 'center', textWrap: 'pretty' }}>
              {t.uploadDrag}
            </span>
            <span style={{ fontSize: 11, color: COLORS.inkMuted, fontFamily: 'IBM Plex Mono, monospace' }}>
              {t.pasteHint}
            </span>
          </button>
        </div>
      </div>

      {/* Queue banner — "N чеков ждут решения" */}
      {queue.length > 0 && (
        <button onClick={onQueue} style={{
          background: COLORS.card, border: `1px solid ${COLORS.divider}`, borderRadius: 16,
          padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', width: '100%',
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12, background: COLORS.pendingSoft,
            color: COLORS.pendingInk, display: 'grid', placeItems: 'center', flexShrink: 0,
            position: 'relative',
          }}>
            <Icon name="clock" size={20} strokeWidth={2} />
            <span style={{
              position: 'absolute', top: -4, right: -4, background: COLORS.accent, color: '#fff',
              fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 99, minWidth: 16, textAlign: 'center',
              border: '2px solid #fff',
            }}>{queue.length}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink }}>{t.queue}</div>
            <div style={{ fontSize: 12, color: COLORS.inkSoft }}>
              {queue.length} {t.checks} · {t.waiting}
            </div>
          </div>
          <Icon name="arrow-right" size={16} color={COLORS.inkMuted} />
        </button>
      )}

      {/* Today stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 10 }}>
        <StatCard label={t.todayChecks} value={todayCount} unit={t.checks}
          icon="shield-check" color={COLORS.successInk} bg={COLORS.successSoft} />
        <StatCard label={t.todaySum} value={todaySum.toLocaleString('ru-KZ')} unit="₸"
          icon="wallet" color={COLORS.accentInk} bg={COLORS.accentSoft} />
      </div>

      {/* Recent */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, padding: '0 2px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.ink }}>{t.recent}</div>
        </div>
        <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.divider}`, overflow: 'hidden' }}>
          {recent.map((r, i) => (
            <RecentRow key={i} r={r} t={t} divider={i < recent.length - 1} onClick={() => onResult(r)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, icon, color, bg }) {
  return (
    <div style={{ background: COLORS.card, borderRadius: 16, padding: 14, border: `1px solid ${COLORS.divider}` }}>
      <div style={{
        width: 28, height: 28, borderRadius: 10, background: bg,
        display: 'grid', placeItems: 'center', color, marginBottom: 10,
      }}><Icon name={icon} size={15} strokeWidth={2.2} /></div>
      <div style={{ fontSize: 11, color: COLORS.inkMuted, fontWeight: 500 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
        <span style={{
          fontSize: 20, fontWeight: 700, color: COLORS.ink, letterSpacing: '-0.02em',
          fontFamily: 'Manrope, sans-serif',
        }}>{value}</span>
        <span style={{ fontSize: 11, color: COLORS.inkSoft, fontWeight: 500 }}>{unit}</span>
      </div>
    </div>
  );
}

function RecentRow({ r, t, divider, onClick }) {
  const statusMap = {
    verified: { color: COLORS.successInk, bg: COLORS.successSoft, icon: 'check' },
    fraud:    { color: COLORS.alertInk,   bg: COLORS.alertSoft,   icon: 'x' },
    pending:  { color: COLORS.pendingInk, bg: COLORS.pendingSoft, icon: 'clock' },
  };
  const s = statusMap[r.status];
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
      borderBottom: divider ? `1px solid ${COLORS.divider}` : 'none',
      width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
      textAlign: 'left', fontFamily: 'inherit',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 11, background: s.bg, color: s.color,
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}><Icon name={s.icon} size={16} strokeWidth={2.5} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 600, color: COLORS.ink, lineHeight: '18px',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{r.sender}</div>
        <div style={{
          fontSize: 11.5, color: COLORS.inkMuted, lineHeight: '15px',
          fontFamily: 'IBM Plex Mono, monospace',
        }}>№ {r.opId} · {r.timeLabel}</div>
      </div>
      <div style={{
        fontSize: 14, fontWeight: 600, color: COLORS.ink, fontVariantNumeric: 'tabular-nums',
        fontFamily: 'Manrope, sans-serif',
      }}>{r.amount.toLocaleString('ru-KZ')} ₸</div>
    </button>
  );
}

// ─── UPLOAD ────────────────────────────────────────────
function UploadScreen({ t, onUploaded, lang }) {
  const [state, setState] = useState('idle'); // idle | uploading | done

  useEffect(() => {
    if (state === 'uploading') {
      const timer = setTimeout(() => setState('done'), 1400);
      return () => clearTimeout(timer);
    }
    if (state === 'done') {
      const timer = setTimeout(() => onUploaded(), 800);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      <div>
        <div style={{ fontSize: 19, fontWeight: 700, color: COLORS.ink, fontFamily: 'Manrope, sans-serif' }}>
          {t.uploadPdf}
        </div>
        <div style={{ fontSize: 12.5, color: COLORS.inkSoft, marginTop: 3 }}>{t.pasteHint}</div>
      </div>

      {state === 'idle' && (
        <button onClick={() => setState('uploading')} style={{
          background: COLORS.card, border: `2px dashed oklch(78% 0.06 50)`, borderRadius: 18,
          padding: '40px 20px', cursor: 'pointer', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 14, fontFamily: 'inherit',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, background: COLORS.accentSoft,
            color: COLORS.accentInk, display: 'grid', placeItems: 'center',
          }}><Icon name="upload" size={28} strokeWidth={2} /></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink, marginBottom: 4 }}>{t.uploadDrag}</div>
            <div style={{ fontSize: 12, color: COLORS.inkMuted, fontFamily: 'IBM Plex Mono, monospace' }}>
              PDF · max 10 MB
            </div>
          </div>
        </button>
      )}

      {state !== 'idle' && (
        <PdfCard t={t} state={state} />
      )}

      <div style={{
        background: COLORS.bgWarm, borderRadius: 14, padding: 14,
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 10, background: COLORS.accentSoft,
          color: COLORS.accentInk, display: 'grid', placeItems: 'center', flexShrink: 0,
        }}><Icon name="users" size={14} strokeWidth={2} /></div>
        <div style={{ fontSize: 12.5, color: COLORS.inkSoft, lineHeight: 1.5 }}>
          {lang === 'ru'
            ? 'После загрузки чек попадёт в очередь. Владелец или сотрудник с правами сможет его подтвердить или отклонить.'
            : 'Жүктелгеннен кейін чек кезекке тұрады. Иесі немесе құқығы бар қызметкер растай немесе қабылдамай алады.'}
        </div>
      </div>
    </div>
  );
}

function PdfCard({ t, state }) {
  return (
    <div style={{
      background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.divider}`,
      padding: 14, display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 48, height: 58, borderRadius: 8, background: COLORS.alertSoft, color: COLORS.alertInk,
        display: 'grid', placeItems: 'center', position: 'relative', flexShrink: 0,
        fontWeight: 800, fontSize: 11, letterSpacing: '0.05em',
      }}>
        PDF
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 14, height: 14,
          background: COLORS.bg, borderBottomLeftRadius: 6,
          boxShadow: `-1px 1px 0 ${COLORS.alertInk}20`,
        }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: COLORS.ink, overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>kaspi-receipt-4781-9923.pdf</div>
        <div style={{ fontSize: 11, color: COLORS.inkMuted, marginTop: 2 }}>
          312 KB · {state === 'done' ? '✓ ' + (t.submittedBy || 'uploaded') : (t === window.I18N.ru ? 'Загрузка…' : 'Жүктелуде…')}
        </div>
        <div style={{
          height: 3, background: COLORS.divider, borderRadius: 2, marginTop: 8, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: state === 'done' ? '100%' : '60%',
            background: state === 'done' ? COLORS.success : COLORS.accent,
            transition: 'width 0.4s ease', borderRadius: 2,
          }} />
        </div>
      </div>
    </div>
  );
}

// ─── API KEY modal — appears over moderation before final approval ───
function ApiKeyModal({ t, lang, result, onCancel, onConfirm }) {
  const [key, setKey] = useState('sk-live-' + Math.random().toString(36).slice(2, 10) + '-' + Math.random().toString(36).slice(2, 10));
  const [mode, setMode] = useState('generated'); // generated | custom | vault
  const [copied, setCopied] = useState(false);

  function copyKey() {
    try { navigator.clipboard.writeText(key); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }
  function regen() {
    setKey('sk-live-' + Math.random().toString(36).slice(2, 10) + '-' + Math.random().toString(36).slice(2, 10));
    setMode('generated');
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'oklch(22% 0.012 60 / 0.45)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease', zIndex: 20,
    }}>
      <div style={{
        background: COLORS.bg, borderTopLeftRadius: 22, borderTopRightRadius: 22,
        padding: '16px 16px 18px', display: 'flex', flexDirection: 'column', gap: 14,
        animation: 'slideUp 0.28s cubic-bezier(.2,.8,.2,1)',
      }}>
        {/* drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: COLORS.divider }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: COLORS.accentSoft,
            color: COLORS.accentInk, display: 'grid', placeItems: 'center', flexShrink: 0,
          }}><Icon name="key" size={20} strokeWidth={2} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, fontFamily: 'Manrope, sans-serif' }}>
              {t.enterApiKey}
            </div>
            <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 2, textWrap: 'pretty' }}>
              {t.apiKeyHint}
            </div>
          </div>
        </div>

        {/* Source toggle */}
        <div style={{
          display: 'flex', gap: 4, padding: 3, background: COLORS.bgWarm,
          borderRadius: 10, border: `1px solid ${COLORS.divider}`,
        }}>
          {[
            { id: 'generated', label: t.keyGenerated, icon: 'sparkle' },
            { id: 'custom',    label: lang === 'ru' ? 'Свой ключ' : 'Өз кілтім', icon: 'key' },
            { id: 'vault',     label: t.keyFromVault, icon: 'lock' },
          ].map(o => (
            <button key={o.id} onClick={() => { setMode(o.id); if (o.id === 'generated') regen(); if (o.id === 'custom') setKey(''); if (o.id === 'vault') setKey('sk-live-vault-prod-8472'); }} style={{
              flex: 1, padding: '7px 6px', fontSize: 11, fontWeight: 600,
              background: mode === o.id ? COLORS.card : 'transparent',
              color: mode === o.id ? COLORS.ink : COLORS.inkMuted,
              border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              boxShadow: mode === o.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}>
              <Icon name={o.icon} size={11} strokeWidth={2.2} />
              {o.label}
            </button>
          ))}
        </div>

        {/* Key input */}
        <div style={{
          background: COLORS.card, border: `1.5px solid ${mode === 'custom' ? COLORS.accent : COLORS.divider}`,
          borderRadius: 12, padding: '12px 12px', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Icon name="key" size={15} color={COLORS.inkMuted} />
          <input
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder={t.apiKeyPlaceholder}
            readOnly={mode !== 'custom'}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 13, color: COLORS.ink,
              fontFamily: 'IBM Plex Mono, monospace', fontWeight: 500,
              letterSpacing: '-0.01em', minWidth: 0,
            }}
          />
          <button onClick={copyKey} style={{
            background: copied ? COLORS.successSoft : COLORS.bgWarm,
            color: copied ? COLORS.successInk : COLORS.inkSoft,
            border: 'none', borderRadius: 8, padding: '5px 9px', fontSize: 11, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4,
            flexShrink: 0,
          }}>
            <Icon name={copied ? 'check' : 'copy'} size={12} strokeWidth={2.4} />
            {copied ? t.keyCopied : t.keyCopy}
          </button>
        </div>

        {/* Preview of the message client will receive */}
        <div style={{
          background: 'linear-gradient(180deg, oklch(97% 0.01 230) 0%, oklch(95% 0.02 230) 100%)',
          border: `1px solid oklch(88% 0.04 230)`, borderRadius: 14, padding: 12,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ color: '#3390ec' }}>
              <Icon name="send" size={12} strokeWidth={2.2} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#3390ec', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {lang === 'ru' ? 'Предпросмотр сообщения клиенту' : 'Клиентке жіберілетін хабарлама'}
            </span>
          </div>
          <div style={{
            background: '#fff', borderRadius: 10, padding: '10px 12px',
            fontSize: 12, color: COLORS.ink, lineHeight: 1.5,
            fontFamily: 'system-ui, sans-serif',
          }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              {lang === 'ru' ? '✅ Платёж подтверждён' : '✅ Төлем расталды'}
            </div>
            <div style={{ color: COLORS.inkSoft, marginBottom: 6 }}>
              {lang === 'ru'
                ? `Спасибо, ${result.sender}! Ваш ключ доступа:`
                : `Рақмет, ${result.sender}! Сіздің қол жеткізу кілтіңіз:`}
            </div>
            <div style={{
              background: COLORS.bgWarm, padding: '6px 8px', borderRadius: 6,
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 11.5, fontWeight: 600,
              color: COLORS.accentInk, wordBreak: 'break-all',
            }}>{key || '—'}</div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, background: COLORS.card, color: COLORS.ink,
            border: `1px solid ${COLORS.divider}`, borderRadius: 14, padding: '13px',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>{t.cancel}</button>
          <button onClick={() => key && onConfirm(key)}
            disabled={!key}
            style={{
              flex: 1.4, background: key ? COLORS.success : COLORS.divider,
              color: '#fff', border: 'none', borderRadius: 14, padding: '13px',
              fontSize: 14, fontWeight: 700, cursor: key ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: key ? `0 4px 12px oklch(60% 0.11 155 / 0.3)` : 'none',
            }}>
            <Icon name="send" size={15} strokeWidth={2.4} /> {t.confirmAndSend}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}

// ─── MODERATION (PDF detail) ──────────────────────────
function ModerationScreen({ t, lang, result, onApprove, onReject, onAskTeam }) {
  return (
    <div style={{ padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* PDF preview */}
      <div style={{
        background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.divider}`,
        padding: 14, display: 'flex', gap: 12, alignItems: 'center',
      }}>
        <div style={{
          width: 54, height: 66, borderRadius: 8, background: COLORS.alertSoft, color: COLORS.alertInk,
          display: 'grid', placeItems: 'center', flexShrink: 0,
          fontWeight: 800, fontSize: 11, letterSpacing: '0.05em',
        }}>PDF</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            kaspi-receipt-{result.opId}.pdf
          </div>
          <div style={{ fontSize: 11, color: COLORS.inkMuted, marginTop: 2 }}>
            312 KB · {result.uploadedBy}
          </div>
          <button style={{
            marginTop: 8, fontSize: 11.5, fontWeight: 600, color: COLORS.accentInk,
            background: COLORS.accentSoft, border: 'none', borderRadius: 8,
            padding: '5px 9px', cursor: 'pointer', fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}><Icon name="external" size={11} strokeWidth={2.4} /> {t.viewPdf}</button>
        </div>
      </div>

      {/* Pending banner */}
      <div style={{
        background: COLORS.pendingSoft, borderRadius: 12, padding: '10px 12px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Icon name="clock" size={14} color={COLORS.pendingInk} strokeWidth={2.4} />
        <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.pendingInk }}>
          {t.needsReview}
        </span>
      </div>

      {/* Extracted data */}
      <div style={{
        background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.divider}`,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 16px 10px', borderBottom: `1px dashed ${COLORS.divider}`,
        }}>
          <div style={{
            fontSize: 10.5, color: COLORS.inkMuted, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>{t.extracted}</div>
        </div>
        <div style={{ padding: '14px 16px 6px' }}>
          <div style={{
            fontSize: 11, color: COLORS.inkMuted, fontWeight: 500,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>{t.amount}</div>
          <div style={{
            fontSize: 30, fontWeight: 700, color: COLORS.ink, letterSpacing: '-0.025em',
            fontFamily: 'Manrope, sans-serif', marginTop: 2, fontVariantNumeric: 'tabular-nums',
          }}>
            {result.amount.toLocaleString('ru-KZ')} <span style={{ color: COLORS.inkSoft, fontWeight: 500 }}>₸</span>
          </div>
        </div>
        <div style={{ padding: '8px 16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ReceiptRow label={t.sender} value={result.sender} />
          <ReceiptRow label={t.recipient} value={result.recipient} />
          <ReceiptRow label={t.date} value={result.date} mono />
          <ReceiptRow label={t.operation} value={result.opId} mono />
        </div>
      </div>

      {/* Ask team button */}
      <button onClick={onAskTeam} style={{
        background: COLORS.bgWarm, border: `1px solid ${COLORS.divider}`, borderRadius: 12,
        padding: '11px 14px', cursor: 'pointer', fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Icon name="users" size={16} color={COLORS.inkSoft} />
        <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.ink, flex: 1, textAlign: 'left' }}>
          {t.askTeam}
        </span>
        <Icon name="arrow-right" size={14} color={COLORS.inkMuted} />
      </button>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
        <button onClick={onReject} style={{
          flex: 1, background: COLORS.card, color: COLORS.alertInk,
          border: `1.5px solid ${COLORS.alert}`, borderRadius: 14, padding: '13px',
          fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}><Icon name="x" size={16} strokeWidth={2.6} /> {t.reject}</button>
        <button onClick={onApprove} style={{
          flex: 1, background: COLORS.success, color: '#fff',
          border: 'none', borderRadius: 14, padding: '13px',
          fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          boxShadow: `0 4px 12px oklch(60% 0.11 155 / 0.3)`,
        }}><Icon name="check" size={16} strokeWidth={2.6} /> {t.approve}</button>
      </div>
    </div>
  );
}

// ─── CHECKING (upload → queue) ────────────────────────
function CheckingScreen({ t }) {
  return (
    <div style={{
      padding: '40px 24px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 24, height: '100%', justifyContent: 'center',
    }}>
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'conic-gradient(from 0deg, transparent, oklch(66% 0.14 40 / 0.4), transparent)',
          animation: 'spin 1.4s linear infinite',
        }} />
        <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', background: COLORS.bg, display: 'grid', placeItems: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: COLORS.accentSoft,
            display: 'grid', placeItems: 'center', color: COLORS.accent,
          }}><Icon name="upload" size={28} strokeWidth={2} /></div>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.ink, marginBottom: 6, fontFamily: 'Manrope, sans-serif' }}>
          {t.checking}
        </div>
        <div style={{ fontSize: 13, color: COLORS.inkSoft }}>{t.checkingSub}</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── RESULT (post-decision) ───────────────────────────
function ResultScreen({ t, result, onDone, onCheckAnother }) {
  const statusConfig = {
    verified: { title: t.verified, sub: t.verifiedSub, bgGradient: `linear-gradient(170deg, ${COLORS.successSoft} 0%, ${COLORS.bg} 70%)`, ringColor: COLORS.success, badgeBg: COLORS.success, icon: 'check' },
    fraud:    { title: t.fraud,    sub: t.fraudSub,    bgGradient: `linear-gradient(170deg, ${COLORS.alertSoft} 0%, ${COLORS.bg} 70%)`,   ringColor: COLORS.alert,   badgeBg: COLORS.alert,   icon: 'x' },
    pending:  { title: t.pending,  sub: t.pendingSub,  bgGradient: `linear-gradient(170deg, ${COLORS.pendingSoft} 0%, ${COLORS.bg} 70%)`, ringColor: COLORS.pending, badgeBg: COLORS.pending, icon: 'clock' },
  };
  const s = statusConfig[result.status];
  const decider = result.status === 'verified' ? t.approvedBy : result.status === 'fraud' ? t.rejectedBy : null;

  return (
    <div style={{ background: s.bgGradient, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '26px 20px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 84, height: 84, borderRadius: '50%',
          background: '#fff', boxShadow: `0 0 0 6px ${s.ringColor}20`,
          display: 'grid', placeItems: 'center', color: s.badgeBg,
        }}><Icon name={s.icon} size={40} strokeWidth={3} /></div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.ink, fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.01em' }}>
            {s.title}
          </div>
          <div style={{ fontSize: 13, color: COLORS.inkSoft, marginTop: 4, padding: '0 12px', textWrap: 'pretty' }}>
            {s.sub}
          </div>
        </div>
        {result.decidedBy && decider && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#fff', border: `1px solid ${COLORS.divider}`,
            borderRadius: 99, padding: '5px 5px 5px 10px', fontSize: 12, color: COLORS.inkSoft,
          }}>
            <span>{decider}:</span>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', background: result.decidedByAvatarBg || COLORS.accent,
              color: '#fff', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700,
            }}>{result.decidedByInitials}</div>
            <span style={{ fontWeight: 600, color: COLORS.ink, paddingRight: 6 }}>{result.decidedBy}</span>
          </div>
        )}
      </div>

      <div style={{ padding: '0 16px 14px' }}>
        <div style={{
          background: COLORS.card, borderRadius: 18, border: `1px solid ${COLORS.divider}`,
          overflow: 'hidden', boxShadow: '0 8px 24px oklch(22% 0.012 60 / 0.06)',
        }}>
          <div style={{ padding: '18px 18px 14px', borderBottom: `1px dashed ${COLORS.divider}`, position: 'relative' }}>
            <div style={{ fontSize: 11, color: COLORS.inkMuted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {t.amount}
            </div>
            <div style={{
              fontSize: 28, fontWeight: 700, color: COLORS.ink, letterSpacing: '-0.025em',
              fontFamily: 'Manrope, sans-serif', marginTop: 2, fontVariantNumeric: 'tabular-nums',
            }}>
              {result.amount.toLocaleString('ru-KZ')} <span style={{ color: COLORS.inkSoft, fontWeight: 500 }}>₸</span>
            </div>
            <div style={{ position: 'absolute', left: -7, bottom: -7, width: 14, height: 14, borderRadius: '50%', background: COLORS.bg }} />
            <div style={{ position: 'absolute', right: -7, bottom: -7, width: 14, height: 14, borderRadius: '50%', background: COLORS.bg }} />
          </div>
          <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <ReceiptRow label={t.sender} value={result.sender} />
            <ReceiptRow label={t.operation} value={result.opId} mono />
            <ReceiptRow label={t.date} value={result.date} mono />
          </div>
        </div>
      </div>

      {/* Audit trail */}
      {result.audit && result.audit.length > 0 && (
        <div style={{ padding: '0 16px 14px' }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: COLORS.inkMuted,
            textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 4px 8px',
          }}>{t.auditTrail}</div>
          <div style={{
            background: COLORS.card, borderRadius: 14, border: `1px solid ${COLORS.divider}`,
            padding: 14, display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            {result.audit.map((a, i) => <AuditItem key={i} a={a} t={t} last={i === result.audit.length - 1} />)}
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />

      <div style={{
        padding: '12px 16px 18px', display: 'flex', gap: 10,
        background: '#fff', borderTop: `1px solid ${COLORS.divider}`,
      }}>
        <button onClick={onCheckAnother} style={{
          flex: 1, background: COLORS.bgWarm, color: COLORS.ink,
          border: `1px solid ${COLORS.divider}`, borderRadius: 14, padding: '13px',
          fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }}>{t.checkAnother}</button>
        <button onClick={onDone} style={{
          flex: 1, background: COLORS.accent, color: '#fff', border: 'none',
          borderRadius: 14, padding: '13px', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
          boxShadow: '0 4px 12px oklch(66% 0.14 40 / 0.25)',
        }}>{t.done}</button>
      </div>
    </div>
  );
}

function ReceiptRow({ label, value, mono }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
      <span style={{ fontSize: 12.5, color: COLORS.inkMuted, fontWeight: 500 }}>{label}</span>
      <span style={{
        fontSize: 13, color: COLORS.ink, fontWeight: 600, textAlign: 'right',
        fontFamily: mono ? 'IBM Plex Mono, monospace' : 'inherit',
      }}>{value}</span>
    </div>
  );
}

function AuditItem({ a, t, last }) {
  const map = {
    upload:   { color: COLORS.accentInk,  bg: COLORS.accentSoft,  icon: 'upload' },
    approve:  { color: COLORS.successInk, bg: COLORS.successSoft, icon: 'check' },
    reject:   { color: COLORS.alertInk,   bg: COLORS.alertSoft,   icon: 'x' },
    view:     { color: COLORS.inkSoft,    bg: COLORS.bgWarm,      icon: 'eye' },
    key:      { color: COLORS.accentInk,  bg: COLORS.accentSoft,  icon: 'key' },
    sent:     { color: '#3390ec',         bg: 'oklch(95% 0.03 230)', icon: 'send' },
  };
  const s = map[a.kind];
  return (
    <div style={{ display: 'flex', gap: 10, position: 'relative' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 8, background: s.bg, color: s.color,
          display: 'grid', placeItems: 'center',
        }}><Icon name={s.icon} size={12} strokeWidth={2.4} /></div>
        {!last && (
          <div style={{ position: 'absolute', left: 13, top: 28, bottom: -10, width: 1, background: COLORS.divider }} />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12.5, color: COLORS.ink, lineHeight: 1.4 }}>
          <strong style={{ fontWeight: 600 }}>{a.who}</strong> {a.text}
        </div>
        <div style={{ fontSize: 10.5, color: COLORS.inkMuted, marginTop: 2 }}>{a.time}</div>
      </div>
    </div>
  );
}

// ─── QUEUE screen ─────────────────────────────────────
function QueueScreen({ t, lang, queue, onOpen }) {
  return (
    <div style={{ padding: '14px 16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{
        background: COLORS.pendingSoft, borderRadius: 12, padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Icon name="clock" size={15} color={COLORS.pendingInk} strokeWidth={2.4} />
        <span style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.pendingInk }}>
          {queue.length} {t.checks} · {t.waiting}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {queue.map((q, i) => <QueueCard key={i} q={q} t={t} onClick={() => onOpen(q)} />)}
      </div>
    </div>
  );
}

function QueueCard({ q, t, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: COLORS.card, border: `1px solid ${COLORS.divider}`, borderRadius: 16,
      padding: 14, textAlign: 'left', fontFamily: 'inherit', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 44, borderRadius: 6, background: COLORS.alertSoft, color: COLORS.alertInk,
          display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 9, letterSpacing: '0.05em',
          flexShrink: 0,
        }}>PDF</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: COLORS.ink,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>kaspi-receipt-{q.opId}.pdf</div>
          <div style={{ fontSize: 11, color: COLORS.inkMuted, marginTop: 1 }}>
            {t.submittedBy}: {q.uploadedBy} · {q.timeLabel}
          </div>
        </div>
        <div style={{
          fontSize: 14, fontWeight: 700, color: COLORS.ink,
          fontFamily: 'Manrope, sans-serif', fontVariantNumeric: 'tabular-nums',
        }}>{q.amount.toLocaleString('ru-KZ')} ₸</div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 10, borderTop: `1px dashed ${COLORS.divider}`,
      }}>
        <div style={{ fontSize: 11.5, color: COLORS.inkSoft }}>
          {q.sender}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* viewed-by avatars */}
          <div style={{ display: 'flex' }}>
            {q.viewedBy.slice(0, 3).map((v, i) => (
              <div key={i} style={{
                width: 20, height: 20, borderRadius: '50%', background: v.bg,
                color: '#fff', display: 'grid', placeItems: 'center',
                fontSize: 9, fontWeight: 700, border: '2px solid #fff',
                marginLeft: i > 0 ? -6 : 0,
              }}>{v.initials}</div>
            ))}
          </div>
          <span style={{ fontSize: 11, color: COLORS.inkMuted }}>
            {q.viewedBy.length} {t.reviewedBy.toLowerCase()}
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── HISTORY ──────────────────────────────────────────
function HistoryScreen({ t, lang, recent, onResult }) {
  const groups = [
    { label: t.today, items: recent.slice(0, 2) },
    { label: t.yesterday, items: recent.slice(2, 4) },
    { label: t.earlier, items: recent.slice(4) },
  ].filter(g => g.items.length > 0);

  return (
    <div style={{ padding: '14px 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8, padding: 4, background: COLORS.bgWarm, borderRadius: 12, border: `1px solid ${COLORS.divider}` }}>
        <div style={{ flex: 1, padding: '8px 12px', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="search" size={14} color={COLORS.inkMuted} />
          <span style={{ fontSize: 13, color: COLORS.inkMuted }}>
            {lang === 'ru' ? 'Поиск по чекам' : 'Чектерден іздеу'}
          </span>
        </div>
        <button style={{
          background: COLORS.card, border: `1px solid ${COLORS.divider}`, borderRadius: 9,
          padding: '6px 10px', cursor: 'pointer', color: COLORS.inkSoft,
          display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
        }}><Icon name="filter" size={13} /></button>
      </div>

      {groups.map((g, gi) => (
        <div key={gi}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: COLORS.inkMuted,
            textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 4px 8px',
          }}>{g.label}</div>
          <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.divider}`, overflow: 'hidden' }}>
            {g.items.map((r, i) => (
              <RecentRow key={i} r={r} t={t} divider={i < g.items.length - 1} onClick={() => onResult(r)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

window.MiniApp = {
  TgMiniHeader, HomeScreen, UploadScreen, ModerationScreen, ApiKeyModal,
  CheckingScreen, ResultScreen, QueueScreen, HistoryScreen, COLORS,
};
