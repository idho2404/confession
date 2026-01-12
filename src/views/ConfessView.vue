<script setup>
import { ref, onUnmounted, computed } from 'vue'

/* ======================
   STATE
====================== */
const phase = ref(1)
const name = ref('')
const text = ref('')
const showVideo = ref(false)
const currentVideoIndex = ref(0)

const bgMusic = new Audio('music/symponi.mp3')
bgMusic.loop = true
bgMusic.volume = 0.3

let typingInterval = null

/* ======================
   CONTENT - URUTAN FINAL
====================== */
const story = [
  { type: 'text', content: 'Hai {name}, terimakasih sudah bersedia masuk kesini' },
  { type: 'text', content: 'Kamu tau kan aku lagi jatuh suka sama seseorang?' },
  { type: 'text', content: 'Dan, selama ini kamu tanya itu siapa kan?' },
  { type: 'text', content: 'Dr. Fachrudin Faiz bilang' },
  { type: 'video', video: 'confess.mp4', duration: 16000 },
  { type: 'text', content: 'Sebenarnya aku sudah bilang dan harusnya kamu tahu :)' },
  { type: 'text', content: 'Kalau belum gapapa, aku ingetin lagi' },
  { type: 'text', content: 'Jatuh suka' },
  { type: 'video', video: 'suka.mp4', duration: 45000 },
  { type: 'text', content: 'Aku juga gatau sejak kapan dia tumbuh' },
  { type: 'text', content: 'Aku juga gatau sejak kapan dia mekar dengan megah' },
  { type: 'text', content: 'Tapi, terimakasih sudah menghias kebunku yang gersang dengan mekar cantikmu' },
  { type: 'text', content: 'Terimakasih..' }
]

/* ======================
   BACKGROUND DATA
====================== */
const rand = (min, max) => Math.random() * (max - min) + min

// Floating particles - lebih sedikit, lebih elegan
const floatingParticles = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: rand(0, 100),
  top: rand(0, 100),
  size: rand(3, 8),
  duration: rand(15, 25),
  delay: rand(0, 10)
}))

// Ambient lights - efek cahaya lembut
const ambientLights = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: rand(10, 90),
  top: rand(10, 90),
  size: rand(100, 200),
  duration: rand(8, 15),
  delay: rand(0, 8)
}))

/* ======================
   THEME - Warna Mewah & Deep
====================== */
const bgColor = computed(() => {
  if (phase.value === 1) return 'linear-gradient(135deg, #1a1625 0%, #2d1b3d 50%, #3d2147 100%)'
  if (phase.value >= 2 && phase.value <= 4) return 'linear-gradient(135deg, #0f0c1d 0%, #1a1534 50%, #251e47 100%)'
  if (phase.value >= 5 && phase.value <= 9) return 'linear-gradient(135deg, #1a0f1f 0%, #2d1534 50%, #3d1f47 100%)'
  if (phase.value >= 10) return 'linear-gradient(135deg, #1f0f2d 0%, #331947 50%, #47235d 100%)'
  return 'linear-gradient(135deg, #1a1625 0%, #2d1b3d 100%)'
})

/* ======================
   TYPING
====================== */
const typeText = (content, speed = 45) => {
  clearInterval(typingInterval)
  text.value = ''
  showVideo.value = false

  return new Promise(resolve => {
    let i = 0
    typingInterval = setInterval(() => {
      text.value += content[i]
      i++

      if (i >= content.length) {
        clearInterval(typingInterval)
        resolve()
      }
    }, speed)
  })
}

/* ======================
   VIDEO HANDLING
====================== */
const showVideoContent = (videoFile, duration) => {
  return new Promise(resolve => {
    text.value = ''
    showVideo.value = true
    
    bgMusic.volume = 0 
    
    setTimeout(() => {
      showVideo.value = false
      bgMusic.volume = 0.3 
      resolve()
    }, duration)
  })
}

/* ======================
   STORY FLOW
====================== */
const startStory = async () => {
  if (!name.value.trim()) return
  
  bgMusic.play().catch(console.log)
  
  phase.value = 2
  let videoCount = 0
  
  for (let i = 0; i < story.length; i++) {
    const item = story[i]
    phase.value = i + 2
    
    if (item.type === 'text') {
      const content = item.content.replace('{name}', name.value)
      await typeText(content)
      await wait(2000)
    } else if (item.type === 'video') {
      currentVideoIndex.value = videoCount
      await showVideoContent(item.video, item.duration)
      videoCount++
      await wait(1000)
    }
  }

  phase.value = 999
}

/* ======================
   UTILS
====================== */
const wait = ms => new Promise(r => setTimeout(r, ms))

const handleKeyPress = (e) => {
  if (e.key === 'Enter') startStory()
}

const getCurrentVideo = computed(() => {
  const videoFiles = ['confess.mp4', 'suka.mp4']
  return videoFiles[currentVideoIndex.value] || 'confess.mp4'
})

onUnmounted(() => {
  clearInterval(typingInterval)
  bgMusic.pause()              
  bgMusic.src = ""
})
</script>

<template>
  <main class="min-h-screen relative overflow-hidden text-white flex flex-col">

    <div
      class="fixed inset-0 -z-10 transition-all duration-1000 pointer-events-none overflow-hidden"
      :style="{ background: bgColor }"
    >
      <!-- Ambient Light Effects -->
      <div 
        v-for="light in ambientLights" 
        :key="'light'+light.id" 
        class="absolute ambient-glow rounded-full blur-3xl" 
        :style="{ 
          left: light.left + '%', 
          top: light.top + '%', 
          width: light.size + 'px',
          height: light.size + 'px',
          animationDuration: light.duration + 's', 
          animationDelay: light.delay + 's' 
        }"
      ></div>
      
      <!-- Floating Particles -->
      <div 
        v-for="p in floatingParticles" 
        :key="'particle'+p.id" 
        class="absolute floating-particle" 
        :style="{ 
          left: p.left + '%', 
          top: p.top + '%',
          animationDuration: p.duration + 's', 
          animationDelay: p.delay + 's' 
        }"
      >
        <div class="particle-dot" :style="{ width: p.size + 'px', height: p.size + 'px' }"></div>
      </div>
    </div>

    <section class="flex-1 flex items-center justify-center py-8 text-center relative z-10">
      
      <div v-if="phase === 1" class="w-full max-w-sm mx-auto px-6 space-y-8 fade-in-up">
        <div class="space-y-3">
          <h1 class="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Halo 👋
          </h1>
          <p class="text-gray-300 text-base md:text-lg font-medium">Ada yang ingin aku sampaikan...</p>
        </div>

        <div class="space-y-2">
          <div class="w-full">
            <input
              v-model="name"
              @keypress="handleKeyPress"
              placeholder="Nama kamu..."
              class="w-full px-5 py-3.5 rounded-full border-2 border-purple-400/30 text-white text-base md:text-lg font-medium focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all shadow-xl text-center bg-white/10 backdrop-blur-md placeholder-gray-400"
            />
          </div>

          <button
            @click="startStory"
            :disabled="!name.trim()"
            class="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg md:text-xl text-white shadow-2xl active:scale-95 transition-all disabled:opacity-50 px-5 hover:from-purple-700 hover:to-pink-700"
            style="filter: drop-shadow(0 8px 20px rgba(168, 85, 247, 0.4))"
          >
            Mulai 💬
          </button>
          
          <p class="text-gray-400 text-xs md:text-sm pt-1">Tekan "Enter" setelah mengisi nama</p>
        </div>
      </div>

      <div v-else-if="phase > 1 && phase < 999" class="w-full max-w-2xl mx-auto px-6 fade-in-up">
        <div v-if="!showVideo" class="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-2xl">
          <p class="text-2xl md:text-4xl font-bold leading-relaxed text-white drop-shadow-2xl">
            {{ text }}
            <span class="inline-block w-1 h-8 md:h-12 ml-1 bg-purple-400 typing-cursor"></span>
          </p>
        </div>

        <div v-else class="flex justify-center items-center">
          <div class="relative w-full max-w-[280px]">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl"></div>
            <div class="relative bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl border border-white/10">
              <video autoplay playsinline class="w-full h-auto aspect-[9/16] object-cover">
                <source :src="`video/${getCurrentVideo}`" type="video/mp4">
              </video>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="phase === 999" class="w-full max-w-sm mx-auto px-6 fade-in-up">
        <div class="bg-white/5 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl border border-white/10 text-center">
          <h2 class="text-6xl mb-4">💕</h2>
          <p class="text-2xl md:text-3xl font-bold text-white break-words">
            {{ name }}
          </p>
        </div>
      </div>
    </section>

    <footer v-if="phase === 999" class="p-8 text-center fade-in-up">
      <div class="inline-block bg-white/5 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-xl">
        <p class="text-white text-sm font-medium">Terima kasih sudah membaca sampai akhir</p>
      </div>
    </footer>

  </main>
</template>

<style>
  main * {
    padding: 8px;
  }
  </style>

<style scoped>
/* Ambient Glow - cahaya lembut bergerak */
@keyframes ambientGlow {
  0%, 100% {
    opacity: 0.15;
    transform: translate(0, 0) scale(1);
  }
  33% {
    opacity: 0.25;
    transform: translate(20px, -30px) scale(1.3);
  }
  66% {
    opacity: 0.2;
    transform: translate(-30px, 20px) scale(1.1);
  }
}

.ambient-glow {
  background: radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.3) 50%, transparent 70%);
  animation: ambientGlow ease-in-out infinite;
}

/* Floating Particles - partikel melayang halus */
@keyframes floatingParticle {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  25% {
    transform: translate(30px, -50px) scale(1.2);
    opacity: 0.6;
  }
  50% {
    transform: translate(-20px, -100px) scale(0.8);
    opacity: 0.4;
  }
  75% {
    transform: translate(40px, -150px) scale(1.1);
    opacity: 0.5;
  }
}

.floating-particle {
  animation: floatingParticle ease-in-out infinite;
}

.particle-dot {
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(168, 85, 247, 0.4) 50%, transparent 70%);
  border-radius: 50%;
  filter: blur(1px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 1s ease-out forwards;
}

.typing-cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>