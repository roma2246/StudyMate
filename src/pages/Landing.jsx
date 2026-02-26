// src/pages/Landing.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NeuroNoise } from '@paper-design/shaders-react';

const Landing = () => {
    const navigate = useNavigate();
    const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });

    useEffect(() => {
        const onResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <div style={s.page}>
            {/* NeuroNoise background */}
            <div style={s.shaderWrap}>
                <NeuroNoise
                    colorBack="#040d1a"
                    colorFront="#1a3b6b"
                    colorAccent="#3b82f6"
                    speed={0.4}
                    width={dims.w}
                    height={dims.h}
                    style={{ width: '100%', height: '100%', display: 'block' }}
                />
                <div style={s.shaderOverlay} />
            </div>

            {/* NAV */}
            <nav style={s.nav}>
                <div style={s.navInner}>
                    <div style={s.logo}>
                        <div style={s.logoIcon}>📚</div>
                        <span style={s.logoText}>StudyMate</span>
                    </div>
                    <div style={s.navLinks}>
                        <a href="#features" style={s.navLink}>Возможности</a>
                        <a href="#about" style={s.navLink}>О платформе</a>
                        <a href="#contacts" style={s.navLink}>Контакты</a>
                    </div>
                    <div style={s.navActions}>
                        <button style={s.navBtnOutline} onClick={() => navigate('/student/login')}>
                            Войти
                        </button>
                        <button style={s.navBtnPrimary} onClick={() => navigate('/student/register')}>
                            Регистрация
                        </button>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section style={s.hero}>
                <div style={s.heroLeft}>
                    <div style={s.heroBadge}>🎓 Образовательная платформа</div>
                    <h1 style={s.heroTitle}>
                        <span style={s.heroTitleWhite}>НАДЁЖНАЯ СИСТЕМА</span>{' '}
                        <span style={s.heroTitleAccent}>МОНИТОРИНГА</span>{' '}
                        <span style={s.heroTitleWhite}>УСПЕВАЕМОСТИ</span>
                    </h1>
                    <p style={s.heroSub}>
                        Автоматизированный учёт оценок, заданий и расписания для студентов и преподавателей.
                        Всё в одном месте — прозрачно и удобно.
                    </p>
                    <div style={s.heroCtas}>
                        <button style={s.ctaPrimary} onClick={() => navigate('/student/login')}>
                            Войти как студент
                        </button>
                        <button style={s.ctaSecondary} onClick={() => navigate('/teacher/login')}>
                            Войти как преподаватель
                        </button>
                    </div>
                    <div style={s.heroStats}>
                        <div style={s.heroStat}>
                            <span style={s.heroStatNum}>500+</span>
                            <span style={s.heroStatLabel}>Студентов</span>
                        </div>
                        <div style={s.heroStatDivider} />
                        <div style={s.heroStat}>
                            <span style={s.heroStatNum}>50+</span>
                            <span style={s.heroStatLabel}>Преподавателей</span>
                        </div>
                        <div style={s.heroStatDivider} />
                        <div style={s.heroStat}>
                            <span style={s.heroStatNum}>30+</span>
                            <span style={s.heroStatLabel}>Предметов</span>
                        </div>
                    </div>
                </div>

                <div style={s.heroRight}>
                    <div style={s.heroCard}>
                        <div style={s.heroCardHeader}>
                            <div style={s.heroCardDot} />
                            <div style={{ ...s.heroCardDot, background: '#fbbf24' }} />
                            <div style={{ ...s.heroCardDot, background: '#34d399' }} />
                        </div>
                        <div style={s.heroCardTitle}>📊 Успеваемость студента</div>
                        <div style={s.heroCardStats}>
                            {[
                                { label: 'Математика', val: 92, color: '#3b82f6' },
                                { label: 'Физика', val: 78, color: '#8b5cf6' },
                                { label: 'Информатика', val: 95, color: '#10b981' },
                                { label: 'История', val: 84, color: '#f59e0b' },
                            ].map(item => (
                                <div key={item.label} style={s.barRow}>
                                    <span style={s.barLabel}>{item.label}</span>
                                    <div style={s.barTrack}>
                                        <div style={{ ...s.barFill, width: `${item.val}%`, background: item.color }} />
                                    </div>
                                    <span style={{ ...s.barNum, color: item.color }}>{item.val}</span>
                                </div>
                            ))}
                        </div>
                        <div style={s.heroCardGpa}>
                            <span style={s.heroCardGpaLabel}>Средний балл</span>
                            <span style={s.heroCardGpaVal}>4.7</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" style={s.features}>
                <div style={s.sectionInner}>
                    <div style={s.sectionBadge}>Возможности</div>
                    <h2 style={s.sectionTitle}>Всё что нужно в одной платформе</h2>
                    <div style={s.featGrid}>
                        {[
                            { icon: '📈', title: 'Мониторинг оценок', desc: 'Просматривайте все оценки в реальном времени, отслеживайте динамику успеваемости по каждому предмету.' },
                            { icon: '📋', title: 'Управление заданиями', desc: 'Создавайте задания, устанавливайте дедлайны, получайте уведомления о предстоящих сдачах.' },
                            { icon: '📅', title: 'Расписание', desc: 'Удобный просмотр расписания занятий, экзаменов и событий на неделю вперёд.' },
                            { icon: '📊', title: 'Статистика и отчёты', desc: 'Детальная аналитика: рейтинги студентов, распределение оценок, GPA по предметам.' },
                            { icon: '👥', title: 'Роли и доступ', desc: 'Разграниченный доступ для студентов и преподавателей — каждый видит нужную информацию.' },
                            { icon: '🔒', title: 'Безопасность', desc: 'JWT аутентификация, защищённые маршруты, надёжное хранение данных на Java Spring Boot.' },
                        ].map(f => (
                            <div key={f.title} style={s.featCard}>
                                <div style={s.featIcon}>{f.icon}</div>
                                <h3 style={s.featTitle}>{f.title}</h3>
                                <p style={s.featDesc}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ROLES */}
            <section id="about" style={s.roles}>
                <div style={s.sectionInner}>
                    <div style={s.sectionBadge}>Роли</div>
                    <h2 style={s.sectionTitle}>Для кого эта платформа</h2>
                    <div style={s.rolesGrid}>
                        {/* Student */}
                        <div style={s.roleCard}>
                            <div style={{ ...s.roleIconWrap, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
                                <span style={s.roleIcon}>🎓</span>
                            </div>
                            <h3 style={s.roleTitle}>Студент</h3>
                            <p style={s.roleDesc}>Отслеживай свою успеваемость, просматривай задания и расписание в одном месте.</p>
                            <ul style={s.roleFeats}>
                                {['Просмотр всех оценок', 'Предстоящие задания', 'GPA и статистика', 'Личный профиль'].map(f => (
                                    <li key={f} style={s.roleFeat}>
                                        <span style={{ ...s.roleFeatDot, background: '#3b82f6' }}>✓</span> {f}
                                    </li>
                                ))}
                            </ul>
                            <button style={{ ...s.roleBtn, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
                                onClick={() => navigate('/student/register')}>
                                Зарегистрироваться как студент
                            </button>
                        </div>

                        {/* Teacher */}
                        <div style={s.roleCard}>
                            <div style={{ ...s.roleIconWrap, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
                                <span style={s.roleIcon}>👨‍🏫</span>
                            </div>
                            <h3 style={s.roleTitle}>Преподаватель</h3>
                            <p style={s.roleDesc}>Управляй студентами, выставляй оценки, создавай задания и отслеживай прогресс группы.</p>
                            <ul style={s.roleFeats}>
                                {['Управление группами', 'Выставление оценок', 'Создание заданий', 'Рейтинг студентов'].map(f => (
                                    <li key={f} style={s.roleFeat}>
                                        <span style={{ ...s.roleFeatDot, background: '#8b5cf6' }}>✓</span> {f}
                                    </li>
                                ))}
                            </ul>
                            <button style={{ ...s.roleBtn, background: 'linear-gradient(135deg, #8b5cf6, #5b21b6)' }}
                                onClick={() => navigate('/teacher/register')}>
                                Зарегистрироваться как преподаватель
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer id="contacts" style={s.footer}>
                <div style={s.footerInner}>
                    <div style={s.footerLogo}>
                        <div style={s.logoIcon}>📚</div>
                        <span style={s.logoText}>StudyMate</span>
                    </div>
                    <p style={s.footerDesc}>
                        Платформа для мониторинга учебного прогресса. Разработано с ❤️ для эффективного образования.
                    </p>
                    <div style={s.footerLinks}>
                        <button style={s.footerLink} onClick={() => navigate('/student/login')}>Войти как студент</button>
                        <span style={s.footerSep}>·</span>
                        <button style={s.footerLink} onClick={() => navigate('/teacher/login')}>Войти как преподаватель</button>
                    </div>
                    <p style={s.footerCopy}>© 2026 StudyMate. Все права защищены.</p>
                </div>
            </footer>
        </div>
    );
};

const s = {
    page: {
        minHeight: '100vh',
        background: '#040d1a',
        fontFamily: "'Inter', -apple-system, sans-serif",
        overflowX: 'hidden',
        color: '#fff',
    },
    shaderWrap: {
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
    },
    shaderOverlay: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(4,13,26,0.55) 0%, rgba(4,13,26,0.75) 60%, rgba(4,13,26,0.95) 100%)',
    },

    // NAV
    nav: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(4,13,26,0.7)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
    },
    navInner: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
    },
    logo: { display: 'flex', alignItems: 'center', gap: '0.625rem' },
    logoIcon: {
        width: '36px',
        height: '36px',
        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
    },
    logoText: { fontSize: '1.25rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' },
    navLinks: { display: 'flex', gap: '2rem' },
    navLink: {
        color: 'rgba(255,255,255,0.6)',
        textDecoration: 'none',
        fontSize: '0.9375rem',
        fontWeight: '500',
        transition: 'color 0.2s',
        cursor: 'pointer',
    },
    navActions: { display: 'flex', gap: '0.75rem' },
    navBtnOutline: {
        padding: '0.5rem 1rem',
        background: 'rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.8)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '8px',
        fontSize: '0.875rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
    navBtnPrimary: {
        padding: '0.5rem 1rem',
        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.875rem',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
    },

    // HERO
    hero: {
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '4rem',
        paddingTop: '68px',
    },
    heroLeft: { flex: '1', minWidth: 0 },
    heroBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'rgba(59,130,246,0.15)',
        border: '1px solid rgba(59,130,246,0.3)',
        color: '#93c5fd',
        padding: '0.375rem 1rem',
        borderRadius: '100px',
        fontSize: '0.8125rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
    },
    heroTitle: {
        fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
        fontWeight: '900',
        lineHeight: 1.1,
        letterSpacing: '-0.03em',
        margin: '0 0 1.5rem 0',
    },
    heroTitleWhite: { color: '#fff' },
    heroTitleAccent: {
        background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    heroSub: {
        fontSize: '1.125rem',
        color: 'rgba(255,255,255,0.55)',
        lineHeight: 1.6,
        marginBottom: '2.5rem',
        maxWidth: '520px',
    },
    heroCtas: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' },
    ctaPrimary: {
        padding: '0.875rem 2rem',
        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(59,130,246,0.4)',
        transition: 'all 0.2s ease',
    },
    ctaSecondary: {
        padding: '0.875rem 2rem',
        background: 'rgba(255,255,255,0.07)',
        color: 'rgba(255,255,255,0.85)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    heroStats: { display: 'flex', alignItems: 'center', gap: '2rem' },
    heroStat: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
    heroStatNum: { fontSize: '2rem', fontWeight: '800', color: '#60a5fa' },
    heroStatLabel: { fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', fontWeight: '500' },
    heroStatDivider: { width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' },

    // Hero card
    heroRight: { flex: '0 0 380px' },
    heroCard: {
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
    },
    heroCardHeader: { display: 'flex', gap: '6px', marginBottom: '1.25rem' },
    heroCardDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' },
    heroCardTitle: { fontSize: '0.9375rem', fontWeight: '700', color: 'rgba(255,255,255,0.9)', marginBottom: '1.25rem' },
    heroCardStats: { display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.25rem' },
    barRow: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    barLabel: { fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', width: '100px', flexShrink: 0, fontWeight: '500' },
    barTrack: {
        flex: 1,
        height: '6px',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '100px',
        overflow: 'hidden',
    },
    barFill: { height: '100%', borderRadius: '100px', transition: 'width 1s ease' },
    barNum: { fontSize: '0.8125rem', fontWeight: '700', width: '28px', textAlign: 'right', flexShrink: 0 },
    heroCardGpa: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.875rem 1rem',
        background: 'rgba(59,130,246,0.12)',
        borderRadius: '12px',
        border: '1px solid rgba(59,130,246,0.2)',
    },
    heroCardGpaLabel: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
    heroCardGpaVal: { fontSize: '1.5rem', fontWeight: '800', color: '#60a5fa' },

    // FEATURES
    features: {
        position: 'relative',
        zIndex: 1,
        padding: '6rem 0',
        background: 'rgba(4,13,26,0.6)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
    },
    sectionInner: { maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' },
    sectionBadge: {
        display: 'inline-block',
        background: 'rgba(59,130,246,0.15)',
        border: '1px solid rgba(59,130,246,0.3)',
        color: '#93c5fd',
        padding: '0.375rem 1rem',
        borderRadius: '100px',
        fontSize: '0.8125rem',
        fontWeight: '600',
        marginBottom: '1rem',
    },
    sectionTitle: {
        fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
        fontWeight: '800',
        color: '#fff',
        letterSpacing: '-0.02em',
        marginBottom: '3rem',
    },
    featGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem',
    },
    featCard: {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '1.75rem',
        transition: 'all 0.2s ease',
    },
    featIcon: { fontSize: '2rem', marginBottom: '1rem' },
    featTitle: { fontSize: '1.125rem', fontWeight: '700', color: '#fff', marginBottom: '0.625rem' },
    featDesc: { fontSize: '0.9375rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 },

    // ROLES
    roles: {
        position: 'relative',
        zIndex: 1,
        padding: '6rem 0',
        borderTop: '1px solid rgba(255,255,255,0.05)',
    },
    rolesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.75rem',
    },
    roleCard: {
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '2.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
    },
    roleIconWrap: {
        width: '60px',
        height: '60px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    roleIcon: { fontSize: '1.75rem' },
    roleTitle: { fontSize: '1.5rem', fontWeight: '800', color: '#fff', margin: 0 },
    roleDesc: { fontSize: '0.9375rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 },
    roleFeats: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' },
    roleFeat: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
        fontSize: '0.9375rem',
        color: 'rgba(255,255,255,0.75)',
        fontWeight: '500',
    },
    roleFeatDot: {
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        color: '#fff',
        flexShrink: 0,
        fontWeight: '700',
    },
    roleBtn: {
        padding: '0.875rem 1.5rem',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontSize: '0.9375rem',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: 'auto',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    },

    // FOOTER
    footer: {
        position: 'relative',
        zIndex: 1,
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '3rem 0',
        background: 'rgba(4,13,26,0.8)',
    },
    footerInner: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        textAlign: 'center',
    },
    footerLogo: { display: 'flex', alignItems: 'center', gap: '0.625rem' },
    footerDesc: { color: 'rgba(255,255,255,0.4)', fontSize: '0.9375rem', maxWidth: '480px', lineHeight: 1.6 },
    footerLinks: { display: 'flex', alignItems: 'center', gap: '1rem' },
    footerLink: {
        background: 'none',
        border: 'none',
        color: '#60a5fa',
        fontSize: '0.9375rem',
        fontWeight: '600',
        cursor: 'pointer',
        padding: 0,
    },
    footerSep: { color: 'rgba(255,255,255,0.2)' },
    footerCopy: { color: 'rgba(255,255,255,0.25)', fontSize: '0.8125rem' },
};

export default Landing;
