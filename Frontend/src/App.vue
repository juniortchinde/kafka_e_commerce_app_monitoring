<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";


// varible pour stocker le timeout avant l'envoie d'une métrique mousemove
let hoverTimer: ReturnType<typeof setTimeout> | null = null;
let lastElement: HTMLElement | null = null;
// 🔐 Créer sessionId
let sessionId = sessionStorage.getItem("sessionId");
if (!sessionId) {
  sessionId = crypto.randomUUID();
  sessionStorage.setItem("sessionId", sessionId);
}

// 📤 Fonction d'envoi de métrique
const sendMetric = async (eventType: string, details: Record<string, any>) => {
  try {
    await fetch("http://localhost:4000/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        eventType,
        timestamp: new Date().toISOString(),
        details,
      }),
    });
  } catch (err) {
    console.error("Erreur d'envoi des métriques :", err);
  }
};

const router = useRouter();

onMounted(() => {
  // Clics généraux + détection navigation
  const clickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const tag = target?.tagName;
    const path = router.currentRoute.value.fullPath;

    // Vérifie si le clic est sur un élément de navigation

    sendMetric("click", {
      x: e.clientX,
      y: e.clientY,
      tag,
      path,
      innerText: target.innerText?.slice(0, 50), // contenu limité
    });
  };


  const moveHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // Ignore si l'élément est le même que précédemment
    if (target === lastElement) return;

    // Nettoyer le précédent timer si on survole un nouvel élément
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }

    // Vérifie qu'il y a du texte significatif
    const text = target?.innerText?.trim();
    if (!text || text.length === 0) {
      lastElement = null;
      return;
    }

    // Nouveau timer si texte détecté
    lastElement = target;

    hoverTimer = setTimeout(() => {
      sendMetric("mouseOver", {
        x: e.clientX,
        y: e.clientY,
        tag: target.tagName,
        hoveredText: text.slice(0, 100),
      });
      hoverTimer = null;
    }, 2000); // 2 secondes
  };

// Nettoyage si la souris quitte la page
  const mouseOutHandler = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
      lastElement = null;
    }
  };

  const scrollHandler = () => {
    sendMetric("scroll", {
      scrollY: window.scrollY,
      path: router.currentRoute.value.fullPath,
    });
  };

  window.addEventListener("click", clickHandler);
  window.addEventListener("mousemove", moveHandler);
  window.addEventListener("scroll", scrollHandler);

  router.afterEach((to, from) => {
    sendMetric("navigation", {
      from: from.fullPath,
      to: to.fullPath,
    });
  });

  onUnmounted(() => {
    window.removeEventListener("click", clickHandler);
    window.removeEventListener("mousemove", moveHandler);
    window.removeEventListener("scroll", scrollHandler);
    window.addEventListener("mouseout", mouseOutHandler);
  });
});
</script>

<template>
  <Header />
  <main>
    <router-view />
  </main>
  <Footer />
</template>

<style scoped>
main {
  padding: 2rem;
}
</style>
