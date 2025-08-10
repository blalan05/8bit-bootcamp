export async function loadPremades() {
  try {
    const res = await fetch('/assets/data/premades.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('Failed to load premades');
    return await res.json();
  } catch (e) {
    console.warn('Unable to load premades:', e);
    return [];
  }
}

export function computePillarFromAttributes(attrs) {
  const fitness = Math.round((attrs.strength + attrs.constitution) / 2);
  const discipline = Math.round(attrs.grit + attrs.intellect / 1.5);
  const marksmanship = Math.round(attrs.dexterity + attrs.intellect / 1.5);
  const leadership = Math.round(attrs.charisma + attrs.grit / 1.5);
  return { fitness, discipline, marksmanship, leadership };
}

export const BACKGROUND_ATTR_MODS = {
  Athlete: { strength: 2, constitution: 1 },
  ROTC: { intellect: 2, charisma: 1 },
  'Range Hobbyist': { dexterity: 2, intellect: 1 },
  'Team Captain': { charisma: 2, grit: 1 },
  Musician: { dexterity: 1, intellect: 1, grit: 1 }
};

export function parseHeightToInches(heightText) {
  // Expect formats like 5'11" or 5'11 or 5ft 11in
  if (!heightText) return null;
  const m = String(heightText).match(/(\d+)\D+(\d+)/);
  if (!m) return null;
  const feet = parseInt(m[1], 10);
  const inches = parseInt(m[2], 10);
  return feet * 12 + inches;
}

export function computeBMI(weightLb, heightText) {
  const hIn = parseHeightToInches(heightText);
  if (!hIn || !weightLb) return null;
  return (weightLb / (hIn * hIn)) * 703;
}

export function getBodyCompositionMods({ height, weight }) {
  const mods = { strength: 0, dexterity: 0, intellect: 0, constitution: 0, charisma: 0, grit: 0 };
  const hIn = parseHeightToInches(height);
  const bmi = computeBMI(weight, height);

  if (bmi) {
    if (bmi < 18.5) {
      // Underweight
      mods.strength -= 1;
      mods.constitution -= 1;
    } else if (bmi >= 25 && bmi < 30) {
      // Overweight
      mods.constitution -= 1;
      mods.dexterity -= 1;
      mods.charisma -= 1;
    } else if (bmi >= 30) {
      // Obese
      mods.constitution -= 2;
      mods.dexterity -= 1;
      mods.charisma -= 1;
    }
  }

  if (hIn) {
    if (hIn <= 64) {
      // Shorter
      mods.charisma -= 1;
    } else if (hIn >= 75) {
      // Very tall
      mods.constitution -= 1;
    }
  }

  return mods;
}

export function applyAttributeMods(baseAttrs, ...modsList) {
  const result = { ...baseAttrs };
  for (const mods of modsList) {
    for (const k of Object.keys(mods)) {
      result[k] = clampStat((result[k] ?? 0) + (mods[k] ?? 0));
    }
  }
  return result;
}

export function clampStat(v) {
  return Math.max(1, Math.min(10, Math.round(v)));
}
