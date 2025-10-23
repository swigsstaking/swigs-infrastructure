// Script pour corriger le lien du site Buffet de la Gare dans Control Center
// À exécuter sur le serveur avec: node fix-buffet-link.js

const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'swigs-monitoring';

async function fixBuffetLink() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('✓ Connecté à MongoDB');
    
    const db = client.db(DB_NAME);
    const sitesCollection = db.collection('sites');
    
    // Trouver le site avec le mauvais lien
    const site = await sitesCollection.findOne({
      $or: [
        { domain: /buffet-de-la-garre/ },
        { domain: /buffetdelagare\.buffet-de-la-garre/ },
        { name: /Buffet de la Gare/i }
      ]
    });
    
    if (!site) {
      console.log('✗ Site Buffet de la Gare non trouvé');
      return;
    }
    
    console.log('✓ Site trouvé:', site.name);
    console.log('  Ancien domaine:', site.domain);
    
    // Mettre à jour le domaine
    const result = await sitesCollection.updateOne(
      { _id: site._id },
      { 
        $set: { 
          domain: 'buffet-de-la-gare.swigs.online',
          url: 'https://buffet-de-la-gare.swigs.online'
        } 
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✓ Domaine corrigé: buffet-de-la-gare.swigs.online');
    } else {
      console.log('✗ Aucune modification effectuée');
    }
    
  } catch (error) {
    console.error('✗ Erreur:', error.message);
  } finally {
    await client.close();
  }
}

fixBuffetLink();
