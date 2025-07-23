import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'jane.austen@example.com' },
      update: {},
      create: {
        email: 'jane.austen@example.com',
        name: 'Jane Austen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616c6a10175?w=150&h=150&fit=crop&crop=face'
      },
    }),
    prisma.user.upsert({
      where: { email: 'miguel.cervantes@example.com' },
      update: {},
      create: {
        email: 'miguel.cervantes@example.com',
        name: 'Miguel de Cervantes',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
    }),
    prisma.user.upsert({
      where: { email: 'victor.hugo@example.com' },
      update: {},
      create: {
        email: 'victor.hugo@example.com',
        name: 'Victor Hugo',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
    }),
    prisma.user.upsert({
      where: { email: 'maria.translator@example.com' },
      update: {},
      create: {
        email: 'maria.translator@example.com',
        name: 'María García',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
    }),
    prisma.user.upsert({
      where: { email: 'john.reader@example.com' },
      update: {},
      create: {
        email: 'john.reader@example.com',
        name: 'John Smith',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      },
    })
  ]);

  const [janeAusten, cervantes, victorHugo, mariaTranslator, johnReader] = users;

  // Create books with different authors
  const books = await Promise.all([
    prisma.book.upsert({
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
    }),
    prisma.book.upsert({
      where: { id: 'don-quixote' },
      update: {},
      create: {
        id: 'don-quixote',
        title: 'Don Quixote',
        author: 'Miguel de Cervantes',
        authorId: cervantes.id,
        coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
        description: 'A Spanish novel by Miguel de Cervantes. It follows the adventures of a hidalgo named Mr. Alonso Quixano who reads so many chivalric romances that he loses his sanity and decides to set out to revive chivalry, undo wrongs, and bring justice to the world.',
        language: 'es'
      },
    }),
    prisma.book.upsert({
      where: { id: 'les-miserables' },
      update: {},
      create: {
        id: 'les-miserables',
        title: 'Les Misérables',
        author: 'Victor Hugo',
        authorId: victorHugo.id,
        coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        description: 'A French historical novel by Victor Hugo, first published in 1862, that is considered one of the greatest novels of the 19th century. It follows the lives and interactions of several French characters over a twenty-year period in the early 19th century.',
        language: 'fr'
      },
    }),
    prisma.book.upsert({
      where: { id: 'sense-and-sensibility' },
      update: {},
      create: {
        id: 'sense-and-sensibility',
        title: 'Sense and Sensibility',
        author: 'Jane Austen',
        authorId: janeAusten.id,
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
        description: 'Jane Austen\'s first published novel, exploring the themes of love, money, and the contrast between reason and emotion through the lives of the Dashwood sisters.',
        language: 'en'
      },
    })
  ]);

  const [prideAndPrejudice, donQuixote, lesMiserables, senseAndSensibility] = books;

  // Enhanced translations data with multiple languages and books
  const translationsData = [
    // Pride and Prejudice translations
    {
      originalText: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
      translatedText: "Es una verdad universalmente reconocida que todo hombre soltero en posesión de una gran fortuna necesita una esposa.",
      sourceLanguage: "en",
      targetLanguage: "es",
      context: "Opening line of the novel",
      chapter: "Chapter 1",
      pageNumber: 1,
      bookId: prideAndPrejudice.id,
      translatorId: mariaTranslator.id
    },
    {
      originalText: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
      translatedText: "C'est une vérité universellement reconnue qu'un homme célibataire en possession d'une bonne fortune doit être en quête d'une épouse.",
      sourceLanguage: "en",
      targetLanguage: "fr",
      context: "Opening line of the novel",
      chapter: "Chapter 1",
      pageNumber: 1,
      bookId: prideAndPrejudice.id,
      translatorId: victorHugo.id
    },
    {
      originalText: "I could easily forgive his pride, if he had not mortified mine.",
      translatedText: "Podría perdonar fácilmente su orgullo, si no hubiera herido el mío.",
      sourceLanguage: "en",
      targetLanguage: "es",
      context: "Elizabeth about Darcy",
      chapter: "Chapter 5",
      pageNumber: 15,
      bookId: prideAndPrejudice.id,
      translatorId: mariaTranslator.id
    },
    {
      originalText: "You must allow me to tell you how ardently I admire and love you.",
      translatedText: "Debe permitirme decirle cuán ardientemente la admiro y la amo.",
      sourceLanguage: "en",
      targetLanguage: "es",
      context: "Darcy's proposal",
      chapter: "Chapter 34",
      pageNumber: 175,
      bookId: prideAndPrejudice.id,
      translatorId: mariaTranslator.id
    },
    
    // Don Quixote translations
    {
      originalText: "En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.",
      translatedText: "In a village of La Mancha, the name of which I have no desire to call to mind, there lived not long ago one of those gentlemen that keep a lance in the lance-rack, an old buckler, a lean hack, and a greyhound for coursing.",
      sourceLanguage: "es",
      targetLanguage: "en",
      context: "Opening line of Don Quixote",
      chapter: "Chapter 1",
      pageNumber: 1,
      bookId: donQuixote.id,
      translatorId: janeAusten.id
    },
    {
      originalText: "La libertad, Sancho, es uno de los más preciosos dones que a los hombres dieron los cielos.",
      translatedText: "Freedom, Sancho, is one of the most precious gifts that heaven has bestowed upon men.",
      sourceLanguage: "es",
      targetLanguage: "en",
      context: "Don Quixote on freedom",
      chapter: "Chapter 58",
      pageNumber: 420,
      bookId: donQuixote.id,
      translatorId: johnReader.id
    },
    {
      originalText: "La libertad, Sancho, es uno de los más preciosos dones que a los hombres dieron los cielos.",
      translatedText: "La liberté, Sancho, est l'un des dons les plus précieux que le ciel ait accordés aux hommes.",
      sourceLanguage: "es",
      targetLanguage: "fr",
      context: "Don Quixote on freedom",
      chapter: "Chapter 58",
      pageNumber: 420,
      bookId: donQuixote.id,
      translatorId: victorHugo.id
    },

    // Les Misérables translations
    {
      originalText: "Il faut, voyez-vous, des émotions aux hommes heureux.",
      translatedText: "Happy people need emotions, you see.",
      sourceLanguage: "fr",
      targetLanguage: "en",
      context: "Philosophical reflection",
      chapter: "Book 1, Chapter 3",
      pageNumber: 45,
      bookId: lesMiserables.id,
      translatorId: janeAusten.id
    },
    {
      originalText: "Aimer, c'est agir.",
      translatedText: "To love is to act.",
      sourceLanguage: "fr",
      targetLanguage: "en",
      context: "Victor Hugo's philosophy",
      chapter: "Book 4, Chapter 1",
      pageNumber: 234,
      bookId: lesMiserables.id,
      translatorId: johnReader.id
    },
    {
      originalText: "Aimer, c'est agir.",
      translatedText: "Amar es actuar.",
      sourceLanguage: "fr",
      targetLanguage: "es",
      context: "Victor Hugo's philosophy",
      chapter: "Book 4, Chapter 1",
      pageNumber: 234,
      bookId: lesMiserables.id,
      translatorId: mariaTranslator.id
    },

    // Sense and Sensibility translations
    {
      originalText: "The family of Dashwood had long been settled in Sussex.",
      translatedText: "La familia Dashwood había estado establecida en Sussex durante mucho tiempo.",
      sourceLanguage: "en",
      targetLanguage: "es",
      context: "Opening of the novel",
      chapter: "Chapter 1",
      pageNumber: 1,
      bookId: senseAndSensibility.id,
      translatorId: mariaTranslator.id
    },
    {
      originalText: "Know your own happiness. You want nothing but patience- or give it a more fascinating name, call it hope.",
      translatedText: "Conoce tu propia felicidad. No necesitas nada más que paciencia, o dale un nombre más fascinante: llámala esperanza.",
      sourceLanguage: "en",
      targetLanguage: "es",
      context: "Advice on happiness",
      chapter: "Chapter 48",
      pageNumber: 312,
      bookId: senseAndSensibility.id,
      translatorId: mariaTranslator.id
    }
  ];

  // Create all translations
  const createdTranslations = [];
  for (const translation of translationsData) {
    const created = await prisma.translation.create({
      data: translation
    });
    createdTranslations.push(created);
  }

  // Create bookmarks for realistic user interactions
  const bookmarkData = [
    // John bookmarks some translations
    { userId: johnReader.id, translationId: createdTranslations[0].id },
    { userId: johnReader.id, translationId: createdTranslations[2].id },
    { userId: johnReader.id, bookId: donQuixote.id },
    
    // Maria bookmarks books she's interested in
    { userId: mariaTranslator.id, bookId: lesMiserables.id },
    { userId: mariaTranslator.id, translationId: createdTranslations[7].id },
    
    // Jane Austen bookmarks other authors' work
    { userId: janeAusten.id, bookId: donQuixote.id },
    { userId: janeAusten.id, translationId: createdTranslations[9].id },
    
    // Victor Hugo bookmarks Jane Austen's work
    { userId: victorHugo.id, bookId: prideAndPrejudice.id },
    { userId: victorHugo.id, translationId: createdTranslations[3].id }
  ];

  for (const bookmark of bookmarkData) {
    await prisma.bookmark.create({
      data: bookmark
    });
  }

  console.log('✅ Seed completed successfully');
  console.log(`👤 Created ${users.length} users`);
  console.log(`📚 Created ${books.length} books`);
  console.log(`📝 Created ${createdTranslations.length} translations`);
  console.log(`🔖 Created ${bookmarkData.length} bookmarks`);
  
  console.log('\n📊 Summary:');
  console.log(`Books: ${books.map(book => book.title).join(', ')}`);
  console.log(`Languages: English, Spanish, French`);
  console.log(`Translation pairs: EN↔ES, EN↔FR, ES↔FR`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
