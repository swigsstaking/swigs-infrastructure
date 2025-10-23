// Script pour créer le SEO du Buffet de la Gare
// À exécuter sur le serveur avec: node create-buffet-seo.js

const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'swigs-cms';

const seoData = {
  home: {
    page: 'home',
    title: 'Buffet de la Gare – Chez Claude | Restaurant à St-Pierre-de-Clages',
    description: 'Restaurant traditionnel au cœur de St-Pierre-de-Clages. Cuisine de saison, esprit bistrot et saveurs locales. Réservation: 027 306 37 66',
    keywords: ['restaurant valais', 'buffet de la gare', 'st-pierre-de-clages', 'cuisine valaisanne', 'restaurant traditionnel', 'esprit bistrot', 'cuisine de saison'],
    ogTitle: 'Buffet de la Gare – Chez Claude',
    ogDescription: 'Restaurant traditionnel à St-Pierre-de-Clages. Cuisine de saison, esprit bistrot et saveurs locales.',
    robots: 'index,follow'
  },
  presentation: {
    page: 'presentation',
    title: 'Notre Histoire | Buffet de la Gare – Chez Claude',
    description: 'Découvrez l\'histoire du Buffet de la Gare, restaurant familial depuis plusieurs générations à St-Pierre-de-Clages. Le vin coule, la cuisine chante, et tout va bien au Buffet.',
    keywords: ['histoire restaurant', 'restaurant familial', 'valais', 'tradition', 'buffet de la gare'],
    ogTitle: 'Notre Histoire - Buffet de la Gare',
    ogDescription: 'Restaurant familial depuis plusieurs générations',
    robots: 'index,follow'
  },
  carte: {
    page: 'carte',
    title: 'Notre Carte | Buffet de la Gare – Chez Claude',
    description: 'Découvrez notre carte: entrées, tartes fines, incontournables, formules bistrot et desserts. Cuisine de saison et saveurs locales valaisannes.',
    keywords: ['carte restaurant', 'menu valais', 'cuisine de saison', 'esprit bistrot', 'saveurs locales', 'tartes fines'],
    ogTitle: 'Notre Carte - Buffet de la Gare',
    ogDescription: 'Cuisine de saison, esprit bistrot et saveurs locales',
    robots: 'index,follow'
  },
  evenements: {
    page: 'evenements',
    title: 'Événements & Soirées à Thème | Buffet de la Gare',
    description: 'Découvrez nos événements spéciaux et soirées à thème. Réservez votre table pour une expérience unique au Buffet de la Gare.',
    keywords: ['événements restaurant', 'soirées à thème', 'animations valais', 'restaurant événements'],
    ogTitle: 'Nos Événements - Buffet de la Gare',
    ogDescription: 'Événements spéciaux et soirées à thème',
    robots: 'index,follow'
  },
  galerie: {
    page: 'galerie',
    title: 'Galerie Photos | Buffet de la Gare – Chez Claude',
    description: 'Découvrez notre restaurant en images: salle, terrasse, plats et ambiance chaleureuse. On mange bien, on rit fort, et on oublie l\'heure du train.',
    keywords: ['photos restaurant', 'galerie', 'ambiance restaurant', 'buffet de la gare photos'],
    ogTitle: 'Galerie Photos - Buffet de la Gare',
    ogDescription: 'Découvrez notre restaurant en images',
    robots: 'index,follow'
  },
  contact: {
    page: 'contact',
    title: 'Contact & Réservation | Buffet de la Gare – Chez Claude',
    description: 'Réservez votre table au Buffet de la Gare. Avenue de la Gare 2, 1955 St-Pierre-de-Clages. Tél: 027 306 37 66',
    keywords: ['réservation restaurant', 'contact buffet de la gare', 'restaurant st-pierre-de-clages', 'réserver table'],
    ogTitle: 'Contact & Réservation - Buffet de la Gare',
    ogDescription: 'Réservez votre table: 027 306 37 66',
    robots: 'index,follow'
  }
};

async function createBuffetSEO() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('✓ Connecté à MongoDB');
    
    const db = client.db(DB_NAME);
    const sitesCollection = db.collection('sites');
    const seoCollection = db.collection('seos');
    
    // Trouver le site
    const site = await sitesCollection.findOne({ slug: 'buffet-de-la-gare' });
    
    if (!site) {
      console.log('✗ Site Buffet de la Gare non trouvé');
      return;
    }
    
    console.log('✓ Site trouvé:', site.name);
    console.log('\nCréation du SEO pour chaque page...\n');
    
    for (const [pageName, seo] of Object.entries(seoData)) {
      // Vérifier si le SEO existe déjà
      const existing = await seoCollection.findOne({
        site: site._id,
        page: seo.page
      });
      
      if (existing) {
        // Mettre à jour
        await seoCollection.updateOne(
          { _id: existing._id },
          { $set: { ...seo, site: site._id, updatedAt: new Date() } }
        );
        console.log(`✓ ${pageName}: SEO mis à jour`);
      } else {
        // Créer
        await seoCollection.insertOne({
          ...seo,
          site: site._id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`✓ ${pageName}: SEO créé`);
      }
    }
    
    console.log('\n✓ SEO créé pour toutes les pages');
    
  } catch (error) {
    console.error('✗ Erreur:', error.message);
  } finally {
    await client.close();
  }
}

createBuffetSEO();
