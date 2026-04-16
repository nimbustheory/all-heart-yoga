import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import {
  Home, Calendar, TrendingUp, Users, CreditCard, CalendarDays,
  Menu, X, Bell, Settings, Shield, ChevronRight, ChevronDown, Clock,
  PartyPopper, ArrowUpRight, ArrowDownRight, Award, DollarSign, LayoutDashboard,
  UserCheck, Megaphone, LogOut, Plus, Edit3, Send, Check, Search,
  CircleCheck, UserPlus, Heart, Flame, Star, Sun, Moon, Wind, Sparkles,
  Mountain, Leaf, Music, Gift, Share2, MapPin, Trash2
} from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// ===================================================================
//  STUDIO CONFIG
// ===================================================================
const SC = {
  name: "ALL HEART",
  subtitle: "YOGA",
  tagline: "Yoga for your body, mind, heart.",
  logoMark: "A",
  description: "A friendly, women-owned boutique studio in NW Portland. Intimate classes, heartfelt community, and a space of belonging for all students.",
  heroLine1: "ALL",
  heroLine2: "HEART",
  address: { street: "1901 NW 26th Ave", city: "Portland", state: "OR", zip: "97210" },
  phone: "(503) 208-2468",
  email: "hello@allheartyogastudio.com",
  neighborhood: "NW Portland",
  website: "https://allheartyogastudio.com",
  social: { instagram: "@allheartyogastudio" },
  theme: {
    accent:     { h: 348, s: 45, l: 58 },
    accentAlt:  { h: 155, s: 25, l: 45 },
    warning:    { h: 18,  s: 55, l: 50 },
    primary:    { h: 340, s: 12, l: 12 },
    surface:    { h: 340, s: 15, l: 97 },
    surfaceDim: { h: 335, s: 10, l: 93 },
  },
  features: { workshops: true, retreats: false, soundBaths: true, teacherTrainings: false, practiceTracking: true, communityFeed: true, guestPasses: true, milestones: true },
  classCapacity: 18,
  specialtyCapacity: 14,
};

// ===================================================================
//  STUDIO IMAGES (Squarespace CDN)
// ===================================================================
const IMG = {
  home: "https://images.squarespace-cdn.com/content/v1/6282a31f7f8f976eb9a981cc/1730313644103-46QE7KLF67XKX33ARWN3/group+down+dog.jpg?format=1000w",
  classes: "https://images.squarespace-cdn.com/content/v1/6282a31f7f8f976eb9a981cc/1715960519750-QXVOKN3BHQNW8AKQYTAK/detail+group+H+9+web.jpg?format=1000w",
  schedule: "https://images.squarespace-cdn.com/content/v1/6282a31f7f8f976eb9a981cc/1730312018566-U995S1024C5RP897I0H7/group+pose+9100.jpg.png?format=1000w",
  practice: "https://images.squarespace-cdn.com/content/v1/6282a31f7f8f976eb9a981cc/1714423612070-HB3HM58H4FS4BZFXZ8IN/AHY+meditation+hands+crop+4-5.jpg?format=1000w",
  community: "https://images.squarespace-cdn.com/content/v1/6282a31f7f8f976eb9a981cc/1730311955022-0RCNLFI4VQ080SZMRS9R/community+nora+and+amber.png?format=1000w",
  teachers: "https://images.squarespace-cdn.com/content/v1/6282a31f7f8f976eb9a981cc/1720803688242-F02VOL07A83KAXMM6DY1/group%2BV%2B14.jpg?format=1000w",
  events: "https://images.squarespace-cdn.com/content/v1/6282a31f7f8f976eb9a981cc/1714423665018-14ITCOUT6QNRV95FPQTU/IMG_0650.jpg?format=1000w",
  membership: "https://images.squarespace-cdn.com/content/v1/6282a31f7f8f976eb9a981cc/1715963842577-E4TP6XKFDMM2OYMYP3A0/group+closing+H+88+web.jpg?format=1000w",
};

// ===================================================================
//  THEME
// ===================================================================
const hsl = (c, a) => a !== undefined ? `hsla(${c.h},${c.s}%,${c.l}%,${a})` : `hsl(${c.h},${c.s}%,${c.l}%)`;
const hslS = (c, ls) => `hsl(${c.h},${c.s}%,${Math.max(0, Math.min(100, c.l + ls))}%)`;
const T = {
  accent: hsl(SC.theme.accent), accentDark: hslS(SC.theme.accent, -14), accentLight: hslS(SC.theme.accent, 28),
  accentGhost: hsl(SC.theme.accent, 0.08), accentBorder: hsl(SC.theme.accent, 0.2),
  success: hsl(SC.theme.accentAlt), successGhost: hsl(SC.theme.accentAlt, 0.08), successBorder: hsl(SC.theme.accentAlt, 0.18),
  warning: hsl(SC.theme.warning), warningGhost: hsl(SC.theme.warning, 0.08), warningBorder: hsl(SC.theme.warning, 0.2),
  bg: hsl(SC.theme.primary), bgCard: hsl(SC.theme.surface), bgDim: hsl(SC.theme.surfaceDim),
  text: "#2a1f22", textMuted: "#7a6870", textFaint: "#a8949a", border: "#e2d8dc", borderLight: "#ede6e8",
};
const DF = "'Crimson Pro', serif";

// ===================================================================
//  DATE HELPERS
// ===================================================================
const today = new Date().toISOString().split("T")[0];
const offD = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split("T")[0]; };
const fmtDS = (s) => new Date(s + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const fmtDL = (s) => new Date(s + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
const fmtT = (t) => { const [h, m] = t.split(":"); const hr = +h; return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; };

// ===================================================================
//  MOCK DATA
// ===================================================================
const TEACHERS = [
  { id: "t1", firstName: "Laela", lastName: "Wilding", role: "Owner & Teacher", certs: ["E-RYT-200", "YACEP", "Reiki", "i-Rest L2"], specialties: ["Yin", "Yoga Nidra", "Accessible Yoga", "Reiki"], yearsTeaching: 8, bio: "Laela founded All Heart Yoga with a vision to create a space of belonging. A graphic designer and HIV advocate who grew up in Portland, she brings warmth, presence, and deep commitment to accessibility in every class. She also offers private yoga, guided meditation, Yoga Nidra, and Reiki energy healing." },
  { id: "t2", firstName: "Emily", lastName: "Wright", role: "Teacher", certs: ["RYT-200", "Restorative Certified"], specialties: ["Flow + Restore", "Sweet and Deep", "Hatha Flow"], yearsTeaching: 6, bio: "Emily's greatest guides are creativity, honesty, and heart. Her classes have a soothing tone that inspires softness and self-compassion, balanced with activation of the physical and energetic bodies to empower a connection to wholeness." },
  { id: "t3", firstName: "Eugene", lastName: "Lewins", role: "Teacher", certs: ["E-RYT-200", "CMT", "Iyengar Tradition"], specialties: ["Hatha Flow", "Yoga Flow", "Deep Stretch"], yearsTeaching: 20, bio: "Eugene integrates traditional yoga with Iyengar master teachers alongside his training as a certified massage therapist. A tango dancer and rock climber, his journey of full healing from a spinal accident informs his compassion for students facing their own challenges. He loves weaving poetry into his classes." },
  { id: "t4", firstName: "Nikki", lastName: "Caballero", role: "Sound Healing Guide", certs: ["Sound Healing Practitioner", "Certified Hypnotist", "Energy Worker"], specialties: ["Sound Bath", "The Wind Down", "Energy Healing"], yearsTeaching: 5, bio: "Nikki guides individuals on their path to self-healing through sound and hypnosis. Her sound baths are immersive journeys using crystal bowls, chimes, and tuning forks to access different levels of consciousness and address mind, body, and emotional well-being." },
  { id: "t5", firstName: "Filipa", lastName: "Marques Costa", role: "Teacher", certs: ["RYT-200", "Trauma-Informed"], specialties: ["Energizing Flow", "Vinyasa", "Reiki"], yearsTeaching: 4, bio: "Filipa's Energizing Flow classes are heat-building, blissful sequences that foster mind-body connection. She also offers private Reiki healing sessions at the studio. If you're looking to reset and feel re-energized, Filipa's classes are the ones." },
  { id: "t6", firstName: "Eleanor", lastName: "Stray", role: "Teacher", certs: ["Insight Yoga", "Mindfulness-Meditation Teacher"], specialties: ["Yin", "Meditation", "Move + Meditate"], yearsTeaching: 3, bio: "Eleanor studied under Sarah Powers and is currently training with Jack Kornfield and Tara Brach. A lifelong spiritual seeker and poet, her guidance often includes readings from the Zen tradition. You can find her wandering in Forest Park most days." },
  { id: "t7", firstName: "Amy", lastName: "Asch", role: "Teacher", certs: ["RYT-200", "Accessible Yoga"], specialties: ["Sweet and Deep", "Senior Yoga", "Gentle Flow"], yearsTeaching: 7, bio: "Amy found yoga's transformative power during a deeply difficult time. Her teaching connects students to their inner knowing -- helping them get comfortable with the uncomfortable and respond to life with deeper grace, clarity, and love." },
];

const TODAYS_FOCUS = {
  id: "focus-today", date: today, name: "Hatha Flow", type: "HATHA",
  style: "Studio", temp: "Room Temp", duration: 60,
  description: "Movements synchronized with breath at a slower pace than Vinyasa Flow. Standing and floor poses with focus on alignment, strength, and embodied movement. Pranayama, mudras, and philosophical concepts woven in, with guided meditation to close.",
  intention: "Every body tells a story. Let yours speak today.",
  teacherTip: "Adaptations and variations always offered. This is your practice -- take what serves you, leave what doesn't.",
  playlist: "Morning Light -- Eugene's Selection",
};

const PAST_PRACTICES = [
  { id: "p1", date: offD(-1), name: "Energizing Flow", type: "VINYASA", style: "Studio", temp: "Room Temp", duration: 60, description: "Breath and movement united. Sun salutations and flowing sequences with emphasis on mindfulness. One of our more physically challenging classes -- but you'll be well supported.", intention: "Prepare to energize, move, and have fun.", teacherTip: "Listen to your body. Rest in child's pose whenever you need." },
  { id: "p2", date: offD(-2), name: "Yin Yoga", type: "YIN", style: "Studio", temp: "Room Temp", duration: 75, description: "A passive practice with longer-held poses focusing on the lower body. Yin improves energy flow through meridian lines. A calm, grounding class with space for poetry, readings, and guided meditation.", intention: "Opposed to striving, this practice is one of allowing.", teacherTip: "Find your edge, then soften. The pose does the work -- you simply receive." },
  { id: "p3", date: offD(-3), name: "Move + Meditate", type: "MINDFUL", style: "Studio", temp: "Room Temp", duration: 60, description: "Accessible flow combined with guided meditation. Warming asanas cultivate the energy needed to support the mind in meditation. Embodiment and mindfulness come together.", intention: "Arrive more presently and more yourself, on and off the mat." },
];

const UPCOMING_PRACTICE = { id: "p-next", date: offD(1), name: "The Wind Down", type: "RESTORATIVE", style: "Studio", temp: "Room Temp", duration: 75, description: "A soothing evening practice designed to gently release tension and quiet the mind through restorative postures, breathwork, and mindfulness. An emphasis on deep relaxation.", intention: "Slow down. Transition into rest. You've done enough today.", teacherTip: "Grab a bolster, two blankets, and an eye pillow. Nest in." };

const CLASSES_TODAY = [
  { id: "cl1", time: "06:30", type: "Community Sunrise", coach: "Amy Asch", capacity: 18, registered: 12, waitlist: 0 },
  { id: "cl2", time: "09:00", type: "Hatha Flow", coach: "Eugene Lewins", capacity: 18, registered: 16, waitlist: 0 },
  { id: "cl3", time: "10:30", type: "Sweet and Deep", coach: "Emily Wright", capacity: 18, registered: 14, waitlist: 0 },
  { id: "cl4", time: "12:00", type: "Energizing Flow", coach: "Filipa Marques Costa", capacity: 18, registered: 18, waitlist: 3 },
  { id: "cl5", time: "17:30", type: "Yin Yoga", coach: "Eleanor Stray", capacity: 18, registered: 15, waitlist: 0 },
  { id: "cl6", time: "19:00", type: "The Wind Down", coach: "Laela Wilding", capacity: 14, registered: 11, waitlist: 0 },
];

const WEEKLY_SCHEDULE = [
  { day: "Monday", classes: [{ time: "06:30", type: "Community Sunrise", coach: "Amy" }, { time: "09:00", type: "Hatha Flow", coach: "Eugene" }, { time: "10:30", type: "Yoga Flow", coach: "Emily" }, { time: "17:30", type: "Yin Yoga", coach: "Eleanor" }, { time: "19:00", type: "Yoga Nidra", coach: "Laela" }] },
  { day: "Tuesday", classes: [{ time: "06:30", type: "Community Sunrise", coach: "Amy" }, { time: "09:00", type: "Energizing Flow", coach: "Filipa" }, { time: "10:30", type: "Deep Stretch", coach: "Eugene" }, { time: "17:30", type: "Move + Meditate", coach: "Eleanor" }, { time: "19:00", type: "The Wind Down", coach: "Laela" }] },
  { day: "Wednesday", classes: [{ time: "07:00", type: "Practicing Flow", coach: "Filipa" }, { time: "09:00", type: "Sweet and Deep", coach: "Emily" }, { time: "10:30", type: "Senior Yoga", coach: "Amy" }, { time: "17:30", type: "Hatha Flow", coach: "Eugene" }, { time: "19:00", type: "Yin Yoga", coach: "Eleanor" }] },
  { day: "Thursday", classes: [{ time: "06:30", type: "Community Sunrise", coach: "Amy" }, { time: "09:00", type: "Ocean Flow", coach: "Filipa" }, { time: "10:30", type: "Embodied Yoga Flow", coach: "Emily" }, { time: "17:30", type: "Flow + Restore", coach: "Laela" }] },
  { day: "Friday", classes: [{ time: "06:30", type: "Community Sunrise", coach: "Amy" }, { time: "09:00", type: "Hatha Flow", coach: "Eugene" }, { time: "10:30", type: "Energizing Flow", coach: "Filipa" }, { time: "17:30", type: "Yin Yoga", coach: "Eleanor" }, { time: "19:00", type: "Sound Bath", coach: "Nikki" }] },
  { day: "Saturday", classes: [{ time: "09:00", type: "Yoga Flow", coach: "Emily" }, { time: "10:30", type: "Deep Stretch", coach: "Eugene" }, { time: "12:00", type: "Yoga Nidra", coach: "Laela" }] },
  { day: "Sunday", classes: [{ time: "09:00", type: "Sweet and Deep", coach: "Amy" }, { time: "10:30", type: "Hatha Flow", coach: "Eugene" }, { time: "12:00", type: "Move + Meditate", coach: "Eleanor" }] },
];

const COMMUNITY_FEED = [
  { id: "cf1", user: "Nora B.", milestone: "100 Classes", message: "One hundred classes at All Heart. This tiny studio in NW Portland has become my sanctuary. Thank you Laela for building this space.", date: today, celebrations: 32 },
  { id: "cf2", user: "Amber T.", milestone: "30-Day Streak", message: "30 days on the mat. Community Sunrise with Amy changed my mornings completely. Feeling centered and alive.", date: today, celebrations: 18 },
  { id: "cf3", user: "Rob K.", milestone: "First Yoga Nidra!", message: "Eleanor's Move + Meditate unlocked something I didn't know I needed. Then I tried Nidra with Laela and... wow. Yogic sleep is real.", date: offD(-1), celebrations: 24 },
  { id: "cf4", user: "Linda P.", milestone: "1 Year Member", message: "One year since I walked through that door on 26th Ave. This community held me through the hardest year of my life. All heart, indeed.", date: offD(-2), celebrations: 41 },
];

const MILESTONE_BADGES = {
  "First Class": { icon: Leaf, color: T.accent }, "10 Classes": { icon: Wind, color: T.accent },
  "50 Classes": { icon: Mountain, color: T.accent }, "100 Classes": { icon: Sun, color: T.success },
  "7-Day Streak": { icon: Flame, color: T.warning }, "30-Day Streak": { icon: Sparkles, color: T.warning },
  "First Nidra": { icon: Moon, color: "#7c6eab" }, "Sound Bath": { icon: Music, color: "#6b8f9e" },
  "1 Year Member": { icon: Award, color: T.success },
};

const EVENTS = [
  { id: "ev1", name: "Sanctuary: Community Grief Circle", date: "2026-04-16", startTime: "19:00", type: "Circle", description: "A monthly practice of co-creating a container to hold experiences of loss with gentle care and loving-kindness. Ritual, mindful presence, writing prompts, and restorative yoga. Facilitated by Liz McCausland, MSW, RYT500. Sliding scale $30-50.", fee: 40, maxParticipants: 14, registered: 10, status: "Open" },
  { id: "ev2", name: "Constellations: Deep Listening Circle", date: "2026-05-07", startTime: "19:00", type: "Circle", description: "Co-creating a welcoming, safe environment for talking, sharing, and deep listening. Each meeting centered around a prompt -- our North Star -- as an invitation to practice thoughtful communication and quiet space-holding.", fee: 25, maxParticipants: 14, registered: 8, status: "Registration Open" },
  { id: "ev3", name: "Friday Sound Bath with Nikki", date: offD(4), startTime: "19:00", type: "Sound Bath", description: "An immersive journey with crystal bowls, chimes, and tuning forks. Access different levels of consciousness and restore balance to mind, body, and emotions. Arrive early to settle in with blankets and bolsters.", fee: 35, maxParticipants: 18, registered: 14, status: "Almost Full" },
  { id: "ev4", name: "Yoga Nidra Workshop: The Art of Yogic Sleep", date: offD(10), startTime: "14:00", type: "Workshop", description: "With Laela Wilding. An extended Yoga Nidra session with instruction on the practice of dropping into presence and releasing goal-oriented thoughts. A sacred pause and wonderful pathway to inner peace.", fee: 45, maxParticipants: 16, registered: 9, status: "Registration Open" },
];

const MEMBERSHIP_TIERS = [
  { id: "m0", name: "New Student Special", type: "intro", price: 49, period: "21 days", features: ["Unlimited classes for 21 days", "In-studio + livestream", "10% off subsequent membership", "New students only"], popular: false },
  { id: "m1", name: "Single Drop-In", type: "drop-in", price: 23, period: "per class", features: ["1 class credit", "Valid for 1 month", "Any weekly class"], popular: false },
  { id: "m2", name: "5 Class Pass", type: "pack", price: 100, period: "5 classes", features: ["5 class credits", "Valid for 3 months", "In-studio or livestream"], popular: false },
  { id: "m3", name: "10 Class Pass", type: "pack", price: 189, period: "10 classes", features: ["10 class credits", "Valid for 5 months", "Best value per class"], popular: false },
  { id: "m4", name: "Unlimited Membership", type: "unlimited", price: 128, period: "/month", features: ["Unlimited in-studio classes", "Livestream access", "10% off workshops + shop", "Guest pass each month", "3-month minimum"], popular: true },
];

const ANNOUNCEMENTS = [
  { id: "a1", title: "Sanctuary Grief Circle -- April 16", message: "Monthly community grief circle with Liz McCausland. From personal loss to collective loss, you do not have to do this alone. Sliding scale.", type: "celebration", pinned: true },
  { id: "a2", title: "Community Care Pricing", message: "If you participate in SNAP, WIC, or other income-based assistance, you may qualify for reduced-rate classes. Yoga should be accessible to everyone.", type: "info", pinned: false },
];

const MEMBERS_DATA = [
  { id: "m1", name: "Nora Beaumont", email: "nora@email.com", membership: "Unlimited", status: "active", joined: "2023-06-01", checkIns: 198, lastVisit: today },
  { id: "m2", name: "Amber Torres", email: "amber@email.com", membership: "Unlimited", status: "active", joined: "2024-01-15", checkIns: 134, lastVisit: offD(-1) },
  { id: "m3", name: "Rob Keating", email: "rob@email.com", membership: "Unlimited", status: "active", joined: "2024-09-01", checkIns: 68, lastVisit: today },
  { id: "m4", name: "Linda Pham", email: "linda@email.com", membership: "Unlimited", status: "active", joined: "2025-04-01", checkIns: 87, lastVisit: today },
  { id: "m5", name: "Sara Chen", email: "sara@email.com", membership: "10 Class Pass", status: "active", joined: "2025-11-01", checkIns: 7, lastVisit: offD(-4) },
  { id: "m6", name: "David Park", email: "david@email.com", membership: "5 Class Pass", status: "active", joined: "2026-02-01", checkIns: 3, lastVisit: offD(-6) },
  { id: "m7", name: "Mia Santos", email: "mia@email.com", membership: "Unlimited", status: "frozen", joined: "2024-03-01", checkIns: 92, lastVisit: offD(-30) },
];

const ADMIN_METRICS = { activeMembers: 124, memberChange: 8, todayCheckIns: 42, weekCheckIns: 248, monthlyRevenue: 16400, revenueChange: 6.8, workshopRevenue: 2100 };
const ADMIN_CHARTS = {
  attendance: [{ day: "Mon", total: 38 }, { day: "Tue", total: 34 }, { day: "Wed", total: 32 }, { day: "Thu", total: 28 }, { day: "Fri", total: 42 }, { day: "Sat", total: 36 }, { day: "Sun", total: 28 }],
  revenue: [{ month: "Oct", revenue: 13200 }, { month: "Nov", revenue: 14100 }, { month: "Dec", revenue: 13800 }, { month: "Jan", revenue: 15200 }, { month: "Feb", revenue: 15800 }, { month: "Mar", revenue: 16400 }],
  membershipBreakdown: [{ name: "Unlimited", value: 72, color: T.accent }, { name: "10 Pack", value: 22, color: T.success }, { name: "5 Pack", value: 16, color: T.warning }, { name: "Drop-In", value: 14, color: T.textMuted }],
  classPopularity: [{ name: "Hatha Flow", pct: 94 }, { name: "Energizing Flow", pct: 90 }, { name: "Yin Yoga", pct: 86 }, { name: "Community Sunrise", pct: 78 }, { name: "Sweet and Deep", pct: 74 }, { name: "Yoga Nidra", pct: 68 }],
};

// ===================================================================
//  CONTEXT + SHARED COMPONENTS
// ===================================================================
const AppContext = createContext();

function PageHero({ title, subtitle, img, gradient }) {
  const fallbackGrad = gradient || `linear-gradient(135deg, ${T.bg}, hsl(340,15%,18%), hsl(155,15%,16%))`;
  const bg = img ? `url(${img}), ${fallbackGrad}` : fallbackGrad;
  return (
    <div style={{ position: "relative", minHeight: 220, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "24px 20px 20px", marginBottom: 16, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: bg, backgroundSize: "cover", backgroundPosition: "center", filter: img ? "brightness(0.7)" : "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.45) 100%)" }} />
      <div style={{ position: "relative", zIndex: 1, color: "#fff" }}>
        <h1 style={{ fontFamily: DF, fontSize: "3.5rem", margin: "0 0 6px", lineHeight: 1.05, fontWeight: 700 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.4, maxWidth: "85%" }}>{subtitle}</p>}
      </div>
    </div>
  );
}

function SH({ title, linkText, linkPage }) {
  const { setPage } = useContext(AppContext);
  return (<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><h2 style={{ fontFamily: DF, fontSize: 22, color: T.text, margin: 0, fontWeight: 600 }}>{title}</h2>{linkText && <button onClick={() => setPage(linkPage)} style={{ fontSize: 13, fontWeight: 600, color: T.accent, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>{linkText} <ChevronRight size={14} /></button>}</div>);
}

function SB({ label, value }) { return (<div style={{ background: T.bgDim, borderRadius: 10, padding: "12px 14px", textAlign: "center" }}><div style={{ fontFamily: DF, fontSize: 22, color: T.text, fontWeight: 700 }}>{value}</div><div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>{label}</div></div>); }

function IF({ label, value, onChange, placeholder, multiline }) {
  const s = { width: "100%", padding: "10px 14px", background: T.bgDim, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 13, fontFamily: "'DM Sans', system-ui, sans-serif", outline: "none", boxSizing: "border-box", resize: "none" };
  return (<div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>{multiline ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s} /> : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s} />}</div>);
}

function PCard({ practice: p, expanded, onToggle }) {
  const isToday = p.date === today, isFuture = p.date > today;
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${isToday ? T.accentBorder : T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer" }} onClick={onToggle}>
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              {isToday && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "2px 8px", borderRadius: 4, background: T.accentGhost, color: T.accent }}>Today</span>}
              {isFuture && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "2px 8px", borderRadius: 4, background: T.successGhost, color: T.success }}>Upcoming</span>}
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "2px 8px", borderRadius: 4, background: T.bgDim, color: T.textMuted }}>{p.type}</span>
            </div>
            <h3 style={{ fontFamily: DF, fontSize: 20, margin: 0, color: T.text, fontWeight: 600 }}>{p.name}</h3>
          </div>
          <ChevronDown size={18} color={T.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0, marginTop: 4 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: T.textMuted }}><span>{fmtDS(p.date)}</span><span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={12} /> {p.duration} min</span></div>
      </div>
      {expanded && (
        <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${T.borderLight}`, paddingTop: 14 }}>
          <p style={{ fontSize: 13, color: "#5a4850", lineHeight: 1.6, margin: "0 0 12px" }}>{p.description}</p>
          {p.intention && <div style={{ padding: "10px 14px", borderRadius: 10, background: `linear-gradient(135deg, ${T.accentGhost}, transparent)`, border: `1px solid ${T.accentBorder}`, marginBottom: 10 }}><p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: T.accent, margin: "0 0 4px", letterSpacing: "0.05em" }}>Intention</p><p style={{ fontSize: 13, color: T.text, fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>{p.intention}</p></div>}
          {p.teacherTip && <div style={{ padding: "10px 14px", borderRadius: 10, background: T.bgDim }}><p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: T.textMuted, margin: "0 0 4px", letterSpacing: "0.05em" }}>Teacher Tip</p><p style={{ fontSize: 13, color: "#5a4850", margin: 0, lineHeight: 1.5 }}>{p.teacherTip}</p></div>}
        </div>
      )}
    </div>
  );
}

function CTACard() {
  return (<div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(340,15%,18%))`, borderRadius: 16, padding: "24px 20px", color: "#fff", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: `${T.accent}15` }} />
    <Heart size={28} color={T.accent} style={{ marginBottom: 12 }} />
    <h3 style={{ fontFamily: DF, fontSize: 22, margin: "0 0 6px", fontWeight: 600 }}>21 Days for $49</h3>
    <p style={{ fontSize: 13, color: "#b8a0a8", margin: "0 0 16px", lineHeight: 1.5 }}>New to All Heart? Unlimited classes for 21 days. All styles, all levels. Welcome home.</p>
    <button style={{ padding: "12px 24px", borderRadius: 8, border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: DF, background: T.accent, color: "#fff" }}>Start Your Journey</button>
  </div>);
}

function AC({ title, children }) { return (<div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}><h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>{title}</h3>{children}</div>); }

// ===================================================================
//  MODALS
// ===================================================================
function SettingsModal({ onClose }) {
  return (<div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
    <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 390, background: T.bgCard, borderRadius: "20px 20px 0 0", padding: "20px 20px 32px", maxHeight: "80vh", overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}><h2 style={{ fontFamily: DF, fontSize: 24, margin: 0, fontWeight: 600 }}>Settings</h2><button onClick={onClose} style={{ padding: 4, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer" }}><X size={20} color={T.textMuted} /></button></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[{ icon: MapPin, label: SC.address.street, sub: `${SC.address.city}, ${SC.address.state} ${SC.address.zip}` }, { icon: Clock, label: "Mon-Fri: 6:30 AM - 8:30 PM", sub: "Sat-Sun: 9:00 AM - 12:15 PM" }, { icon: Share2, label: SC.social.instagram, sub: "Follow us on Instagram" }, { icon: Gift, label: "Heart Points", sub: "Earn points with every class" }, { icon: Heart, label: "Community Care", sub: "Reduced rates for SNAP/WIC participants" }].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgDim, borderRadius: 12 }}><item.icon size={20} color={T.accent} /><div><p style={{ fontWeight: 600, fontSize: 14, margin: 0, color: T.text }}>{item.label}</p><p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{item.sub}</p></div></div>
        ))}
      </div>
    </div>
  </div>);
}

function NotificationsModal({ onClose }) {
  const ns = [
    { id: "n1", title: "Class Confirmed", message: "You're booked for Hatha Flow at 9:00 AM tomorrow with Eugene.", time: "2h ago", read: false },
    { id: "n2", title: "Heart Points Earned", message: "You earned 15 Heart Points. 35 points to your next guest pass.", time: "1d ago", read: false },
    { id: "n3", title: "Sound Bath Friday", message: "Nikki's Friday Sound Bath is almost full. Reserve your spot.", time: "2d ago", read: true },
    { id: "n4", title: "Sanctuary -- April 16", message: "Monthly community grief circle with Liz. Sliding scale $30-50.", time: "3d ago", read: true },
  ];
  return (<div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
    <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 390, background: T.bgCard, borderRadius: "20px 20px 0 0", padding: "20px 20px 32px", maxHeight: "80vh", overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><h2 style={{ fontFamily: DF, fontSize: 24, margin: 0, fontWeight: 600 }}>Notifications</h2><button onClick={onClose} style={{ padding: 4, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer" }}><X size={20} color={T.textMuted} /></button></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{ns.map(n => (
        <div key={n.id} style={{ padding: "14px 16px", borderRadius: 12, background: n.read ? T.bgDim : T.accentGhost, border: `1px solid ${n.read ? T.border : T.accentBorder}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px", color: T.text }}>{n.title}</h4>{!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, flexShrink: 0, marginTop: 4 }} />}</div>
          <p style={{ fontSize: 13, color: "#5a4850", margin: "0 0 4px", lineHeight: 1.4 }}>{n.message}</p><p style={{ fontSize: 11, color: T.textFaint, margin: 0 }}>{n.time}</p>
        </div>
      ))}</div>
    </div>
  </div>);
}

function ReservationModal({ classData, onConfirm, onClose }) {
  const [confirmed, setConfirmed] = useState(false);
  const isFull = classData.registered >= classData.capacity;
  const doConfirm = () => { onConfirm(classData.id); setConfirmed(true); setTimeout(onClose, 1500); };
  return (<div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div onClick={e => e.stopPropagation()} style={{ width: "90%", maxWidth: 340, background: T.bgCard, borderRadius: 18, padding: "24px 22px", boxShadow: "0 12px 40px rgba(0,0,0,.2)" }}>
      {confirmed ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}><div style={{ width: 56, height: 56, borderRadius: "50%", background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}><Check size={28} color={T.accent} /></div><h3 style={{ fontFamily: DF, fontSize: 22, margin: "0 0 6px", fontWeight: 600 }}>{isFull ? "Added to Waitlist" : "You're In!"}</h3><p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>See you on the mat</p></div>
      ) : (<>
        <h3 style={{ fontFamily: DF, fontSize: 22, margin: "0 0 4px", color: T.text, fontWeight: 600 }}>Reserve Your Spot</h3>
        <p style={{ fontSize: 13, color: T.textMuted, margin: "0 0 16px" }}>{classData.dayLabel || fmtDS(today)}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {[["Class", classData.type], ["Time", fmtT(classData.time)], ["Teacher", classData.coach], ["Spots", isFull ? `Full -- ${classData.waitlist || 0} waitlisted` : `${classData.capacity - classData.registered} open`]].map(([l, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${T.borderLight}` : "none" }}><span style={{ fontSize: 13, color: T.textMuted }}>{l}</span><span style={{ fontSize: 13, fontWeight: 600, color: l === "Spots" ? (isFull ? T.warning : T.accent) : T.text }}>{v}</span></div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", fontSize: 14, fontWeight: 600, cursor: "pointer", color: T.textMuted }}>Cancel</button>
          <button onClick={doConfirm} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: DF, background: T.accent, color: "#fff" }}>{isFull ? "Join Waitlist" : "Confirm"}</button>
        </div>
      </>)}
    </div>
  </div>);
}

// ===================================================================
//  CONSUMER PAGES
// ===================================================================
function HomePage() {
  const { openReservation, feedCelebrations, celebrateFeed } = useContext(AppContext);
  const now = new Date(); const cm = now.getHours() * 60 + now.getMinutes();
  const upcoming = CLASSES_TODAY.filter(c => { const [h, m] = c.time.split(":").map(Number); return h * 60 + m > cm; });
  return (<div>
    <PageHero title={<>{SC.heroLine1} <span style={{ color: T.accent }}>{SC.heroLine2}</span></>} subtitle={SC.description} img={IMG.home} />
    <section style={{ padding: "20px 16px 0" }}><SH title="Today's Practice" linkText="All Classes" linkPage="classes" /><PCard practice={TODAYS_FOCUS} expanded onToggle={() => {}} /></section>
    <section style={{ padding: "0 16px", marginTop: 24 }}>
      <SH title="Up Next" linkText="Full Schedule" linkPage="schedule" />
      {upcoming.length > 0 ? <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{upcoming.slice(0, 4).map(c => (
        <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
          <div style={{ textAlign: "center", minWidth: 54 }}><span style={{ fontFamily: DF, fontSize: 16, color: T.text, fontWeight: 600 }}>{fmtT(c.time)}</span></div>
          <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: 13, color: T.text, margin: 0 }}>{c.type}</p><p style={{ fontSize: 11, color: T.textMuted, margin: "2px 0 0" }}>{c.coach} -- {c.registered}/{c.capacity}</p></div>
          <button onClick={() => openReservation(c)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", background: c.registered >= c.capacity ? T.warningGhost : T.accent, color: c.registered >= c.capacity ? T.warning : "#fff" }}>{c.registered >= c.capacity ? "Waitlist" : "Reserve"}</button>
        </div>
      ))}</div> : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 20px", color: T.textFaint }}><Moon size={28} style={{ marginBottom: 8 }} /><p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>No more classes today</p></div>}
    </section>
    <section style={{ padding: "0 16px", marginTop: 28 }}>
      <SH title="Community" linkText="View All" linkPage="community" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{COMMUNITY_FEED.slice(0, 3).map(item => { const myC = feedCelebrations[item.id] || 0; return (
        <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: `linear-gradient(135deg, ${T.successGhost}, transparent)`, border: `1px solid ${T.successBorder}`, borderRadius: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Sparkles size={18} color="#fff" /></div>
          <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{item.user} <span style={{ color: T.accent }}>{item.milestone}</span></p><p style={{ fontSize: 12, color: "#6b5860", margin: "2px 0 0", lineHeight: 1.4 }}>{item.message.length > 55 ? item.message.slice(0, 55) + "..." : item.message}</p></div>
          <button onClick={() => celebrateFeed(item.id)} style={{ padding: 8, borderRadius: 8, border: "none", background: myC > 0 ? T.accentGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}><Heart size={18} color={T.accent} fill={myC > 0 ? T.accent : "none"} /><span style={{ fontSize: 12, fontWeight: 600, color: T.accent }}>{item.celebrations + myC}</span></button>
        </div>); })}</div>
    </section>
    <section style={{ padding: "0 16px", marginTop: 28 }}><SH title="Announcements" /><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{ANNOUNCEMENTS.map(a => (<div key={a.id} style={{ padding: "14px 16px", borderRadius: 12, borderLeft: `4px solid ${a.type === "celebration" ? T.accent : T.textMuted}`, background: a.type === "celebration" ? T.accentGhost : T.bgDim }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}><div><h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: 0 }}>{a.title}</h3><p style={{ fontSize: 13, color: "#6b5860", margin: "4px 0 0" }}>{a.message}</p></div>{a.pinned && <span style={{ fontSize: 11, fontWeight: 600, color: T.accent, background: T.accentGhost, padding: "2px 8px", borderRadius: 99 }}>Pinned</span>}</div></div>))}</div></section>
    <section style={{ padding: "0 16px", marginTop: 28 }}><CTACard /></section>
  </div>);
}

function ClassesPage() { const [exp, setExp] = useState(null); const all = [TODAYS_FOCUS, ...PAST_PRACTICES, UPCOMING_PRACTICE].sort((a, b) => b.date.localeCompare(a.date)); return (<div><PageHero title="Classes" subtitle="Past, present, and upcoming practice" img={IMG.classes} /><div style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 12 }}>{all.map(p => <PCard key={p.id} practice={p} expanded={exp === p.id} onToggle={() => setExp(exp === p.id ? null : p.id)} />)}</div></div>); }

function SchedulePage() {
  const [selDay, setSelDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const { openReservation } = useContext(AppContext);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return (<div><PageHero title="Schedule" subtitle="Reserve your spot -- classes are intimate" img={IMG.schedule} />
    <div style={{ padding: "20px 16px 0" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>{days.map((d, i) => <button key={d} onClick={() => setSelDay(i)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", background: selDay === i ? T.accent : T.bgDim, color: selDay === i ? "#fff" : T.textMuted }}>{d}</button>)}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {(WEEKLY_SCHEDULE[selDay]?.classes || []).map((cls, i) => {
          const isSpecial = cls.type.includes("Yin") || cls.type.includes("Nidra") || cls.type.includes("Wind") || cls.type.includes("Sound") || cls.type.includes("Restore");
          return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
            <div style={{ textAlign: "center", minWidth: 56 }}><span style={{ fontFamily: DF, fontSize: 18, color: T.text, fontWeight: 600 }}>{fmtT(cls.time)}</span></div>
            <div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{cls.type}</p>{isSpecial && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "1px 6px", borderRadius: 4, background: T.warningGhost, color: T.warning }}>Restorative</span>}</div>{cls.coach && <p style={{ fontSize: 12, color: T.textMuted, margin: "3px 0 0" }}>{cls.coach}</p>}</div>
            <button onClick={() => openReservation({ id: `s-${selDay}-${i}`, time: cls.time, type: cls.type, coach: cls.coach || "TBD", capacity: isSpecial ? SC.specialtyCapacity : SC.classCapacity, registered: Math.floor(Math.random() * 6) + 8, waitlist: 0, dayLabel: dayNames[selDay] })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: T.accent, color: "#fff" }}>Reserve</button>
          </div>);
        })}
      </div>
    </div>
  </div>);
}

function PracticePage() {
  const [tab, setTab] = useState("log");
  const [ref, setRef] = useState({ energy: 4, focus: 4, notes: "" });
  const [saved, setSaved] = useState(null);
  return (<div><PageHero title="My Practice" subtitle="Track your journey and celebrate growth" img={IMG.practice} />
    <div style={{ padding: "20px 16px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        {[{ icon: Flame, val: 12, label: "Day Streak", c: T.accent, bg: T.accentGhost, bd: T.accentBorder }, { icon: Star, val: 78, label: "Total Classes", c: T.success, bg: T.successGhost, bd: T.successBorder }, { icon: Mountain, val: 6, label: "Milestones", c: T.warning, bg: T.warningGhost, bd: T.warningBorder }].map((s, i) => (
          <div key={i} style={{ background: s.bg, border: `1px solid ${s.bd}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}><s.icon size={20} color={s.c} style={{ margin: "0 auto 4px" }} /><div style={{ fontFamily: DF, fontSize: 28, fontWeight: 700, color: T.text }}>{s.val}</div><div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div></div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: T.bgDim, borderRadius: 10, padding: 4 }}>{[{ id: "log", label: "Reflection" }, { id: "milestones", label: "Milestones" }].map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: tab === t.id ? T.bgCard : "transparent", color: tab === t.id ? T.text : T.textMuted, boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,.06)" : "none" }}>{t.label}</button>)}</div>
      {tab === "log" && (
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><Heart size={18} color={T.accent} /><h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Post-Practice Reflection</h3></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[{ label: "Energy Level", key: "energy", icons: [Moon, Moon, Sun, Sun, Sparkles], c: T.accent }, { label: "Focus & Presence", key: "focus", icons: [Wind, Wind, Heart, Heart, Sparkles], c: T.success }].map(row => (
              <div key={row.key}><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{row.label}</label><div style={{ display: "flex", gap: 6 }}>{[1,2,3,4,5].map(n => { const I = row.icons[n-1]; return <button key={n} onClick={() => setRef({...ref, [row.key]: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${ref[row.key] >= n ? row.c : T.border}`, background: ref[row.key] >= n ? `${row.c}12` : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><I size={18} color={ref[row.key] >= n ? row.c : T.textFaint} /></button>; })}</div></div>
            ))}
            <IF label="Notes / Gratitude" value={ref.notes} onChange={v => setRef({...ref, notes: v})} placeholder="What came up for you on the mat today?" multiline />
            <button onClick={() => { setSaved("log"); setTimeout(() => setSaved(null), 2000); setRef({ energy: 4, focus: 4, notes: "" }); }} style={{ padding: "12px 0", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: T.accent, color: "#fff", fontFamily: DF, fontSize: 17 }}>{saved === "log" ? <><Check size={16} style={{ display: "inline", verticalAlign: "middle" }} /> Saved</> : "Save Reflection"}</button>
          </div>
        </div>
      )}
      {tab === "milestones" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{Object.entries(MILESTONE_BADGES).map(([name, badge]) => { const earned = ["First Class", "10 Classes", "50 Classes", "7-Day Streak", "30-Day Streak", "1 Year Member"].includes(name); const Icon = badge.icon; return (<div key={name} style={{ background: earned ? T.bgCard : T.bgDim, border: `1px solid ${earned ? T.border : "transparent"}`, borderRadius: 12, padding: "16px 14px", textAlign: "center", opacity: earned ? 1 : 0.45 }}><div style={{ width: 44, height: 44, borderRadius: "50%", background: earned ? `${badge.color}18` : T.bgDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}><Icon size={22} color={earned ? badge.color : T.textFaint} /></div><p style={{ fontSize: 13, fontWeight: 700, color: earned ? T.text : T.textFaint, margin: 0 }}>{name}</p><p style={{ fontSize: 11, color: T.textFaint, margin: "2px 0 0" }}>{earned ? "Earned" : "Keep going"}</p></div>); })}</div>
      )}
    </div>
  </div>);
}

function CommunityPage() { const { feedCelebrations, celebrateFeed } = useContext(AppContext); return (<div><PageHero title="Community" subtitle="Celebrate each other's practice" img={IMG.community} /><div style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>{COMMUNITY_FEED.map(item => { const myC = feedCelebrations[item.id] || 0; return (<div key={item.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px" }}><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DF, fontSize: 16, color: "#fff", fontWeight: 700, flexShrink: 0 }}>{item.user[0]}</div><div><p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: T.text }}>{item.user}</p><p style={{ fontSize: 12, color: T.textMuted, margin: "1px 0 0" }}>{fmtDS(item.date)}</p></div><span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{item.milestone}</span></div><p style={{ fontSize: 14, color: "#4a3e42", lineHeight: 1.5, margin: "0 0 12px" }}>{item.message}</p><button onClick={() => celebrateFeed(item.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `1px solid ${myC > 0 ? T.accentBorder : T.border}`, background: myC > 0 ? T.accentGhost : "transparent", cursor: "pointer" }}><Heart size={16} color={T.accent} fill={myC > 0 ? T.accent : "none"} /><span style={{ fontSize: 13, fontWeight: 600, color: T.accent }}>{item.celebrations + myC}</span></button></div>); })}</div></div>); }

function TeachersPage() { const [exp, setExp] = useState(null); return (<div><PageHero title="Instructors" subtitle="Meet the All Heart teaching team" img={IMG.teachers} /><div style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 12 }}>{TEACHERS.map(t => { const expanded = exp === t.id; return (<div key={t.id} onClick={() => setExp(expanded ? null : t.id)} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer" }}><div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}><div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DF, fontSize: 22, color: "#fff", flexShrink: 0, fontWeight: 600 }}>{t.firstName[0]}{t.lastName[0]}</div><div style={{ flex: 1 }}><h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: T.text }}>{t.firstName} {t.lastName}</h3><p style={{ fontSize: 13, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{t.role}</p><p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{t.yearsTeaching} years teaching</p></div><ChevronDown size={18} color={T.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} /></div>{expanded && <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${T.borderLight}`, paddingTop: 14 }}><p style={{ fontSize: 13, color: "#5a4850", lineHeight: 1.6, margin: "0 0 12px" }}>{t.bio}</p><div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>{t.specialties.map(s => <span key={s} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{s}</span>)}</div><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{t.certs.map(c => <span key={c} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.bgDim, color: T.textMuted }}>{c}</span>)}</div></div>}</div>); })}</div></div>); }

function MembershipPage() { return (<div><PageHero title="Pricing" subtitle="Find your path to practice" img={IMG.membership} /><div style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 12 }}>{MEMBERSHIP_TIERS.map(tier => (<div key={tier.id} style={{ background: T.bgCard, border: `1px solid ${tier.popular ? T.accent : T.border}`, borderRadius: 14, padding: "20px 18px", position: "relative", overflow: "hidden" }}>{tier.popular && <div style={{ position: "absolute", top: 12, right: -28, background: T.accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 32px", transform: "rotate(45deg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Popular</div>}<h3 style={{ fontFamily: DF, fontSize: 22, margin: "0 0 4px", color: T.text, fontWeight: 600 }}>{tier.name}</h3><div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}><span style={{ fontFamily: DF, fontSize: 38, color: T.accent, fontWeight: 700 }}>${tier.price}</span><span style={{ fontSize: 13, color: T.textMuted }}>{tier.period}</span></div><ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>{tier.features.map((f, i) => <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13, color: "#5a4850" }}><CircleCheck size={14} color={T.accent} style={{ flexShrink: 0 }} />{f}</li>)}</ul><button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: DF, background: tier.popular ? T.accent : T.bg, color: "#fff" }}>Get Started</button></div>))}</div></div>); }

function EventsPage() { return (<div><PageHero title="Events" subtitle="Workshops, circles, and special offerings" img={IMG.events} /><div style={{ padding: "20px 16px 0" }}>{EVENTS.map(ev => (<div key={ev.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}><div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(340,15%,18%))`, padding: "20px 18px", color: "#fff" }}><span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent }}>{ev.type}</span><h3 style={{ fontFamily: DF, fontSize: 22, margin: "6px 0 4px", fontWeight: 600 }}>{ev.name}</h3><div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#b8a0a8" }}><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={14} /> {fmtDS(ev.date)}</span><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {fmtT(ev.startTime)}</span></div></div><div style={{ padding: "16px 18px" }}><p style={{ fontSize: 13, color: "#5a4850", lineHeight: 1.6, margin: "0 0 14px" }}>{ev.description}</p><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}><SB label="Price" value={`$${ev.fee}`} /><SB label="Spots" value={`${ev.registered}/${ev.maxParticipants}`} /></div><button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: DF, background: T.accent, color: "#fff" }}>Register Now</button></div></div>))}</div></div>); }

// ===================================================================
//  ADMIN PAGES
// ===================================================================
function AdminDashboard() {
  const metrics = [{ label: "Active Members", value: ADMIN_METRICS.activeMembers, change: `+${ADMIN_METRICS.memberChange}`, icon: Users, color: T.accent }, { label: "Today's Check-ins", value: ADMIN_METRICS.todayCheckIns, change: `${ADMIN_METRICS.weekCheckIns}/wk`, icon: Calendar, color: T.success }, { label: "Monthly Revenue", value: `$${ADMIN_METRICS.monthlyRevenue.toLocaleString()}`, change: `+${ADMIN_METRICS.revenueChange}%`, icon: DollarSign, color: T.warning }, { label: "Workshop Revenue", value: `$${ADMIN_METRICS.workshopRevenue.toLocaleString()}`, change: "+12 registrations", icon: Award, color: "#7c6eab" }];
  return (<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <div><h1 style={{ fontFamily: DF, fontSize: 28, color: "#111827", margin: 0, fontWeight: 600 }}>Dashboard</h1><p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>All Heart Yoga -- NW Portland</p></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>{metrics.map((m, i) => (<div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}><div style={{ width: 36, height: 36, borderRadius: 8, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><m.icon size={18} color={m.color} /></div><div style={{ fontFamily: DF, fontSize: 30, color: "#111827", fontWeight: 700 }}>{m.value}</div><span style={{ display: "flex", alignItems: "center", fontSize: 12, fontWeight: 600, color: "#16a34a", marginTop: 4 }}><ArrowUpRight size={12} /> {m.change}</span><p style={{ fontSize: 13, color: "#6b7280", margin: "6px 0 0" }}>{m.label}</p></div>))}</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
      <AC title="Weekly Attendance"><div style={{ height: 220 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={ADMIN_CHARTS.attendance}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="day" stroke="#6b7280" fontSize={12} /><YAxis stroke="#6b7280" fontSize={12} /><Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827" }} /><Bar dataKey="total" fill={T.accent} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></AC>
      <AC title="Revenue Trend"><div style={{ height: 220 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={ADMIN_CHARTS.revenue}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" stroke="#6b7280" fontSize={12} /><YAxis stroke="#6b7280" fontSize={12} tickFormatter={v => `$${v / 1000}k`} /><Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827" }} formatter={v => [`$${v.toLocaleString()}`, "Revenue"]} /><defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.accent} stopOpacity={0.3} /><stop offset="100%" stopColor={T.accent} stopOpacity={0} /></linearGradient></defs><Area type="monotone" dataKey="revenue" stroke={T.accent} fill="url(#rg)" /></AreaChart></ResponsiveContainer></div></AC>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
      <AC title="Membership Breakdown"><div style={{ height: 200 }}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={ADMIN_CHARTS.membershipBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>{ADMIN_CHARTS.membershipBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827" }} /></PieChart></ResponsiveContainer></div><div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>{ADMIN_CHARTS.membershipBreakdown.map((e, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: e.color }} /><span style={{ fontSize: 11, color: "#6b7280" }}>{e.name} ({e.value})</span></div>)}</div></AC>
      <AC title="Class Fill Rate"><div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{ADMIN_CHARTS.classPopularity.map((c, i) => <div key={i}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{c.name}</span><span style={{ fontSize: 11, color: "#6b7280" }}>{c.pct}%</span></div><div style={{ height: 6, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${c.pct}%`, background: T.accent, borderRadius: 3 }} /></div></div>)}</div></AC>
    </div>
  </div>);
}

function AdminMembersPage() { const [search, setSearch] = useState(""); const [filter, setFilter] = useState("all"); const filtered = MEMBERS_DATA.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) && (filter === "all" || m.status === filter)); return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h1 style={{ fontFamily: DF, fontSize: 28, color: "#111827", margin: 0, fontWeight: 600 }}>Members</h1><button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><UserPlus size={16} /> Add Member</button></div><div style={{ display: "flex", gap: 10 }}><div style={{ flex: 1, position: "relative" }}><Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." style={{ width: "100%", padding: "10px 12px 10px 36px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827", fontSize: 13, outline: "none", boxSizing: "border-box" }} /></div><div style={{ display: "flex", gap: 4 }}>{["all", "active", "frozen"].map(f => <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: filter === f ? T.accent : "#f3f4f6", color: filter === f ? "#fff" : "#6b7280" }}>{f}</button>)}</div></div><div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}><thead><tr style={{ borderBottom: "1px solid #e5e7eb" }}>{["Member", "Plan", "Status", "Classes"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>)}</tr></thead><tbody>{filtered.map(m => <tr key={m.id} style={{ borderBottom: "1px solid #f3f4f6" }}><td style={{ padding: "12px 16px" }}><p style={{ color: "#111827", fontWeight: 600, margin: 0 }}>{m.name}</p><p style={{ color: "#9ca3af", fontSize: 12, margin: "2px 0 0" }}>{m.email}</p></td><td style={{ padding: "12px 16px", color: "#374151" }}>{m.membership}</td><td style={{ padding: "12px 16px" }}><span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, textTransform: "capitalize", background: m.status === "active" ? `${T.accent}20` : `${T.warning}20`, color: m.status === "active" ? T.accent : T.warning }}>{m.status}</span></td><td style={{ padding: "12px 16px", color: "#374151", fontFamily: "monospace" }}>{m.checkIns}</td></tr>)}</tbody></table></div></div>); }

function AdminSchedulePage() { return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h1 style={{ fontFamily: DF, fontSize: 28, color: "#111827", margin: 0, fontWeight: 600 }}>Schedule</h1><button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><Plus size={16} /> Add Class</button></div><div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}><thead><tr style={{ borderBottom: "1px solid #e5e7eb" }}>{["Time", "Class", "Teacher", "Spots", ""].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>)}</tr></thead><tbody>{CLASSES_TODAY.map(c => <tr key={c.id} style={{ borderBottom: "1px solid #f3f4f6" }}><td style={{ padding: "12px 16px", color: "#111827", fontFamily: "monospace" }}>{fmtT(c.time)}</td><td style={{ padding: "12px 16px", color: "#374151", fontWeight: 600 }}>{c.type}</td><td style={{ padding: "12px 16px", color: "#374151" }}>{c.coach}</td><td style={{ padding: "12px 16px" }}><span style={{ fontFamily: "monospace", fontWeight: 600, color: c.registered >= c.capacity ? T.warning : T.accent }}>{c.registered}/{c.capacity}</span></td><td style={{ padding: "12px 16px" }}><div style={{ display: "flex", gap: 4 }}><button style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #e5e7eb", background: "transparent", color: "#6b7280", cursor: "pointer" }}><Edit3 size={12} /></button><button style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #e5e7eb", background: "transparent", color: "#6b7280", cursor: "pointer" }}><Trash2 size={12} /></button></div></td></tr>)}</tbody></table></div></div>); }

function AdminTeachersPage() { return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h1 style={{ fontFamily: DF, fontSize: 28, color: "#111827", margin: 0, fontWeight: 600 }}>Teachers</h1><button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><UserPlus size={16} /> Add Teacher</button></div><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>{TEACHERS.map(t => (<div key={t.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}><div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}><div style={{ width: 48, height: 48, borderRadius: 10, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DF, fontSize: 20, color: "#fff", fontWeight: 600 }}>{t.firstName[0]}{t.lastName[0]}</div><div><h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>{t.firstName} {t.lastName}</h3><p style={{ fontSize: 12, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{t.role}</p></div></div><div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>{t.certs.map(c => <span key={c} style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#f3f4f6", color: "#6b7280" }}>{c}</span>)}</div><div style={{ display: "flex", gap: 6 }}><button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button><button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Schedule</button><button style={{ padding: "8px", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#6b7280", cursor: "pointer" }}><Trash2 size={14} /></button></div></div>))}</div></div>); }

function AdminEventsPage() { return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h1 style={{ fontFamily: DF, fontSize: 28, color: "#111827", margin: 0, fontWeight: 600 }}>Events</h1><button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><Plus size={16} /> Add Event</button></div>{EVENTS.map(ev => (<div key={ev.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><div><h3 style={{ color: "#111827", fontWeight: 700, fontSize: 15, margin: "0 0 4px" }}>{ev.name}</h3><p style={{ color: "#6b7280", fontSize: 12 }}>{fmtDS(ev.date)} -- {ev.type}</p></div><div style={{ display: "flex", gap: 4 }}><button style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#374151", cursor: "pointer" }}><Edit3 size={14} /></button><button style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#6b7280", cursor: "pointer" }}><Trash2 size={14} /></button></div></div><div style={{ display: "flex", gap: 16, marginTop: 8 }}><span style={{ fontSize: 12, color: "#6b7280" }}>${ev.fee}</span><span style={{ fontSize: 12, color: "#6b7280" }}>{ev.registered}/{ev.maxParticipants}</span><span style={{ fontSize: 12, fontWeight: 600, color: T.accent }}>{ev.status}</span></div></div>))}</div>); }

function AdminPricingPage() { return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h1 style={{ fontFamily: DF, fontSize: 28, color: "#111827", margin: 0, fontWeight: 600 }}>Pricing</h1><button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><Plus size={16} /> Add Tier</button></div>{MEMBERSHIP_TIERS.map(tier => (<div key={tier.id} style={{ background: "#fff", border: `1px solid ${tier.popular ? T.accent : "#e5e7eb"}`, borderRadius: 12, padding: 18 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><h3 style={{ color: "#111827", fontWeight: 700, fontSize: 15, margin: 0 }}>{tier.name}</h3><p style={{ color: T.accent, fontSize: 22, fontFamily: DF, fontWeight: 700, margin: "4px 0 0" }}>${tier.price} <span style={{ fontSize: 13, color: "#6b7280", fontFamily: "'DM Sans'" }}>{tier.period}</span></p></div><div style={{ display: "flex", gap: 4 }}><button style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#374151", cursor: "pointer" }}><Edit3 size={14} /></button><button style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#6b7280", cursor: "pointer" }}><Trash2 size={14} /></button></div></div></div>))}</div>); }

function AdminCommsPage() { const [msg, setMsg] = useState(""); const [sent, setSent] = useState(false); return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}><h1 style={{ fontFamily: DF, fontSize: 28, color: "#111827", margin: 0, fontWeight: 600 }}>Broadcast</h1><AC title="New Announcement"><textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type a broadcast for all members..." rows={4} style={{ width: "100%", padding: 12, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827", fontSize: 13, fontFamily: "'DM Sans'", resize: "none", outline: "none", boxSizing: "border-box", marginBottom: 12 }} /><button onClick={() => { setSent(true); setTimeout(() => { setSent(false); setMsg(""); }, 2000); }} disabled={!msg.trim()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "none", background: msg.trim() ? T.accent : "#e5e7eb", color: msg.trim() ? "#fff" : "#6b7280", fontWeight: 600, fontSize: 13, cursor: msg.trim() ? "pointer" : "default" }}>{sent ? <><Check size={14} /> Sent!</> : <><Send size={14} /> Broadcast to All</>}</button></AC><AC title="Recent Broadcasts">{ANNOUNCEMENTS.map(a => <div key={a.id} style={{ padding: "12px 0", borderBottom: "1px solid #e5e7eb" }}><p style={{ color: "#111827", fontWeight: 600, fontSize: 14, margin: 0 }}>{a.title}</p><p style={{ color: "#6b7280", fontSize: 12, margin: "4px 0 0" }}>{a.message}</p></div>)}</AC></div>); }

function AdminSettingsPage() { return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}><h1 style={{ fontFamily: DF, fontSize: 28, color: "#111827", margin: 0, fontWeight: 600 }}>Settings</h1><AC title="Studio Information"><div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 8, background: "#f9fafb" }}><MapPin size={18} color={T.accent} /><div><p style={{ color: "#111827", fontWeight: 600, fontSize: 14, margin: 0 }}>{SC.address.street}</p><p style={{ color: "#6b7280", fontSize: 12, margin: "2px 0 0" }}>{SC.address.city}, {SC.address.state} {SC.address.zip}</p></div><button style={{ marginLeft: "auto", padding: "4px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#374151", fontSize: 12, cursor: "pointer" }}><Edit3 size={14} /></button></div></AC><AC title="Integrations">{["Booking System (Momence)", "Payment Processor", "Email Marketing", "Analytics"].map((item, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid #e5e7eb" : "none" }}><span style={{ color: "#374151", fontSize: 13 }}>{item}</span><span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: `${T.accent}20`, color: T.accent }}>Connected</span></div>)}</AC></div>); }

// ===================================================================
//  MAIN APP
// ===================================================================
export default function App({ startInAdmin, onExitAdmin, onEnterAdmin }) {
  const [page, setPage] = useState(startInAdmin ? "admin-dashboard" : "home");
  const [showMore, setShowMore] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [classReg, setClassReg] = useState({});
  const [resClass, setResClass] = useState(null);
  const [feedCel, setFeedCel] = useState({});
  const contentRef = useRef(null);

  useEffect(() => { if (contentRef.current) contentRef.current.scrollTo(0, 0); }, [page]);

  const regClass = useCallback((id) => setClassReg(p => ({ ...p, [id]: true })), []);
  const openRes = useCallback((d) => setResClass(d), []);
  const celFeed = useCallback((id) => setFeedCel(p => ({ ...p, [id]: (p[id] || 0) + 1 })), []);

  const mainTabs = [{ id: "home", label: "Home", icon: Home }, { id: "schedule", label: "Schedule", icon: CalendarDays }, { id: "practice", label: "Practice", icon: TrendingUp }, { id: "more", label: "More", icon: Menu }];
  const moreItems = [{ id: "classes", label: "Classes", icon: Calendar }, { id: "teachers", label: "Teachers", icon: Users }, { id: "membership", label: "Pricing", icon: CreditCard }, { id: "events", label: "Events", icon: PartyPopper }, { id: "community", label: "Community", icon: Heart }, { id: "rewards", label: "Heart Points", icon: Gift }];
  const adminTabs = [{ id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard }, { id: "admin-members", label: "Members", icon: Users }, { id: "admin-schedule", label: "Schedule", icon: CalendarDays }, { id: "admin-teachers", label: "Teachers", icon: UserCheck }, { id: "admin-events", label: "Events", icon: PartyPopper }, { id: "admin-pricing", label: "Pricing", icon: CreditCard }, { id: "admin-comms", label: "Broadcast", icon: Megaphone }, { id: "admin-settings", label: "Settings", icon: Settings }];
  const isMoreActive = moreItems.some(item => item.id === page);

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "classes": return <ClassesPage />;
      case "schedule": return <SchedulePage />;
      case "practice": return <PracticePage />;
      case "community": return <CommunityPage />;
      case "teachers": return <TeachersPage />;
      case "membership": return <MembershipPage />;
      case "events": return <EventsPage />;
      case "rewards": return (<div><PageHero title="Heart Points" subtitle="Earn points, share the love" gradient={`linear-gradient(135deg, hsl(348,40%,24%), hsl(155,18%,16%))`} /><div style={{ padding: "20px 16px 0" }}><div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(340,15%,18%))`, borderRadius: 16, padding: "24px 20px", color: "#fff", marginBottom: 16 }}><p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent, margin: "0 0 8px" }}>Your Hearts</p><div style={{ fontFamily: DF, fontSize: 48, fontWeight: 700 }}>820</div><p style={{ fontSize: 13, color: "#b8a0a8", margin: "4px 0 0" }}>30 points to next reward</p></div><div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{[{ pts: 500, reward: "Free Guest Pass", icon: UserPlus }, { pts: 850, reward: "10% Off Workshop", icon: Award }, { pts: 1200, reward: "Free Private Session Upgrade", icon: Gift }, { pts: 2000, reward: "Community Care Donation", icon: Heart }].map((r, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}><div style={{ width: 40, height: 40, borderRadius: 10, background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center" }}><r.icon size={20} color={T.accent} /></div><div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: 14, margin: 0, color: T.text }}>{r.reward}</p><p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{r.pts} points</p></div><button style={{ padding: "6px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700, cursor: r.pts <= 820 ? "pointer" : "default", background: r.pts <= 820 ? T.accent : T.bgDim, color: r.pts <= 820 ? "#fff" : T.textFaint }}>{r.pts <= 820 ? "Redeem" : "Locked"}</button></div>))}</div></div></div>);
      case "admin-dashboard": return <AdminDashboard />;
      case "admin-members": return <AdminMembersPage />;
      case "admin-schedule": return <AdminSchedulePage />;
      case "admin-teachers": return <AdminTeachersPage />;
      case "admin-events": return <AdminEventsPage />;
      case "admin-pricing": return <AdminPricingPage />;
      case "admin-comms": return <AdminCommsPage />;
      case "admin-settings": return <AdminSettingsPage />;
      default: return <HomePage />;
    }
  };

  // FULL-SCREEN ADMIN MODE (called from DemoWrapper)
  if (startInAdmin) {
    return (<AppContext.Provider value={{ page, setPage, classRegistrations: classReg, registerForClass: regClass, openReservation: openRes, feedCelebrations: feedCel, celebrateFeed: celFeed }}>
      <div style={{ display: "flex", width: "100vw", height: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f8f9fa", color: "#111827" }}>
        <aside style={{ width: 240, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <div style={{ padding: "16px 14px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 36, height: 36, borderRadius: 8, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DF, fontSize: 16, color: "#fff", fontWeight: 700 }}>{SC.logoMark}</div><div><span style={{ fontFamily: DF, fontSize: 14, color: "#111827", display: "block", lineHeight: 1 }}>{SC.name}</span><span style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.15em" }}>Admin</span></div></div>
          <nav style={{ flex: 1, padding: "12px 8px", overflow: "auto" }}><p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af", padding: "0 10px", margin: "0 0 8px" }}>Management</p>{adminTabs.map(tab => { const active = page === tab.id; return <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: active ? T.accent : "transparent", color: active ? "#fff" : "#6b7280", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", marginBottom: 2, textAlign: "left" }}><tab.icon size={18} /><span>{tab.label}</span>{active && <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.6 }} />}</button>; })}</nav>
          <div style={{ borderTop: "1px solid #e5e7eb", padding: "10px 8px" }}><button onClick={() => { if (onExitAdmin) onExitAdmin(); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", color: "#6b7280", fontSize: 13, cursor: "pointer", textAlign: "left" }}><LogOut size={18} /><span>Exit Admin</span></button></div>
          <style>{`aside::-webkit-scrollbar { display: none; }`}</style>
        </aside>
        <main style={{ flex: 1, marginLeft: 240, padding: 24, overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>{renderPage()}<style>{`main::-webkit-scrollbar { display: none; }`}</style></main>
      </div>
    </AppContext.Provider>);
  }

  // CONSUMER MODE (inside phone mockup)
  return (<AppContext.Provider value={{ page, setPage, classRegistrations: classReg, registerForClass: regClass, openReservation: openRes, feedCelebrations: feedCel, celebrateFeed: celFeed }}>
    <div style={{ width: "100%", height: "100%", background: T.bgDim, fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative", overflow: "hidden" }}>
      <header style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 30, background: T.bg, color: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DF, fontSize: 18, color: "#fff", fontWeight: 700 }}>{SC.logoMark}</div>
          <div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontFamily: DF, fontSize: 18, lineHeight: 1, letterSpacing: "0.01em" }}>{SC.name}</span><span style={{ fontSize: 9, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.15em" }}>{SC.subtitle}</span></div>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <button onClick={() => { if (onEnterAdmin) onEnterAdmin(); }} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: T.accent }}><Shield size={20} /></button>
          <button onClick={() => setShowNotifications(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff", position: "relative" }}><Bell size={20} /><span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: T.accent, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>2</span></button>
          <button onClick={() => setShowSettings(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff" }}><Settings size={20} /></button>
        </div>
      </header>
      <div ref={contentRef} style={{ position: "absolute", top: 58, left: 0, right: 0, bottom: 60, overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {renderPage()}
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
      </div>
      {showMore && (<div onClick={() => setShowMore(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 40 }}><div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 68, left: 16, right: 16, maxWidth: 358, margin: "0 auto", background: T.bgCard, borderRadius: 16, padding: "14px 12px", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 8px" }}><span style={{ fontFamily: DF, fontSize: 20, fontWeight: 600 }}>More</span><button onClick={() => setShowMore(false)} style={{ padding: 4, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}><X size={18} color={T.textMuted} /></button></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{moreItems.map(item => { const active = page === item.id; return <button key={item.id} onClick={() => { setPage(item.id); setShowMore(false); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", borderRadius: 10, border: "none", cursor: "pointer", background: active ? T.accentGhost : T.bgDim, color: active ? T.accent : T.textMuted }}><item.icon size={22} /><span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span></button>; })}</div></div></div>)}
      <nav style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "white", borderTop: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 50 }}>
        {mainTabs.map(tab => { const active = tab.id === "more" ? (isMoreActive || showMore) : page === tab.id; return <button key={tab.id} onClick={tab.id === "more" ? () => setShowMore(true) : () => setPage(tab.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}><tab.icon size={20} strokeWidth={active ? 2.5 : 2} /><span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span></button>; })}
      </nav>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
      {resClass && <ReservationModal classData={resClass} onConfirm={regClass} onClose={() => setResClass(null)} />}
    </div>
  </AppContext.Provider>);
}
