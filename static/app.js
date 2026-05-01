document.addEventListener('DOMContentLoaded', function () {
  const tabButtons = document.querySelectorAll('.auth-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const activeTabEl = document.getElementById('active-tab');

  function setTab(tab) {
    tabButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.tab === tab);
    });
    loginForm.classList.toggle('hidden', tab !== 'login');
    registerForm.classList.toggle('hidden', tab !== 'register');
  }

  const initialTab = activeTabEl?.dataset.active || 'login';
  setTab(initialTab);

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => setTab(button.dataset.tab));
  });

  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  const responses = {
    sleep: [
      'For better hormone recovery, keep bedtime consistent, cut screens early, and add calming magnesium-rich foods before sleep.',
      'If sleep is shaky, try a shorter evening to-do list, relaxation breathing, and a warm drink to quiet cortisol before bed.'
    ],
    stress: [
      'When stress is high, pause for 3 deep breaths, move gently, and set a small recovery ritual so your body can reset.',
      'High stress is a hormone trigger. Support it with restful movement, a calming ritual, and firm boundaries around work or screen time.'
    ],
    cycle: [
      'Cycle-aware routines help hormones sync. Note your phase, then choose gentle recovery, stable energy, or strength work accordingly.',
      'If your cycle feels out of balance, track symptoms, hydrate consistently, and plan meals around your changing energy levels.'
    ],
    nutrition: [
      'Hormone-friendly meals are balanced with protein, healthy fats, and fiber. This helps steady insulin and supports healthy mood swings.',
      'For nutrition, add leafy greens, quality protein, and stable carbohydrate sources to reduce cravings and support hormone rhythm.'
    ],
    energy: [
      'For better energy, build in a morning boost, mid-day movement, and a calm wind-down—this keeps hormones from spiking and crashing.',
      'If energy dips, try a protein-rich snack, fresh air, and a short reset break instead of pushing through exhaustion.'
    ],
    mood: [
      'Mood balance often improves when you pair movement, hydration, and consistent meals with regular rest windows.',
      'When mood feels low, focus on gentle habits like sunlight, calming breathwork, and gratitude journaling to support your nervous system.'
    ],
    thyroid: [
      'Thyroid support benefits from warm, nourishing meals, balanced micros, and slow, steady movement instead of high-intensity strain.',
      'To support thyroid balance, choose nutrient-rich foods, regular rest, and mindful stress recovery every day.'
    ],
    pcos: [
      'For PCOS, prioritize steady blood sugar through protein, fiber, and healthy fats, and reduce high-sugar overwhelm where possible.',
      'PCOS-friendly support includes consistent meals, gentle movement, and stress management to reduce hormone volatility.'
    ],
    adrenal: [
      'Adrenal resilience is built with calm mornings, steady meals, and rest breaks — not with caffeine or clock-watching stress.',
      'Help your adrenals by slowing the pace, practicing soft breathing, and making space for restorative movement.'
    ]
  };

  const genericReplies = [
    'HormoneAI recommends a simple routine of sleep, movement, and nourishing meals to support hormonal clarity.',
    'A balanced day often starts with reset habits: water, sunlight, grounding movement, and calm transitions between tasks.',
    'Small changes in meal timing and rest can make a big difference for hormone rhythm and stress resilience.'
  ];

  function addMessage(text, type) {
    const message = document.createElement('div');
    message.className = `chat-message ${type}`;
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getBotReply(text) {
    const lower = text.toLowerCase();
    for (const key of Object.keys(responses)) {
      if (lower.includes(key)) {
        const options = responses[key];
        return options[Math.floor(Math.random() * options.length)];
      }
    }
    return genericReplies[Math.floor(Math.random() * genericReplies.length)];
  }

  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const question = chatInput.value.trim();
      if (!question) {
        return;
      }

      addMessage(question, 'user');
      chatInput.value = '';

      setTimeout(() => {
        addMessage(getBotReply(question), 'bot');
      }, 400);
    });
  }

  // Tracker tabs
  document.querySelectorAll('.tracker-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      document.querySelectorAll('.tracker-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tracker-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tabName + '-tab').classList.add('active');
    });
  });

  // Tracker form
  const trackerForm = document.getElementById('tracker-form');
  if (trackerForm) {
    trackerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const mood = formData.get('mood');
      const energy = parseInt(formData.get('energy'));
      const symptoms = formData.get('symptoms');

      let updates = '<ul>';
      if (mood === 'great' || mood === 'good') {
        updates += '<li>🌟 Your positive mood suggests strong hormonal balance. Keep up the great habits!</li>';
      } else if (mood === 'low' || mood === 'anxious') {
        updates += '<li>💙 Consider gentle self-care like a short walk or herbal tea to support your mood.</li>';
      }

      if (energy >= 7) {
        updates += '<li>⚡ High energy levels indicate optimal hormone support. Use this time for important tasks.</li>';
      } else if (energy <= 4) {
        updates += '<li>🛌 Low energy may signal a recovery phase. Prioritize rest and nourishing foods.</li>';
      }

      if (symptoms) {
        updates += '<li>📝 Noted your symptoms. HormoneAI recommends tracking these patterns for personalized insights.</li>';
      }

      updates += '<li>🎯 Your next optimal energy window is in 2-3 hours. Stay hydrated and nourished!</li>';
      updates += '</ul>';

      document.getElementById('updates-content').innerHTML = updates;
      document.getElementById('tracker-updates-result').classList.remove('hidden');
    });
  }

  // Reminders tabs
  document.querySelectorAll('.reminders-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      document.querySelectorAll('.reminders-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.reminders-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tabName + '-tab').classList.add('active');
    });
  });

  // Set reminder form
  const reminderForm = document.getElementById('reminder-form');
  if (reminderForm) {
    reminderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const title = formData.get('title');
      const description = formData.get('description');
      const frequency = formData.get('frequency');
      const time = formData.get('time');

      const reminderDiv = document.createElement('div');
      reminderDiv.className = 'custom-reminder';
      reminderDiv.innerHTML = `
        <strong>${title}</strong><br>
        ${description}<br>
        <small>Frequency: ${frequency} ${time ? `at ${time}` : ''}</small>
      `;

      document.getElementById('custom-reminders').appendChild(reminderDiv);
      e.target.reset();
    });
  }
});