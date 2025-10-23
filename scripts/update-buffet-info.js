// Script pour mettre à jour les informations du Buffet de la Gare
// À exécuter sur le serveur avec: node update-buffet-info.js

const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'swigs-cms';

async function updateBuffetInfo() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('✓ Connecté à MongoDB');
    
    const db = client.db(DB_NAME);
    const sitesCollection = db.collection('sites');
    
    // Trouver le site Buffet de la Gare
    const site = await sitesCollection.findOne({
      slug: 'buffet-de-la-gare'
    });
    
    if (!site) {
      console.log('✗ Site Buffet de la Gare non trouvé');
      return;
    }
    
    console.log('✓ Site trouvé:', site.name);
    
    // Mettre à jour les informations
    const result = await sitesCollection.updateOne(
      { _id: site._id },
      { 
        $set: { 
          'contact.phone': '027 306 37 66',
          'contact.email': 'info@buffetdelagarechezclaude.ch',
          'pages': [
            { value: 'home', label: 'Accueil' },
            { value: 'presentation', label: 'Présentation' },
            { value: 'carte', label: 'Notre Carte' },
            { value: 'evenements', label: 'Événements' },
            { value: 'galerie', label: 'Galerie' },
            { value: 'contact', label: 'Contact' }
          ]
        } 
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✓ Informations mises à jour');
      console.log('  - Téléphone: 027 306 37 66');
      console.log('  - Email: info@buffetdelagarechezclaude.ch');
      console.log('  - Pages: 6 pages configurées');
    } else {
      console.log('✗ Aucune modification effectuée');
    }
    
  } catch (error) {
    console.error('✗ Erreur:', error.message);
  } finally {
    await client.close();
  }
}

updateBuffetInfo();
