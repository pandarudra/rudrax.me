"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Play, RotateCcw, Trophy, Zap } from "lucide-react";
import Link from "next/link";

const CANVAS_W = 800;
const CANVAS_H = 400;
const GROUND_Y = 320;
const GRAVITY = 0.7;
const JUMP_VEL = -13;
const PLAYER_W = 30;
const PLAYER_H = 40;
const OBS_W = 24;
const MIN_OBS_H = 30;
const MAX_OBS_H = 60;
const COLLECTIBLE_SIZE = 18;

const CODE_SYMBOLS = ["{ }", "< />", "( )", "=>", "++", "fn", "[ ]", "&&", "||", "!="];

interface Obstacle {
  x: number;
  h: number;
  passed: boolean;
}

interface Collectible {
  x: number;
  y: number;
  symbol: string;
  collected: boolean;
}

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const gameRef = useRef({
    playerY: GROUND_Y - PLAYER_H,
    velY: 0,
    jumping: false,
    obstacles: [] as Obstacle[],
    collectibles: [] as Collectible[],
    speed: 4,
    frame: 0,
    score: 0,
    alive: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem("code-runner-highscore");
    if (stored) setHighScore(parseInt(stored));
  }, []);

  const startGame = useCallback(() => {
    const g = gameRef.current;
    g.playerY = GROUND_Y - PLAYER_H;
    g.velY = 0;
    g.jumping = false;
    g.obstacles = [];
    g.collectibles = [];
    g.speed = 4;
    g.frame = 0;
    g.score = 0;
    g.alive = true;
    setScore(0);
    setGameState("playing");
  }, []);

  const jump = useCallback(() => {
    const g = gameRef.current;
    if (!g.alive) return;
    if (!g.jumping) {
      g.velY = JUMP_VEL;
      g.jumping = true;
    }
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDark = () => document.documentElement.classList.contains("dark");

    const loop = () => {
      const g = gameRef.current;
      if (!g.alive) return;

      const dark = isDark();
      g.frame++;

      // Speed increases over time
      g.speed = 4 + g.frame * 0.002;

      // Physics
      g.velY += GRAVITY;
      g.playerY += g.velY;
      if (g.playerY >= GROUND_Y - PLAYER_H) {
        g.playerY = GROUND_Y - PLAYER_H;
        g.velY = 0;
        g.jumping = false;
      }

      // Spawn obstacles
      if (g.frame % Math.max(50, 90 - Math.floor(g.frame / 100)) === 0) {
        const h = MIN_OBS_H + Math.random() * (MAX_OBS_H - MIN_OBS_H);
        g.obstacles.push({ x: CANVAS_W + 20, h, passed: false });
      }

      // Spawn collectibles
      if (g.frame % 70 === 35) {
        g.collectibles.push({
          x: CANVAS_W + 20,
          y: GROUND_Y - 80 - Math.random() * 80,
          symbol: CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)],
          collected: false,
        });
      }

      // Move obstacles
      for (const obs of g.obstacles) {
        obs.x -= g.speed;
        // Score for passing
        if (!obs.passed && obs.x + OBS_W < 60) {
          obs.passed = true;
          g.score += 1;
        }
        // Collision
        const px = 60, py = g.playerY;
        if (
          px + PLAYER_W > obs.x + 4 &&
          px < obs.x + OBS_W - 4 &&
          py + PLAYER_H > GROUND_Y - obs.h + 4
        ) {
          g.alive = false;
          setScore(g.score);
          if (g.score > highScore) {
            setHighScore(g.score);
            localStorage.setItem("code-runner-highscore", g.score.toString());
          }
          setGameState("gameover");
          return;
        }
      }

      // Move collectibles
      for (const c of g.collectibles) {
        c.x -= g.speed;
        if (!c.collected) {
          const px = 60, py = g.playerY;
          if (
            px + PLAYER_W > c.x &&
            px < c.x + COLLECTIBLE_SIZE &&
            py + PLAYER_H > c.y &&
            py < c.y + COLLECTIBLE_SIZE
          ) {
            c.collected = true;
            g.score += 3;
          }
        }
      }

      // Cleanup offscreen
      g.obstacles = g.obstacles.filter((o) => o.x > -OBS_W);
      g.collectibles = g.collectibles.filter((c) => c.x > -COLLECTIBLE_SIZE);

      // Set live score
      setScore(g.score);

      // DRAW
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      if (dark) {
        skyGrad.addColorStop(0, "#0a0b09");
        skyGrad.addColorStop(1, "#121311");
      } else {
        skyGrad.addColorStop(0, "#f0f2ed");
        skyGrad.addColorStop(1, "#e8ebe6");
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, CANVAS_W, GROUND_Y);

      // Ground
      ctx.fillStyle = dark ? "#1a1b19" : "#dde0d8";
      ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);

      // Ground line
      ctx.strokeStyle = dark ? "rgba(159,232,112,0.3)" : "rgba(14,15,12,0.15)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(CANVAS_W, GROUND_Y);
      ctx.stroke();

      // Scrolling dashes on ground
      ctx.strokeStyle = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) {
        const dashX = ((i * 50 - g.frame * g.speed) % (CANVAS_W + 100)) + 50;
        ctx.beginPath();
        ctx.moveTo(dashX, GROUND_Y + 15);
        ctx.lineTo(dashX + 20, GROUND_Y + 15);
        ctx.stroke();
      }

      // Player (cute square character with face)
      const px = 60, py = g.playerY;
      // Body
      ctx.fillStyle = dark ? "#9fe870" : "#0e0f0c";
      ctx.beginPath();
      ctx.roundRect(px, py, PLAYER_W, PLAYER_H, 6);
      ctx.fill();
      // Eyes
      ctx.fillStyle = dark ? "#0e0f0c" : "#ffffff";
      ctx.beginPath();
      ctx.arc(px + 10, py + 14, 4, 0, Math.PI * 2);
      ctx.arc(px + 22, py + 14, 4, 0, Math.PI * 2);
      ctx.fill();
      // Pupils
      ctx.fillStyle = dark ? "#121311" : "#0e0f0c";
      ctx.beginPath();
      ctx.arc(px + 11, py + 14, 2, 0, Math.PI * 2);
      ctx.arc(px + 23, py + 14, 2, 0, Math.PI * 2);
      ctx.fill();
      // Mouth
      if (g.jumping) {
        ctx.fillStyle = dark ? "#0e0f0c" : "#ffffff";
        ctx.beginPath();
        ctx.arc(px + 16, py + 28, 4, 0, Math.PI);
        ctx.fill();
      }

      // Obstacles (spiky blocks)
      for (const obs of g.obstacles) {
        ctx.fillStyle = dark ? "#d03238" : "#d03238";
        ctx.beginPath();
        ctx.roundRect(obs.x, GROUND_Y - obs.h, OBS_W, obs.h, 4);
        ctx.fill();
        // Small skull/warning
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.fillText("!", obs.x + OBS_W / 2, GROUND_Y - obs.h + 16);
        ctx.textAlign = "left";
      }

      // Collectibles
      for (const c of g.collectibles) {
        if (c.collected) continue;
        // Glow
        ctx.shadowColor = dark ? "#9fe870" : "#9fe870";
        ctx.shadowBlur = 10;
        ctx.fillStyle = dark ? "rgba(159,232,112,0.15)" : "rgba(159,232,112,0.2)";
        ctx.beginPath();
        ctx.arc(c.x + COLLECTIBLE_SIZE / 2, c.y + COLLECTIBLE_SIZE / 2, COLLECTIBLE_SIZE, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = dark ? "#9fe870" : "#0e0f0c";
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(c.symbol, c.x + COLLECTIBLE_SIZE / 2, c.y + COLLECTIBLE_SIZE / 2);
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
      }

      // Score HUD
      ctx.fillStyle = dark ? "rgba(255,255,255,0.6)" : "rgba(14,15,12,0.5)";
      ctx.font = "bold 14px Inter, system-ui, sans-serif";
      ctx.fillText(`Score: ${g.score}`, CANVAS_W - 100, 30);

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    // Controls
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    const onTouch = () => jump();

    window.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("touchstart", onTouch);
    canvas.addEventListener("click", onTouch);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("touchstart", onTouch);
      canvas.removeEventListener("click", onTouch);
    };
  }, [gameState, jump, highScore]);

  return (
    <section className="min-h-screen bg-[#e8ebe6] dark:bg-[#0e0f0c] transition-colors duration-300">
      <div className="max-w-5xl mx-auto py-12 sm:py-20 px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[14px] font-bold text-[#454745] dark:text-[#868685] hover:text-[#0e0f0c] dark:hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-6xl font-black tracking-tight text-[#0e0f0c] dark:text-white mb-4"
        >
          Code <span className="accent-text">Runner</span>
        </motion.h1>
        <p className="text-lg text-[#454745] dark:text-[#868685] font-medium mb-8 max-w-2xl">
          Jump over bugs, collect code snippets. Press <kbd className="px-2 py-0.5 rounded-md bg-white dark:bg-[#1a1b19] border border-[#0e0f0c]/10 dark:border-white/10 font-mono text-sm">Space</kbd> or tap to jump.
        </p>

        <div className="relative w-full max-w-[800px] mx-auto">
          <div className="relative rounded-[24px] overflow-hidden border border-[#0e0f0c]/5 dark:border-white/5 shadow-xl bg-white dark:bg-[#121311]">
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="w-full h-auto block"
              style={{ imageRendering: "pixelated" }}
            />

            {/* Menu Overlay */}
            <AnimatePresence>
              {gameState === "menu" && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-[#121311]/80 backdrop-blur-sm"
                >
                  <Zap className="w-16 h-16 accent-text mb-6" />
                  <h2 className="text-3xl font-black text-[#0e0f0c] dark:text-white mb-2">Code Runner</h2>
                  <p className="text-[#454745] dark:text-[#868685] mb-8">Dodge bugs. Collect code. Beat your score.</p>
                  <button
                    onClick={startGame}
                    className="inline-flex items-center gap-2 px-10 py-4 rounded-[24px] accent-bg text-[#0e0f0c] font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
                  >
                    <Play className="w-5 h-5" /> Start Game
                  </button>
                  {highScore > 0 && (
                    <p className="mt-4 text-[14px] font-bold text-[#868685]">
                      High Score: {highScore}
                    </p>
                  )}
                </motion.div>
              )}

              {gameState === "gameover" && (
                <motion.div
                  key="gameover"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-[#121311]/80 backdrop-blur-sm"
                >
                  <Trophy className="w-16 h-16 accent-text mb-6" />
                  <h2 className="text-3xl font-black text-[#0e0f0c] dark:text-white mb-2">Game Over!</h2>
                  <p className="text-5xl font-black accent-text mb-2">{score}</p>
                  <p className="text-[#868685] text-[14px] font-bold mb-6">
                    High Score: {highScore}
                  </p>
                  <button
                    onClick={startGame}
                    className="inline-flex items-center gap-2 px-10 py-4 rounded-[24px] accent-bg text-[#0e0f0c] font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
                  >
                    <RotateCcw className="w-5 h-5" /> Play Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Live score when playing */}
          {gameState === "playing" && (
            <div className="absolute top-4 left-4 px-4 py-2 rounded-[12px] bg-white/70 dark:bg-[#121311]/70 backdrop-blur-sm border border-[#0e0f0c]/5 dark:border-white/5">
              <span className="text-[14px] font-black text-[#0e0f0c] dark:text-white">
                Score: <span className="accent-text">{score}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
