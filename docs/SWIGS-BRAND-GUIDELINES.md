# SWIGS - Brand Guidelines

## 🎨 Palette de couleurs

### Couleur principale (Primary - Indigo)
| Nom | Hex | RGB | Usage |
|-----|-----|-----|-------|
| Primary 50 | `#eef2ff` | rgb(238, 242, 255) | Backgrounds très légers |
| Primary 100 | `#e0e7ff` | rgb(224, 231, 255) | Backgrounds légers |
| Primary 200 | `#c7d2fe` | rgb(199, 210, 254) | Bordures légères |
| Primary 300 | `#a5b4fc` | rgb(165, 180, 252) | Éléments secondaires |
| Primary 400 | `#818cf8` | rgb(129, 140, 248) | Hover states |
| **Primary 500** | **`#6366f1`** | rgb(99, 102, 241) | **Couleur principale** |
| **Primary 600** | **`#4f46e5`** | rgb(79, 70, 229) | **Boutons, CTA** |
| Primary 700 | `#4338ca` | rgb(67, 56, 202) | Hover boutons |
| Primary 800 | `#3730a3` | rgb(55, 48, 163) | Texte sur fond clair |
| Primary 900 | `#312e81` | rgb(49, 46, 129) | Texte foncé |

### Couleurs sémantiques

#### Success (Vert)
| Nom | Hex | Usage |
|-----|-----|-------|
| Success 400 | `#34d399` | Icônes succès |
| **Success 500** | **`#10b981`** | **Badges, confirmations** |
| Success 600 | `#059669` | Texte succès |

#### Warning (Orange)
| Nom | Hex | Usage |
|-----|-----|-------|
| Warning 400 | `#fbbf24` | Icônes warning |
| **Warning 500** | **`#f59e0b`** | **Badges, alertes** |
| Warning 600 | `#d97706` | Texte warning |

#### Danger (Rouge)
| Nom | Hex | Usage |
|-----|-----|-------|
| Danger 400 | `#f87171` | Icônes erreur |
| **Danger 500** | **`#ef4444`** | **Badges, erreurs** |
| Danger 600 | `#dc2626` | Texte erreur |

### Mode sombre (Dark)
| Nom | Hex | Usage |
|-----|-----|-------|
| Dark 700 | `#334155` | Cards, modals |
| Dark 800 | `#1e293b` | Sidebar, éléments |
| **Dark 900** | **`#0f172a`** | **Background principal** |
| Dark 950 | `#020617` | Background profond |

---

## 🔤 Typographie

### Police principale
**Inter** - Police système moderne, lisible et professionnelle

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Hiérarchie typographique

| Élément | Taille | Poids | Usage |
|---------|--------|-------|-------|
| H1 | 36px (2.25rem) | Bold (700) | Titres de page |
| H2 | 24px (1.5rem) | Bold (700) | Sections principales |
| H3 | 20px (1.25rem) | Semibold (600) | Sous-sections |
| H4 | 18px (1.125rem) | Semibold (600) | Titres de cartes |
| Body | 16px (1rem) | Regular (400) | Texte courant |
| Small | 14px (0.875rem) | Regular (400) | Labels, descriptions |
| XSmall | 12px (0.75rem) | Medium (500) | Badges, tags |

### Télécharger Inter
- Google Fonts: https://fonts.google.com/specimen/Inter
- CDN: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`

---

## 📐 Espacements

| Nom | Valeur | Usage |
|-----|--------|-------|
| xs | 4px | Micro-espacements |
| sm | 8px | Entre éléments proches |
| md | 16px | Padding standard |
| lg | 24px | Sections |
| xl | 32px | Entre blocs |
| 2xl | 48px | Grandes sections |

---

## 🔲 Bordures et ombres

### Border radius
| Nom | Valeur | Usage |
|-----|--------|-------|
| sm | 4px | Petits éléments |
| md | 8px | Boutons, inputs |
| lg | 12px | Cards |
| xl | 16px | Modals, grandes cards |
| full | 9999px | Badges, avatars |

### Ombres
```css
/* Légère */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

/* Moyenne */
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);

/* Forte */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
```

---

## 🎯 Codes couleurs rapides (copier-coller)

### Pour Figma / Canva / Photoshop

```
COULEUR PRINCIPALE
Indigo 600: #4f46e5
Indigo 500: #6366f1

SUCCÈS
Vert: #10b981

ALERTE
Orange: #f59e0b

ERREUR
Rouge: #ef4444

FOND SOMBRE
Dark: #0f172a

FOND CLAIR
Gray: #f8fafc
```

---

## 🖼️ Logo

Le logo SWIGS utilise :
- **Couleur principale** : `#4f46e5` (Indigo 600)
- **Police** : Inter Bold
- **Style** : Moderne, minimaliste

---

## 📱 Exemples d'utilisation

### Bouton principal
```css
background-color: #4f46e5;
color: white;
border-radius: 8px;
padding: 12px 24px;
font-weight: 500;
```

### Card
```css
background-color: white; /* ou #0f172a en dark */
border: 1px solid #e2e8f0; /* ou #334155 en dark */
border-radius: 12px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
```

### Badge succès
```css
background-color: #ecfdf5;
color: #059669;
border-radius: 9999px;
padding: 4px 12px;
font-size: 12px;
font-weight: 500;
```

---

## 📋 Checklist communication

- [ ] Utiliser la palette Indigo comme couleur principale
- [ ] Police Inter pour tous les textes
- [ ] Coins arrondis (8-12px) pour un look moderne
- [ ] Ombres légères pour la profondeur
- [ ] Contraste suffisant (WCAG AA minimum)
- [ ] Mode sombre avec Dark 900 (#0f172a) comme fond

---

*Document généré le 16 janvier 2026*
