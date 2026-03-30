import { BibleVerse } from './types';

export const MOOD_VERSES: BibleVerse[] = [
  {
    reference: "Psalm 34:18",
    text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
    mood: ["sad", "lonely"]
  },
  {
    reference: "Philippians 4:6-7",
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    mood: ["stressed", "anxious"]
  },
  {
    reference: "Psalm 118:24",
    text: "This is the day that the Lord has made; let us rejoice and be glad in it.",
    mood: ["happy", "grateful"]
  },
  {
    reference: "Isaiah 41:10",
    text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
    mood: ["fearful", "scared"]
  },
  {
    reference: "Matthew 11:28",
    text: "Come to me, all you who are weary and burdened, and I will give you rest.",
    mood: ["tired", "stressed"]
  }
];

export const LIFE_GUIDANCE = [
  {
    topic: "Stress",
    advice: "Cast all your anxiety on him because he cares for you. (1 Peter 5:7)",
    description: "When life feels overwhelming, remember that you don't have to carry the burden alone. Take a moment to breathe and surrender your worries to God."
  },
  {
    topic: "Fear",
    advice: "For God has not given us a spirit of fear, but of power and of love and of a sound mind. (2 Timothy 1:7)",
    description: "Fear is not from God. Replace fearful thoughts with the truth of His power and love."
  },
  {
    topic: "Relationships",
    advice: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you. (Ephesians 4:32)",
    description: "Relationships thrive on grace. Practice forgiveness as a daily habit."
  }
];

export const AMBIENT_SOUNDS = [
  { id: 'bells', name: 'Church Bells', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // Placeholder
  { id: 'choir', name: 'Soft Choir', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' }, // Placeholder
  { id: 'rain', name: 'Rain + Prayer', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' } // Placeholder
];

export const SAINTS = [
  {
    name: "St. Francis of Assisi",
    story: "Known for his love of nature and animals, St. Francis abandoned a life of luxury for a life of poverty and service. He founded the Franciscan orders.",
    date: "October 4"
  },
  {
    name: "St. Thérèse of Lisieux",
    story: "Known as the 'Little Flower', she taught the 'Little Way' of doing small things with great love.",
    date: "October 1"
  }
];

export const BIBLE_QUIZ = [
  {
    question: "Who built the ark?",
    options: ["Noah", "Moses", "Abraham", "David"],
    answer: "Noah"
  },
  {
    question: "How many disciples did Jesus have?",
    options: ["10", "12", "7", "40"],
    answer: "12"
  }
];
