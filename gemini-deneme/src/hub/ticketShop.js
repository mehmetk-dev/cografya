// Ticket, Highscores & Shop Manager for Lunapark Arcade
import confetti from 'canvas-confetti';
import { sound } from '../audio/soundManager.js';

export class TicketShop {
  constructor() {
    this.tickets = parseInt(localStorage.getItem('lunapark_tickets') || '0', 10);
    this.highscores = JSON.parse(localStorage.getItem('lunapark_highscores') || '{}');
    this.inventory = JSON.parse(localStorage.getItem('lunapark_inventory') || '["classic_train"]');

    this.items = [
      { id: 'neon_fireworks', name: '🎆 Altın Havai Fişekler', cost: 150, desc: 'Daha büyük ve altın parıltılı patlamalar' },
      { id: 'gold_train', name: '🚂 Altın Festival Treni', cost: 300, desc: 'Lunapark treni için göz alıcı altın kaplama' },
      { id: 'cotton_candy_title', name: '🍭 Pamuk Şeker Kralı', cost: 75, desc: 'Profilinde parlayan özel lunapark unvanı' },
      { id: 'carnival_vip', name: '👑 Lunapark VIP Kartı', cost: 500, desc: 'Tüm oyunlarda +%20 ekstra bilet çarpanı' }
    ];
  }

  getTickets() {
    return this.tickets;
  }

  addTickets(amount) {
    // Check for VIP multiplier
    if (this.inventory.includes('carnival_vip')) {
      amount = Math.round(amount * 1.2);
    }
    this.tickets += amount;
    localStorage.setItem('lunapark_tickets', this.tickets.toString());
    sound.playTicket();
    this.updateUI();
    return amount;
  }

  getHighScore(gameId) {
    return this.highscores[gameId] || 0;
  }

  setHighScore(gameId, score) {
    if (!this.highscores[gameId] || score > this.highscores[gameId]) {
      this.highscores[gameId] = score;
      localStorage.setItem('lunapark_highscores', JSON.stringify(this.highscores));
      return true; // New high score
    }
    return false;
  }

  buyItem(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return { success: false, message: 'Ürün bulunamadı!' };
    if (this.inventory.includes(itemId)) return { success: false, message: 'Bu ürüne zaten sahipsin!' };
    if (this.tickets < item.cost) return { success: false, message: 'Yeterli biletin yok! Daha fazla oyun oyna.' };

    this.tickets -= item.cost;
    this.inventory.push(itemId);
    localStorage.setItem('lunapark_tickets', this.tickets.toString());
    localStorage.setItem('lunapark_inventory', JSON.stringify(this.inventory));

    sound.playVictory();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    this.updateUI();

    return { success: true, message: `Tebrikler! "${item.name}" satın alındı.` };
  }

  hasItem(itemId) {
    return this.inventory.includes(itemId);
  }

  updateUI() {
    const ticketCountEls = document.querySelectorAll('.ticket-count-badge');
    ticketCountEls.forEach(el => {
      el.textContent = this.tickets.toString();
    });
  }
}

export const ticketShop = new TicketShop();
