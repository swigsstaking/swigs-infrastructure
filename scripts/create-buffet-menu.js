// Script pour créer le menu du Buffet de la Gare
// À exécuter sur le serveur avec: node create-buffet-menu.js

const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'swigs-cms';

const menuData = {
  entrees: [
    {
      id: 'e1',
      nom: 'Mesclun de saison, vinaigrette du Chef',
      prix: '7.-',
      description: '',
      image: '',
      allergenes: [],
      vegetarien: true
    },
    {
      id: 'e2',
      nom: 'Crème de courge chips de lard croustillantes',
      prix: '11.-',
      description: '',
      image: '',
      allergenes: ['lait'],
      vegetarien: false
    },
    {
      id: 'e3',
      nom: 'Terrine de campagne maison, chutney de figues',
      prix: '18.-',
      description: '',
      image: '',
      allergenes: [],
      vegetarien: false
    },
    {
      id: 'e4',
      nom: 'Escargots de Bourgogne et son beurre persillé',
      prix: '12.- (6 pces) / 24.- (12 pces)',
      description: '',
      image: '',
      allergenes: ['lait'],
      vegetarien: false
    },
    {
      id: 'e5',
      nom: 'Salade gourmande de chèvre chaud et miel du Valais',
      prix: '16.-',
      description: '',
      image: '',
      allergenes: ['lait'],
      vegetarien: true
    }
  ],
  tartes: [
    {
      id: 't1',
      nom: 'Caviar d\'aubergine, tomates, chèvre, miel, roquettes',
      prix: '28.-',
      description: '',
      image: '',
      allergenes: ['lait'],
      vegetarien: true
    },
    {
      id: 't2',
      nom: 'Caviar d\'aubergine, tomates, saumon fumé, crème acidulée, roquettes',
      prix: '29.-',
      description: '',
      image: '',
      allergenes: ['poisson', 'lait'],
      vegetarien: false
    },
    {
      id: 't3',
      nom: 'Caviar d\'aubergine, tomates, mozzarella, jambon cru',
      prix: '28.-',
      description: '',
      image: '',
      allergenes: ['lait'],
      vegetarien: false
    }
  ],
  incontournables: [
    {
      id: 'i1',
      nom: 'Smash burger (Bœuf CH / raclette du Valais/oignons confits/tomate/lard)',
      prix: '29.-',
      description: '',
      image: '',
      allergenes: ['gluten', 'lait'],
      vegetarien: false
    },
    {
      id: 'i2',
      nom: 'Steak tartare du chef coupé au couteau',
      prix: '36.-',
      description: '',
      image: '',
      allergenes: [],
      vegetarien: false
    },
    {
      id: 'i3',
      nom: 'Boudin noir aux pommes rôties',
      prix: '29.-',
      description: '',
      image: '',
      allergenes: [],
      vegetarien: false
    },
    {
      id: 'i4',
      nom: 'Côte de cochon de la Ferme en Croix et son jus corsé au romarin',
      prix: '34.-',
      description: '',
      image: '',
      allergenes: [],
      vegetarien: false
    },
    {
      id: 'i5',
      nom: 'Filet de truite arc-en-ciel de Bremgarten, beurre citronné et ses légumes croquants',
      prix: '32.-',
      description: '',
      image: '',
      allergenes: ['poisson', 'lait'],
      vegetarien: false
    },
    {
      id: 'i6',
      nom: 'Boîte chaude Suisse (Vacherin coulant/pommes de terre/charcuterie artisanale)',
      prix: '34.50',
      description: '',
      image: '',
      allergenes: ['lait'],
      vegetarien: false
    }
  ],
  formules: [
    {
      id: 'f1',
      nom: 'Plat à choix servi avec son bol de salade et dessert du jour',
      prix: '11.-',
      description: '',
      image: '',
      allergenes: [],
      vegetarien: false
    },
    {
      id: 'f2',
      nom: 'Onglet de bœuf à l\'échalote confite',
      prix: '24.-',
      description: '',
      image: '',
      allergenes: [],
      vegetarien: false
    },
    {
      id: 'f3',
      nom: 'Poulet fermier rôti de la Gruyère crème et morilles',
      prix: '24.-',
      description: '',
      image: '',
      allergenes: ['lait'],
      vegetarien: false
    },
    {
      id: 'f4',
      nom: 'Marmite du pêcheur, poisson du jour et son bouillon parfumé',
      prix: '24.-',
      description: '',
      image: '',
      allergenes: ['poisson'],
      vegetarien: false
    },
    {
      id: 'f5',
      nom: 'Joue de bœuf braisée en cocotte façon Bourguignonne',
      prix: '24.-',
      description: '',
      image: '',
      allergenes: [],
      vegetarien: false
    }
  ],
  desserts: [
    {
      id: 'd1',
      nom: 'Tiramisu spéculoos mangue',
      prix: '12.-',
      description: '',
      image: '',
      allergenes: ['gluten', 'lait', 'œufs'],
      vegetarien: true
    },
    {
      id: 'd2',
      nom: 'Crème brûlée à la vanille',
      prix: '11.-',
      description: '',
      image: '',
      allergenes: ['lait', 'œufs'],
      vegetarien: true
    },
    {
      id: 'd3',
      nom: 'Mousse chocolat noir',
      prix: '11.-',
      description: '',
      image: '',
      allergenes: ['lait', 'œufs'],
      vegetarien: true
    }
  ]
};

async function createBuffetMenu() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('✓ Connecté à MongoDB');
    
    const db = client.db(DB_NAME);
    const sitesCollection = db.collection('sites');
    const contentCollection = db.collection('contents');
    
    // Trouver le site
    const site = await sitesCollection.findOne({ slug: 'buffet-de-la-gare' });
    
    if (!site) {
      console.log('✗ Site Buffet de la Gare non trouvé');
      return;
    }
    
    console.log('✓ Site trouvé:', site.name);
    
    // Vérifier si le menu existe déjà
    const existing = await contentCollection.findOne({
      site: site._id,
      type: 'menu'
    });
    
    if (existing) {
      // Mettre à jour
      await contentCollection.updateOne(
        { _id: existing._id },
        { 
          $set: { 
            data: menuData,
            updatedAt: new Date()
          } 
        }
      );
      console.log('✓ Menu mis à jour');
    } else {
      // Créer
      await contentCollection.insertOne({
        site: site._id,
        section: 'menu',
        type: 'menu',
        data: menuData,
        order: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✓ Menu créé');
    }
    
    console.log('\nStatistiques du menu:');
    console.log(`  - Entrées: ${menuData.entrees.length} plats`);
    console.log(`  - Tartes fines: ${menuData.tartes.length} plats`);
    console.log(`  - Incontournables: ${menuData.incontournables.length} plats`);
    console.log(`  - Formules bistrot: ${menuData.formules.length} plats`);
    console.log(`  - Desserts: ${menuData.desserts.length} plats`);
    console.log(`  - Total: ${menuData.entrees.length + menuData.tartes.length + menuData.incontournables.length + menuData.formules.length + menuData.desserts.length} plats`);
    
  } catch (error) {
    console.error('✗ Erreur:', error.message);
  } finally {
    await client.close();
  }
}

createBuffetMenu();
