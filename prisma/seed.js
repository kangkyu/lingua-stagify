import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create a sample user (Jane Austen)
  const janeAusten = await prisma.user.upsert({
    where: { email: 'jane.austen@example.com' },
    update: {},
    create: {
      email: 'jane.austen@example.com',
      name: 'Jane Austen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c6a10175?w=150&h=150&fit=crop&crop=face'
    },
  });

  // Create Pride and Prejudice book
  const prideAndPrejudice = await prisma.book.upsert({
    where: { id: 'pride-and-prejudice' },
    update: {},
    create: {
      id: 'pride-and-prejudice',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      authorId: janeAusten.id,
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
      description: 'A romantic novel of manners written by Jane Austen in 1813. The story follows the character development of Elizabeth Bennet, the dynamic protagonist who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.',
      language: 'en'
    },
  });

  // Create sample translations
  const translations = [
    {
      originalText: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
      translatedText: "Es una verdad universalmente reconocida que todo hombre soltero en posesión de una gran fortuna necesita una esposa.",
      sourceLanguage: "en",
      targetLanguage: "es",
      context: "Opening line of the novel",
      chapter: "Chapter 1",
      pageNumber: 1
    },
    {
      originalText: "However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.",
      translatedText: "Por poco que se conozcan los sentimientos o puntos de vista de tal hombre al establecerse por primera vez en un vecindario, esta verdad está tan firmemente arraigada en las mentes de las familias circundantes que se le considera propiedad legítima de una u otra de sus hijas.",
      sourceLanguage: "en",
      targetLanguage: "es",
      context: "Continuation of opening",
      chapter: "Chapter 1",
      pageNumber: 1
    },
    {
      originalText: "I could easily forgive his pride, if he had not mortified mine.",
      translatedText: "Podría perdonar fácilmente su orgullo, si no hubiera herido el mío.",
      sourceLanguage: "en",
      targetLanguage: "es",
      context: "Elizabeth about Darcy",
      chapter: "Chapter 5",
      pageNumber: 15
    },
    {
      originalText: "There is a stubbornness about me that never can bear to be frightened at the will of others.",
      translatedText: "Hay una terquedad en mí que nunca puede soportar ser asustada por la voluntad de otros.",
      sourceLanguage: "en",
      targetLanguage: "es",
      context: "Elizabeth's character",
      chapter: "Chapter 31",
      pageNumber: 156
    },
    {
      originalText: "You must allow me to tell you how ardently I admire and love you.",
      translatedText: "Debe permitirme decirle cuán ardientemente la admiro y la amo.",
      sourceLanguage: "en",
      targetLanguage: "es",
      context: "Darcy's first proposal",
      chapter: "Chapter 34",
      pageNumber: 175
    },
    {
      originalText: "In vain I have struggled. It will not do. My feelings will not be repressed. You must allow me to tell you how ardently I admire and love you.",
      translatedText: "En vano he luchado. No sirve de nada. Mis sentimientos no pueden ser reprimidos. Debe permitirme decirle cuán ardientemente la admiro y la amo.",
      sourceLanguage: "en",
      targetLanguage: "es",
      context: "Full proposal scene",
      chapter: "Chapter 34",
      pageNumber: 175
    }
  ];

  for (const translation of translations) {
    await prisma.translation.create({
      data: {
        ...translation,
        bookId: prideAndPrejudice.id,
        translatorId: janeAusten.id
      }
    });
  }

  console.log('✅ Seed completed successfully');
  console.log(`📚 Created book: ${prideAndPrejudice.title}`);
  console.log(`📝 Created ${translations.length} translations`);
  console.log(`👤 Created user: ${janeAusten.name}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
