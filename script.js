// Constants
const RARITY_ENUM = Object.freeze({
    COMMON: 'COMMON',
    UNCOMMON: 'UNCOMMON',
    RARE: 'RARE',
    EPIC: 'EPIC',
    LEGENDARY: 'LEGENDARY',
    MYTHIC: 'MYTHIC',
    DIVINE: 'DIVINE'
});

const GENERIC_ITEM_TYPES = Object.freeze([
    'WEAPON',
    'ARMOR',
    'ACCESSORY',
    'CONSUMABLE',
    'MATERIAL',
    'PET',
    'RUNE',
    'SPELL',
    'OTHER'
]);

const SPECIFIC_ITEM_TYPES = Object.freeze([
    'SWORD',
    'BOW',
    'HELMET',
    'CHESTPLATE',
    'LEGGINGS',
    'BOOTS',
    'TALISMAN',
    'POTION',
    'ENCHANTED_BOOK',
    'MISC'
]);

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const sanitizeClassName = (name) => {
    return name.replace(/[^a-zA-Z0-9]/g, '');
};

const getElementValue = (id) => {
    const element = document.getElementById(id);
    return element ? element.value : '';
};
const setElementValue = (id, value) => {
    document.getElementById(id).value = value;
};

// Main function to generate Java class
function generateJavaClass() {
    const displayName = getElementValue('displayName');
    const className = sanitizeClassName(displayName);
    const category = getElementValue('category');
    const url = getElementValue('url');
    const rarity = getElementValue('rarity').toUpperCase();
    const stats = {
        strength: getElementValue('strength'),
        critChance: getElementValue('critChance'),
        critDamage: getElementValue('critDamage'),
        intelligence: getElementValue('intelligence'),
        health: getElementValue('health'),
        defence: getElementValue('defence'),
        ferocity: getElementValue('ferocity'),
        speed: getElementValue('speed'),
        magicFind: getElementValue('magicFind')
    };
    const lore = getElementValue('lore');
    const type = getElementValue('type');
    const specificType = getElementValue('specificType');

    let javaClass = generateClassHeader(className, category);
    javaClass += generateClassBody(displayName, category, url, rarity, stats, lore, type, specificType);
    javaClass += '}';

    setElementValue('output', javaClass.trim());
}

function generateClassHeader(className, category) {
    const packageName = `me.godspunky.skyblock.features.item.${category.toLowerCase()}`;
    const interfaceName = category === 'Accessory' ? 'AccessoryStatistics' : 'ToolStatistics';

    return `
  package ${packageName};
  
  import me.godspunky.skyblock.features.item.*;
  
  public class ${className} implements ${interfaceName}, MaterialFunction {`;
}

function generateClassBody(displayName, category, url, rarity, stats, lore, type, specificType) {
    let classBody = `
      @Override
      public String getDisplayName() {
          return "${displayName}";
      }
  
      @Override
      public Rarity getRarity() {
          return Rarity.${rarity};
      }
  `;

    if (category === 'Other' && url) {
        classBody += `
      @Override
      public String getURL() {
          return "${url}";
      }
  `;
    }

    if (lore) {
        const loreLines = lore.split('\n').map(line => `"${line}"`).join(' +\n        ');
        classBody += `
      @Override
      public String getLore() {
          return ${loreLines};
      }
  `;
    }

    if (category === 'Other') {
        if (type) {
            classBody += `
      @Override
      public GenericItemType getType() {
          return GenericItemType.${type.toUpperCase()};
      }
  `;
        }
        if (specificType) {
            classBody += `
      @Override
      public SpecificItemType getSpecificType() {
          return SpecificItemType.${specificType.toUpperCase()};
      }
  `;
        }
    }

    for (const [stat, value] of Object.entries(stats)) {
        if (value && parseFloat(value) !== 0) {
            const methodName = `getBase${capitalizeFirstLetter(stat)}`;
            classBody += `
      @Override
      public double ${methodName}() {
          return ${value};
      }
  `;
        }
    }

    return classBody;
}

function copyToClipboard() {
    const outputField = document.getElementById('output');
    outputField.select();
    document.execCommand('copy');
    alert('Copied to clipboard!');
}

function validateInput() {
    const rarityElement = document.getElementById('rarity');
    const typeElement = document.getElementById('type');
    const specificTypeElement = document.getElementById('specificType');

    if (rarityElement) {
        const rarity = rarityElement.value.toUpperCase();
        if (!Object.values(RARITY_ENUM).includes(rarity)) {
            alert(`Invalid rarity. Please choose from: ${Object.values(RARITY_ENUM).join(', ')}`);
            return false;
        }
    }

    if (typeElement) {
        const type = typeElement.value.toUpperCase();
        if (type && !GENERIC_ITEM_TYPES.includes(type)) {
            alert(`Invalid generic item type. Please choose from: ${GENERIC_ITEM_TYPES.join(', ')}`);
            return false;
        }
    }

    if (specificTypeElement) {
        const specificType = specificTypeElement.value.toUpperCase();
        if (specificType && !SPECIFIC_ITEM_TYPES.includes(specificType)) {
            alert(`Invalid specific item type. Please choose from: ${SPECIFIC_ITEM_TYPES.join(', ')}`);
            return false;
        }
    }

    return true;
}

//event listener
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generateBtn').addEventListener('click', () => {
        if (validateInput()) {
            generateJavaClass();
        }
    });
    document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
});