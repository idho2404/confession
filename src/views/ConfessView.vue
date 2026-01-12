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

const bgMusic = new Audio('/src/assets/musics/symponi.mp3')
bgMusic.loop = true // Agar lagu mengulang otomatis
bgMusic.volume = 0.3 // Volume kecil (0.0 sampai 1.0)

let typingInterval = null

/* ======================
   CONTENT - URUTAN FINAL
====================== */
const story = [
  { type: 'text', content: 'Hai {name}, terimakasih sudah bersedia masuk kesini' },
  { type: 'text', content: 'Kamu tau kan aku lagi jatuh suka sama seseorang?' },
  { type: 'text', content: 'Dan, selama ini kamu tanya itu siapa kan?' },
  { type: 'text', content: 'Dr. Fachrudin Faiz bilang' },
  { type: 'video', video: 'confess.mp4', duration: 16000 }, // 16 detik
  { type: 'text', content: 'Sebenarnya aku sudah bilang dan harusnya kamu tahu :)' },
  { type: 'text', content: 'Kalau belum gapapa, aku ingetin lagi' },
  { type: 'text', content: 'Jatuh suka' },
  { type: 'video', video: 'suka.mp4', duration: 45000 }, // 45 detik
  { type: 'text', content: 'Aku juga gatau sejak kapan dia tumbuh' },
  { type: 'text', content: 'Aku juga gatau sejak kapan dia mekar dengan megah' },
  { type: 'text', content: 'Tapi, terimakasih sudah menghias kebunku yang gersang dengan mekar cantikmu' },
  { type: 'text', content: 'Terimakasih..' }
]

/* ======================
   BACKGROUND DATA
====================== */
const rand = (min, max) => Math.random() * (max - min) + min

const hearts = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: rand(0, 100),
  size: rand(16, 36),
  duration: rand(12, 22),
  delay: rand(0, 10)
}))

const stars = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: rand(0, 100),
  top: rand(0, 100),
  duration: rand(2, 5),
  delay: rand(0, 5)
}))

const sparkles = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: rand(5, 95),
  top: rand(10, 90),
  size: rand(4, 10),
  duration: rand(3, 6),
  delay: rand(0, 4)
}))

/* ======================
   THEME
====================== */
const bgColor = computed(() => {
  if (phase.value === 1) return 'linear-gradient(135deg, #FFE5EC 0%, #FFC1E3 50%, #FFB3D9 100%)'
  if (phase.value >= 2 && phase.value <= 4) return 'linear-gradient(135deg, #0A0E27 0%, #1a1f4d 50%, #2a1f4d 100%)'
  if (phase.value >= 5 && phase.value <= 9) return 'linear-gradient(135deg, #1A0008 0%, #4a0520 50%, #6a0830 100%)'
  if (phase.value >= 10) return 'linear-gradient(135deg, #2D0A1F 0%, #5a1f4d 50%, #7a2f6d 100%)'
  return 'linear-gradient(135deg, #FFF0F5 0%, #FFE4F0 100%)'
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
    
    // Matikan volume musik saat video mulai
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
  
  bgMusic.play().catch(console.log("Autoplay blocked"))
  
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

  phase.value = 999 // Akhiri cerita
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
  <main class="min-h-screen relative overflow-x-hidden text-white flex flex-col">

    <div
      class="fixed inset-0 -z-10 transition-all duration-1000 pointer-events-none"
      :style="{ background: bgColor }"
    >
      <div
        v-for="h in hearts"
        :key="h.id"
        class="absolute bottom-[-60px] float-heart"
        :style="{
          left: h.left + '%',
          animationDuration: h.duration + 's',
          animationDelay: h.delay + 's'
        }"
      >
        <svg :width="h.size" :height="h.size" viewBox="0 0 24 24" fill="#ff69b4" stroke="#ff1493" stroke-width="1.5" style="filter: drop-shadow(0 0 8px rgba(255, 105, 180, 0.6))">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>

      <div
        v-for="s in stars"
        :key="'s'+s.id"
        class="absolute twinkle-star"
        :style="{
          left: s.left + '%',
          top: s.top + '%',
          animationDuration: s.duration + 's',
          animationDelay: s.delay + 's'
        }"
      >
        <svg width="6" height="6" viewBox="0 0 24 24" fill="#ffffff" style="filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))">
          <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
        </svg>
      </div>

      <div
        v-for="sp in sparkles"
        :key="'sp'+sp.id"
        class="absolute sparkle-effect"
        :style="{
          left: sp.left + '%',
          top: sp.top + '%',
          animationDuration: sp.duration + 's',
          animationDelay: sp.delay + 's'
        }"
      >
        <svg :width="sp.size" :height="sp.size" viewBox="0 0 24 24" fill="#ffed4e" stroke="#ffd700" stroke-width="2" style="filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.7))">
          <path d="M12 0l1.5 8.5L22 10l-8.5 1.5L12 20l-1.5-8.5L2 10l8.5-1.5z" />
          <path d="M12 4l.5 4L16 8.5l-3.5.5L12 13l-.5-4L8 8.5l3.5-.5z" />
        </svg>
      </div>
    </div>

    <section class="flex-1 flex items-center justify-center p-4 md:p-8 text-center relative z-10 w-full mx-auto max-w-[100vw]">
      
      <div v-if="phase === 1" class="w-full max-w-[350px] space-y-8 fade-in-up">
        <div class="space-y-3">
          <h1 class="text-4xl md:text-6xl font-extrabold text-gray-800" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.1)">
            Halo 👋
          </h1>
          <p class="text-gray-600 text-base md:text-xl font-medium px-2">Ada yang ingin aku sampaikan...</p>
        </div>

        <div class="space-y-4">
          <input
            v-model="name"
            @keypress="handleKeyPress"
            placeholder="Nama kamu..."
            class="w-full px-5 py-4 rounded-2xl border-2 border-pink-300 text-gray-800 text-lg font-semibold focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all shadow-xl appearance-none bg-white/90"
          />

          <button
            @click="startStory"
            :disabled="!name.trim()"
            :class="[
              'w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl font-bold text-xl text-white shadow-2xl active:scale-95 transition-all transform disabled:opacity-50 disabled:cursor-not-allowed',
              name.trim() ? 'pulse-btn' : ''
            ]"
          >
            Mulai 💬
          </button>
        </div>
      </div>

      <div v-else-if="phase > 1 && phase < 999" class="w-full max-w-2xl fade-in-up px-2">
        <div v-if="!showVideo" class="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-6 md:p-12 shadow-2xl border border-white/20 mx-auto">
          <p 
            class="text-2xl md:text-5xl font-bold leading-snug md:leading-relaxed text-white drop-shadow-lg"
            style="word-wrap: break-word; overflow-wrap: break-word;"
          >
            {{ text }}
            <span class="inline-block w-1 h-8 md:h-14 ml-1 bg-white typing-cursor"></span>
          </p>
        </div>

        <div v-else class="flex justify-center items-center">
          <div class="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30 w-full max-w-[280px] md:max-w-[360px]">
            <video 
              autoplay
              playsinline
              class="w-full h-auto object-cover aspect-[9/16]"
            >
              <source :src="`/src/assets/videos/${getCurrentVideo}`" type="video/mp4">
            </video>
          </div>
        </div>
      </div>

      <div v-else-if="phase === 999" class="w-full max-w-md fade-in-up px-4">
        <div class="bg-white/20 backdrop-blur-lg rounded-[3rem] p-8 md:p-12 shadow-2xl border border-white/30">
          <h2 class="text-6xl mb-4 drop-shadow-md">💕</h2>
          <p class="text-2xl md:text-4xl font-bold text-white break-words">
            {{ name }}
          </p>
        </div>
      </div>
    </section>

    <div
      v-if="phase === 999"
      class="p-6 w-full text-center fade-in-up mt-auto"
    >
      <div class="inline-block bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 shadow-lg">
        <p class="text-white font-semibold text-sm md:text-lg flex items-center justify-center gap-2">
          Terima kasih sudah membaca sampai akhir
        </p>
      </div>
    </div>

  </main>
</template>

<style scoped>
@keyframes floatUp {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-110vh) rotate(360deg);
    opacity: 0;
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes sparkleRotate {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: rotate(180deg) scale(1.5);
    opacity: 1;
  }
  100% {
    transform: rotate(360deg) scale(1);
    opacity: 0.3;
  }
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

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.float-heart {
  animation: floatUp linear infinite;
}

.twinkle-star {
  animation: twinkle ease-in-out infinite;
}

.sparkle-effect {
  animation: sparkleRotate ease-in-out infinite;
}

.fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.pulse-btn {
  animation: pulse 2s ease-in-out infinite;
}

.typing-cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>