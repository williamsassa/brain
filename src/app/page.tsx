'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  Brain, Shield, Mic, FileText, Zap, BookOpen,
  ChevronRight, Sparkles, Activity, Dna, Heart, Eye,
  Stethoscope, ArrowRight, ChevronDown, Cpu, Network,
  ScanLine, Layers, Database, Lock, TrendingUp
} from 'lucide-react';

// ─── NEURAL MESH CANVAS ────────────────────────────────────────
function NeuralMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let t = 0;

    interface Node {
      x: number; y: number; vx: number; vy: number;
      ox: number; oy: number; pulse: number; pulseSpeed: number;
      layer: number;
    }
    let nodes: Node[] = [];
    const W = () => canvas.width;
    const H = () => canvas.height;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      buildNodes();
    };

    const buildNodes = () => {
      nodes = [];
      const count = Math.min(Math.floor((W() * H()) / 9000), 90);
      for (let i = 0; i < count; i++) {
        const x = Math.random() * W();
        const y = Math.random() * H();
        nodes.push({
          x, y, ox: x, oy: y,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.008 + Math.random() * 0.015,
          layer: Math.floor(Math.random() * 3),
        });
      }
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, W(), H());
      t++;

      // Deep radial ambient
      const cx = W() * 0.38, cy = H() * 0.42;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, W() * 0.72);
      grd.addColorStop(0, 'rgba(0,180,255,0.055)');
      grd.addColorStop(0.4, 'rgba(83,82,237,0.03)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W(), H());

      // Secondary glow
      const grd2 = ctx.createRadialGradient(W()*0.82, H()*0.75, 0, W()*0.82, H()*0.75, W()*0.45);
      grd2.addColorStop(0, 'rgba(0,229,160,0.04)');
      grd2.addColorStop(1, 'transparent');
      ctx.fillStyle = grd2;
      ctx.fillRect(0, 0, W(), H());

      // Mouse-reactive glow
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      const grd3 = ctx.createRadialGradient(mx, my, 0, mx, my, 280);
      grd3.addColorStop(0, 'rgba(0,212,255,0.06)');
      grd3.addColorStop(1, 'transparent');
      ctx.fillStyle = grd3;
      ctx.fillRect(0, 0, W(), H());

      // ECG lines
      for (let k = 0; k < 2; k++) {
        const yBase = k === 0 ? H() * 0.52 : H() * 0.32;
        const speed = k === 0 ? 0.00055 : 0.0004;
        const alpha = k === 0 ? 0.1 : 0.055;
        ctx.beginPath();
        ctx.strokeStyle = k === 0 ? `rgba(0,212,255,${alpha})` : `rgba(0,229,160,${alpha})`;
        ctx.lineWidth = k === 0 ? 1.2 : 0.8;
        for (let x = 0; x < W(); x += 2) {
          const ph = (x * 0.007 + t * speed) % (Math.PI * 2);
          let y = yBase;
          if (ph > 2.5 && ph < 2.62) y -= 45 * (k === 0 ? 1 : 0.6);
          else if (ph > 2.62 && ph < 2.78) y += 70 * (k === 0 ? 1 : 0.6);
          else if (ph > 2.78 && ph < 2.94) y -= 30 * (k === 0 ? 1 : 0.6);
          else y += Math.sin(ph * 4) * 2.5;
          if (x === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
        }
        ctx.stroke();
      }

      // Neural connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const maxD = a.layer === b.layer ? 160 : 110;
          if (d < maxD) {
            const frac = 1 - d / maxD;
            const pulse = (Math.sin(a.pulse) + Math.sin(b.pulse)) * 0.5;
            const al = frac * 0.09 * (0.7 + pulse * 0.3);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,212,255,${al})`;
            ctx.lineWidth = frac * 0.9;
            ctx.stroke();

            // Data packet animation
            if (Math.random() < 0.001) {
              const pFrac = (t % 120) / 120;
              const px = a.x + (b.x - a.x) * pFrac;
              const py = a.y + (b.y - a.y) * pFrac;
              ctx.beginPath();
              ctx.arc(px, py, 1.8, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(0,212,255,0.8)';
              ctx.fill();
            }
          }
        }
      }

      // Nodes
      nodes.forEach(n => {
        n.pulse += n.pulseSpeed;
        const dx = mouseRef.current.x - n.x;
        const dy = mouseRef.current.y - n.y;
        const md = Math.sqrt(dx * dx + dy * dy);
        if (md < 180) {
          n.x -= (dx / md) * 1.2;
          n.y -= (dy / md) * 1.2;
        } else {
          n.x += (n.ox - n.x) * 0.006 + n.vx;
          n.y += (n.oy - n.y) * 0.006 + n.vy;
        }
        if (n.x < 0 || n.x > W()) n.vx *= -1;
        if (n.y < 0 || n.y > H()) n.vy *= -1;

        const glow = 0.3 + Math.sin(n.pulse) * 0.25;
        const r = 2.5 + Math.sin(n.pulse) * 1;
        const colors = ['0,212,255', '0,229,160', '83,82,237'];
        const col = colors[n.layer];
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},${glow})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${col},${glow * 0.18})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      });

      // Scan line
      const scanY = ((t * 0.35) % (H() + 80)) - 40;
      const scanGrd = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      scanGrd.addColorStop(0, 'transparent');
      scanGrd.addColorStop(0.5, 'rgba(0,212,255,0.04)');
      scanGrd.addColorStop(1, 'transparent');
      ctx.fillStyle = scanGrd;
      ctx.fillRect(0, scanY - 30, W(), 60);

      raf = requestAnimationFrame(drawFrame);
    };

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('touchmove', onTouch);
    raf = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}

// ─── HOLOGRAPHIC AI PREVIEW CARD ──────────────────────────────
function HoloPreview() {
  const [tick, setTick] = useState(0);
  const [streamText, setStreamText] = useState('');
  const fullText = 'Primary: Hypertensive Crisis → LV Dysfunction\nICD-10: I10 | Confidence: 94%\nSource: ESC Guidelines 2023 ↗';
  const streamRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    streamRef.current = 0;
    setStreamText('');
    const id = setInterval(() => {
      streamRef.current++;
      setStreamText(fullText.slice(0, streamRef.current * 3));
      if (streamRef.current * 3 >= fullText.length) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const vitals = [
    { label: 'BP', value: '178/112', unit: 'mmHg', status: 'danger' },
    { label: 'HR', value: '94', unit: 'bpm', status: 'warn' },
    { label: 'SpO₂', value: '97', unit: '%', status: 'ok' },
    { label: 'T°', value: '37.2', unit: '°C', status: 'ok' },
  ];

  const statusColor: Record<string, string> = {
    danger: '#FF4757', warn: '#FFB347', ok: '#00E5A0',
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute inset-0 rounded-3xl blur-2xl opacity-20 bg-gradient-to-br from-[#00D4FF] to-[#5352ED]" />

      <div className="relative rounded-3xl border border-white/10 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,rgba(10,22,40,0.97) 0%,rgba(15,27,45,0.97) 100%)' }}>

        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06]">
          <div className="w-2 h-2 rounded-full bg-[#FF4757] opacity-80" />
          <div className="w-2 h-2 rounded-full bg-[#FFB347] opacity-80" />
          <div className="w-2 h-2 rounded-full bg-[#00E5A0] opacity-80" />
          <span className="ml-2 text-[10px] text-white/20 font-mono tracking-widest uppercase">HELIX-FT Interface</span>
          <div className="ml-auto flex items-center gap-1.5">
            <motion.div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]"
              animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
            <span className="text-[9px] text-[#00D4FF]/60 font-mono">LIVE</span>
          </div>
        </div>

        <div className="flex gap-0">
          <div className="w-[45%] border-r border-white/[0.06] p-4 space-y-3">
            <p className="text-[9px] text-white/20 font-mono uppercase tracking-widest">Patient Info</p>
            {[
              { label: 'Name', value: 'Ahmed B.' },
              { label: 'Age', value: '58 y/o' },
              { label: 'Blood', value: 'A+' },
              { label: 'Specialty', value: 'Cardiology' },
            ].map((row, i) => (
              <motion.div key={i} className="space-y-0.5"
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}>
                <p className="text-[8px] text-white/20 font-mono">{row.label}</p>
                <p className="text-[11px] text-white/70 font-medium">{row.value}</p>
              </motion.div>
            ))}

            <div className="pt-2 border-t border-white/[0.06]">
              <p className="text-[9px] text-white/20 font-mono uppercase mb-2">Vitals</p>
              <div className="space-y-1.5">
                {vitals.map((v, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[9px] text-white/30">{v.label}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono" style={{ color: statusColor[v.status] }}>{v.value}</span>
                      <span className="text-[8px] text-white/20">{v.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <MiniECG />
          </div>

          <div className="flex-1 p-4 flex flex-col gap-3">
            <p className="text-[9px] text-white/20 font-mono uppercase tracking-widest">AI Analysis</p>

            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-4 h-4 rounded-md bg-gradient-to-br from-[#00D4FF] to-[#0070A8] flex items-center justify-center">
                  <span className="text-[7px] font-bold text-white">B</span>
                </div>
                <span className="text-[9px] text-[#00D4FF]/60 font-mono">HELIX-FT</span>
                <motion.div className="ml-auto"
                  animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                  <div className="w-1 h-1 rounded-full bg-[#00D4FF]" />
                </motion.div>
              </div>
              <p className="text-[10px] text-white/50 font-mono whitespace-pre-line leading-relaxed min-h-[48px]">
                {streamText}
                <motion.span className="inline-block w-0.5 h-2.5 bg-[#00D4FF] ml-0.5 align-middle"
                  animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} />
              </p>
            </div>

            <motion.div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06]"
              animate={{ borderColor: ['rgba(255,255,255,0.06)', 'rgba(0,212,255,0.15)', 'rgba(255,255,255,0.06)'] }}
              transition={{ duration: 2.5, repeat: Infinity }}>
              <BookOpen size={9} className="text-[#00D4FF]/50" />
              <span className="text-[9px] text-white/30">pubmed.ncbi.nlm.nih.gov</span>
              <span className="ml-auto text-[8px] text-[#00E5A0]/50">verified</span>
            </motion.div>

            <div className="flex flex-wrap gap-1.5 mt-auto">
              {['SOAP Report', 'Drug Check', 'Risk Score'].map((label, i) => (
                <motion.div key={i}
                  className="px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[9px] text-white/30 cursor-default"
                  whileHover={{ borderColor: 'rgba(0,212,255,0.2)', color: 'rgba(255,255,255,0.6)' }}>
                  {label}
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <Mic size={11} className="text-white/20" />
              <span className="text-[10px] text-white/15 flex-1">Ask anything...</span>
              <motion.div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#0070A8] flex items-center justify-center"
                animate={{ boxShadow: ['0 0 0px #00D4FF30', '0 0 12px #00D4FF40', '0 0 0px #00D4FF30'] }}
                transition={{ duration: 2, repeat: Infinity }}>
                <ArrowRight size={9} className="text-white" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniECG() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number, t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = '#00D4FF';
      ctx.lineWidth = 1.2;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#00D4FF';
      const h = canvas.height / 2;
      for (let x = 0; x < canvas.width; x++) {
        const ph = ((x / canvas.width) * 4 + t * 0.025) % (Math.PI * 2);
        let y = h;
        if (ph > 2.5 && ph < 2.62) y -= 18;
        else if (ph > 2.62 && ph < 2.78) y += 26;
        else if (ph > 2.78 && ph < 2.94) y -= 12;
        else y += Math.sin(ph * 5) * 1.5;
        if (x === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
      }
      ctx.stroke();
      t++;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} width={160} height={36} className="w-full rounded-lg opacity-70" />;
}

// ─── LIVE DATA STREAM TICKER ───────────────────────────────────
function DataTicker() {
  const items = [
    'Cardiology · BP Analysis · Confidence 94%',
    'Oncology · Tumor Marker CEA · Cross-ref PubMed',
    'Neurology · EEG Pattern · DoWhy Causal Graph',
    'Endocrinology · HbA1c · ESC Guidelines 2023',
    'Ophthalmology · IOP · Cochrane Review',
    'Respiratory · FEV1/FVC · WHO Protocol',
    'Psychiatry · PHQ-9 Score · DSM-5 Reference',
  ];

  return (
    <div className="relative overflow-hidden h-8 flex items-center border-y border-white/[0.04]">
      <div className="absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-[#060d19] to-transparent" />
      <div className="absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-[#060d19] to-transparent" />
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-[10px] text-white/20 font-mono tracking-wide">
            <span className="text-[#00D4FF]/40 mr-1.5">›</span>{item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── ANIMATED STAT COUNTER ────────────────────────────────────
function StatCounter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const inView = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !inView.current) {
        inView.current = true;
        let start = 0;
        const step = value / 60;
        const id = setInterval(() => {
          start += step;
          if (start >= value) { setCount(value); clearInterval(id); }
          else setCount(Math.floor(start));
        }, 20);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-white/90 tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs text-white/25 mt-1">{label}</div>
    </div>
  );
}

// ─── FLOATING ORBIT ICONS ────────────────────────────────────
function OrbitIcons() {
  const orbits = [
    { r: 160, icons: [Heart, Brain, Eye, Stethoscope], speed: 22, color: '#00D4FF' },
    { r: 240, icons: [Dna, Activity, Cpu, Network], speed: -35, color: '#00E5A0' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {orbits.map((orbit, oi) => (
        orbit.icons.map((Icon, ii) => {
          const angle = (ii / orbit.icons.length) * 360;
          return (
            <motion.div
              key={`${oi}-${ii}`}
              className="absolute top-1/2 left-1/2"
              style={{ width: orbit.r * 2, height: orbit.r * 2, marginLeft: -orbit.r, marginTop: -orbit.r }}
              animate={{ rotate: orbit.speed < 0 ? -360 : 360 }}
              transition={{ duration: Math.abs(orbit.speed), repeat: Infinity, ease: 'linear' }}
            >
              <motion.div
                className="absolute"
                style={{
                  left: '50%',
                  top: 0,
                  transformOrigin: `0px ${orbit.r}px`,
                  rotate: angle,
                  marginLeft: -12,
                }}
                animate={{ rotate: orbit.speed < 0 ? -360 : 360 }}
                transition={{ duration: Math.abs(orbit.speed), repeat: Infinity, ease: 'linear' }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center border"
                  style={{ background: `${orbit.color}10`, borderColor: `${orbit.color}20` }}>
                  <Icon size={14} strokeWidth={1.3} style={{ color: orbit.color, opacity: 0.5 }} />
                </div>
              </motion.div>
            </motion.div>
          );
        })
      ))}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function Home() {
  const [showGate, setShowGate] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -60]);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 80, damping: 20 });
  const springY = useSpring(cursorY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [cursorX, cursorY]);

  const handleAccessDenied = () => {
    alert('BRAIN HEALTH is exclusively available to licensed healthcare professionals.');
    setShowGate(false);
  };

  const features = [
    { icon: Brain, title: 'Causal Inference', desc: 'DoWhy-powered causal pathway identification between symptoms and diagnoses', color: '#00D4FF', tag: 'Core AI' },
    { icon: BookOpen, title: 'Scientific Sources', desc: 'Real-time PubMed, WHO, Cochrane references with direct DOI links', color: '#00E5A0', tag: 'Evidence' },
    { icon: Mic, title: 'Voice Input', desc: 'Whisper-powered multilingual FR/EN medical transcription', color: '#5352ED', tag: 'Input' },
    { icon: FileText, title: 'SOAP Reports', desc: 'Structured PDF reports with ICD-10/11 codes and differential diagnoses', color: '#FFB347', tag: 'Output' },
    { icon: Shield, title: 'Secure & Compliant', desc: 'Secure login with encrypted data.', color: '#FF4757', tag: 'Security' },
    { icon: Zap, title: 'Real-time Streaming', desc: 'Live AI inferences as you fill each field of the patient form', color: '#00A8CC', tag: 'Speed' },
    { icon: Layers, title: '10 Specialties', desc: 'Adaptive forms per specialty — Cardiology, Oncology, Psychiatry and more', color: '#E879F9', tag: 'Adaptive' },
    { icon: Database, title: 'Medical Database', desc: 'Connected to validated institutional medical knowledge sources only', color: '#34D399', tag: 'Data' },
    { icon: TrendingUp, title: 'Confidence Scoring', desc: 'GRADE-system evidence levels A/B/C with calibrated confidence %', color: '#F59E0B', tag: 'Quality' },
  ];

  const specialties = [
    { name: 'Cardiology', emoji: '🫀', color: '#FF4757' },
    { name: 'Ophthalmology', emoji: '👁️', color: '#00D4FF' },
    { name: 'Dermatology', emoji: '🧴', color: '#F59E0B' },
    { name: 'Dentistry', emoji: '🦷', color: '#E5E7EB' },
    { name: 'Pediatrics', emoji: '👶', color: '#00E5A0' },
    { name: 'Psychiatry', emoji: '🧠', color: '#5352ED' },
    { name: 'Anesthesiology', emoji: '💉', color: '#00A8CC' },
    { name: 'Endocrinology', emoji: '⚗️', color: '#E879F9' },
    { name: 'Oncology', emoji: '🧬', color: '#34D399' },
    { name: 'Respiratory', emoji: '🫁', color: '#FFB347' },
  ];

  const steps = [
    { num: '01', title: 'Authenticate', desc: 'Sign in with your institutional Google account', icon: Lock, color: '#5352ED' },
    { num: '02', title: 'Select Specialty', desc: 'Choose from 10 medical specialties — your form adapts automatically', icon: Layers, color: '#00D4FF' },
    { num: '03', title: 'Fill & Diagnose', desc: 'Enter patient data — HELIX-FT infers diagnostics in real time', icon: Brain, color: '#00E5A0' },
    { num: '04', title: 'Export SOAP PDF', desc: 'Generate a structured, branded medical report instantly', icon: FileText, color: '#FFB347' },
  ];

  return (
    <div className="min-h-screen bg-[#060d19] text-white overflow-x-hidden selection:bg-[#00D4FF]/20 selection:text-white">

      {/* Custom cursor glow */}
      <motion.div className="fixed w-64 h-64 rounded-full pointer-events-none z-0"
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%',
          background: 'radial-gradient(circle,rgba(0,212,255,0.04) 0%,transparent 70%)' }} />

      <NeuralMeshBackground />

      {/* ─── HEADER ─── */}
      <motion.header className="fixed top-0 w-full z-50"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
        <div className="mx-4 mt-4 rounded-2xl backdrop-blur-xl border border-white/[0.07] px-5 py-3 flex items-center justify-between"
          style={{ background: 'rgba(6,13,25,0.85)' }}>
          <div className="flex items-center gap-2.5">
            <motion.div className="w-8 h-8 rounded-xl overflow-hidden shadow-lg shadow-[#00D4FF]/15"
              whileHover={{ scale: 1.08, rotate: 3 }}>
              <Image src="/logo.png" alt="BRAIN HEALTH" width={32} height={32} className="w-full h-full object-cover" />
            </motion.div>
            <div>
              <p className="text-[12px] font-bold tracking-tight text-white/90 leading-none">BRAIN HEALTH</p>
              <p className="text-[8px] text-white/20 tracking-[0.25em] uppercase mt-0.5">Operation HELIX-FT</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {['Features', 'How It Works', 'Specialties'].map(item => (
              <motion.a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                className="text-[11px] text-white/30 hover:text-white/70 transition-colors font-medium tracking-wide"
                whileHover={{ y: -1 }}>
                {item}
              </motion.a>
            ))}
          </nav>

          <motion.button onClick={() => setShowGate(true)}
            className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#0060AA] text-white font-semibold shadow-lg shadow-[#00D4FF]/15"
            whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(0,212,255,0.25)' }}
            whileTap={{ scale: 0.96 }}>
            Get Started <ArrowRight size={12} />
          </motion.button>
        </div>
      </motion.header>

      {/* ─── HERO ─── */}
      <motion.section className="relative min-h-screen flex items-center justify-center px-6 pt-28 pb-16"
        style={{ opacity: heroOpacity, y: heroY }}>
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <div className="z-10">
            <motion.div className="inline-flex items-center gap-2 mb-7 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02]"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <motion.div className="w-1.5 h-1.5 rounded-full bg-[#00E5A0]"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">AI Medical Platform · MVP v2.0</span>
            </motion.div>

            <motion.h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.02] tracking-tight mb-6"
              initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}>
              <span className="text-white/90">Medical</span>
              <br />
              <span className="text-white/90">Intelligence.</span>
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#00D4FF] via-[#00E5A0] to-[#5352ED] bg-clip-text text-transparent">
                  Reimagined.
                </span>
                <motion.span className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-[#00D4FF] to-[#5352ED] rounded-full"
                  initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.2, delay: 1 }} />
              </span>
            </motion.h1>

            <motion.p className="text-base md:text-lg text-white/30 mb-10 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
              AI-powered diagnostic assistant with real-time causal inference, peer-reviewed medical sources, and structured SOAP reporting. Built for licensed healthcare professionals.
            </motion.p>

            <motion.div className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}>
              <motion.button onClick={() => setShowGate(true)}
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#00D4FF] to-[#0060AA] text-white font-bold text-sm shadow-2xl shadow-[#00D4FF]/15"
                whileHover={{ scale: 1.03, y: -2, boxShadow: '0 20px 50px rgba(0,212,255,0.22)' }}
                whileTap={{ scale: 0.97 }}>
                Start Diagnosing
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/15 text-sm font-medium transition-all"
                whileHover={{ y: -1 }}>
                <ScanLine size={15} />
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Stats row */}
            <motion.div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/[0.05]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <StatCounter value={10} label="Specialties" suffix="+" />
              <StatCounter value={94} label="Avg Confidence" suffix="%" />
              <StatCounter value={4} label="Languages (soon)" suffix="+" />
            </motion.div>
          </div>

          {/* Right — holo preview */}
          <motion.div className="z-10 relative"
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            <OrbitIcons />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
              <HoloPreview />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 6, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
          <span className="text-[9px] text-white/15 font-mono tracking-widest uppercase">Scroll</span>
          <ChevronDown size={14} className="text-white/10" />
        </motion.div>
      </motion.section>

      {/* ─── TICKER ─── */}
      <DataTicker />

      {/* ─── FEATURES ─── */}
      <section id="features" className="relative py-32 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] text-[#00D4FF]/50 font-mono tracking-[0.3em] uppercase mb-3">Capabilities</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white/90">
              Everything you need.<br />
              <span className="text-[#00D4FF]">Nothing you don&apos;t.</span>
            </h2>
            <p className="text-white/25 max-w-lg mx-auto text-base">
              Purpose-built for medical professionals who demand evidence-based AI with zero hallucination tolerance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((f, i) => (
              <motion.div key={i}
                className="group relative p-6 rounded-2xl border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300 overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.015)' }}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -5, boxShadow: `0 24px 48px ${f.color}0E` }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 0% 0%, ${f.color}08 0%, transparent 60%)` }} />

                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${f.color}12`, border: `1px solid ${f.color}20` }}>
                    <f.icon size={18} strokeWidth={1.5} style={{ color: f.color }} />
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border"
                    style={{ color: f.color, borderColor: `${f.color}25`, background: `${f.color}08` }}>
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-bold text-sm mb-1.5 text-white/75 group-hover:text-white/90 transition-colors">{f.title}</h3>
                <p className="text-xs text-white/25 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="relative py-32 px-6 z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] text-[#00E5A0]/50 font-mono tracking-[0.3em] uppercase mb-3">Process</p>
            <h2 className="text-4xl md:text-5xl font-black text-white/90">
              From login to<br /><span className="text-[#00E5A0]">diagnosis in minutes.</span>
            </h2>
          </motion.div>

          <div className="relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <motion.div key={i} className="relative text-center"
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                  <motion.div className="w-20 h-20 mx-auto mb-5 rounded-2xl border flex flex-col items-center justify-center gap-1.5"
                    style={{ background: `${step.color}08`, borderColor: `${step.color}20` }}
                    whileHover={{ scale: 1.06, borderColor: `${step.color}40`, boxShadow: `0 0 30px ${step.color}12` }}>
                    <step.icon size={22} strokeWidth={1.3} style={{ color: step.color }} />
                  </motion.div>
                  <p className="text-[9px] font-mono tracking-widest mb-1.5" style={{ color: step.color + '60' }}>{step.num}</p>
                  <h3 className="font-bold text-sm text-white/80 mb-1">{step.title}</h3>
                  <p className="text-xs text-white/25 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SPECIALTIES ─── */}
      <section id="specialties" className="relative py-32 px-6 z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] text-[#E879F9]/50 font-mono tracking-[0.3em] uppercase mb-3">Adaptive Forms</p>
            <h2 className="text-4xl md:text-5xl font-black text-white/90">
              10 Medical<br /><span className="text-[#E879F9]">Specialties.</span>
            </h2>
            <p className="text-white/25 mt-4 text-base max-w-md mx-auto">
              Each specialty has a fully customized patient form and AI prompt. The interface adapts to your practice.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {specialties.map((s, i) => (
              <motion.div key={i}
                className="group p-5 rounded-2xl border border-white/[0.05] text-center cursor-default transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.015)' }}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6, borderColor: `${s.color}30`, boxShadow: `0 16px 32px ${s.color}0C` }}>
                <span className="text-3xl">{s.emoji}</span>
                <p className="text-[10px] font-semibold mt-2 text-white/30 group-hover:text-white/60 transition-colors">{s.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-32 px-6 z-10">
        <motion.div className="max-w-4xl mx-auto text-center relative overflow-hidden rounded-3xl p-16 border border-white/[0.06]"
          style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.04) 0%,rgba(83,82,237,0.04) 100%)' }}
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>

          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-[#00D4FF]/30 to-transparent" />
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" />
          </div>

          <motion.div className="w-14 h-14 mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl shadow-[#00D4FF]/20"
            animate={{ boxShadow: ['0 0 20px rgba(0,212,255,0.15)', '0 0 50px rgba(0,212,255,0.25)', '0 0 20px rgba(0,212,255,0.15)'] }}
            transition={{ duration: 3, repeat: Infinity }}>
            <Image src="/logo.png" alt="BRAIN HEALTH" width={56} height={56} className="w-full h-full object-cover" />
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-black text-white/90 mb-4">
            Ready to elevate<br />your diagnostics?
          </h2>
          <p className="text-white/25 mb-10 text-base max-w-md mx-auto">
            Join the vanguard of AI-assisted medicine. Exclusively for licensed healthcare professionals.
          </p>
          <motion.button onClick={() => setShowGate(true)}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00D4FF] to-[#0060AA] text-white font-bold shadow-2xl shadow-[#00D4FF]/20"
            whileHover={{ scale: 1.04, boxShadow: '0 20px 60px rgba(0,212,255,0.28)' }}
            whileTap={{ scale: 0.96 }}>
            Access BRAIN HEALTH <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 border-t border-white/[0.05] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl overflow-hidden">
              <Image src="/logo.png" alt="BRAIN HEALTH" width={28} height={28} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white/50">BRAIN HEALTH</p>
              <p className="text-[8px] text-white/15 font-mono">Operation HELIX-FT</p>
            </div>
          </div>
          <p className="text-[10px] text-white/15">
            &copy; 2026 BRAIN HEALTH &middot; Maroc &rarr; EU &middot; Afrique francophone &middot; v2.0
          </p>
          <p className="text-[10px] text-white/10 font-mono">For licensed healthcare professionals only</p>
        </div>
      </footer>

      {/* ─── PROFESSIONAL GATE MODAL ─── */}
      <Modal isOpen={showGate} onClose={() => setShowGate(false)} title="Professional Verification">
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <p className="text-sm text-white/50 leading-relaxed">
              Are you a <span className="text-white/80 font-semibold">licensed healthcare professional</span> or medical staff member?
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/auth" className="flex-1">
              <motion.div className="w-full py-3 text-center rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#0060AA] text-white font-semibold text-sm cursor-pointer"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Yes, I am a Healthcare Professional
              </motion.div>
            </Link>
            <motion.button onClick={handleAccessDenied}
              className="flex-1 py-3 rounded-xl bg-white/[0.04] text-white/40 hover:bg-white/[0.07] border border-white/[0.07] text-sm font-medium transition-all"
              whileTap={{ scale: 0.98 }}>
              No, I am not
            </motion.button>
          </div>
          <p className="text-[10px] text-white/15 text-center">
            This platform is exclusively for licensed medical professionals.
          </p>
        </div>
      </Modal>
    </div>
  );
}
