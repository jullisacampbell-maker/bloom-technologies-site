/**
 * Resource Vault — search, My Stack, alias matching, gap recommendations.
 */

import {
  RESOURCE_VAULT_CATALOG, VAULT_NAME_ALIASES, getVaultResource,
} from '../data/resourceVault';
import { createEmptyResource } from '../data/intakeOptions';
import { isPresent, dedupeList } from './contentFormat';
import { getChildren } from './householdUtils';

export function getActiveVaultCatalog() {
  return RESOURCE_VAULT_CATALOG.filter((r) => r.active);
}

export function filterVaultResources({ search = '', filterId = 'all' } = {}) {
  let list = getActiveVaultCatalog();
  const q = search.trim().toLowerCase();

  if (filterId && filterId !== 'all') {
    list = list.filter((r) =>
      r.tags?.includes(filterId) ||
      r.subjects?.some((s) => s.toLowerCase().includes(filterId.replace('-', ' ')))
    );
  }

  if (q) {
    list = list.filter((r) => {
      const hay = [
        r.title, r.provider, r.description, r.level,
        ...(r.subjects || []), ...(r.tags || []),
      ].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }

  return list;
}

export function isVaultResourceInStack(intake, vaultId) {
  return (intake?.learning?.resources || []).some((r) => r.vaultId === vaultId);
}

export function findStackResourceByVaultId(intake, vaultId) {
  return (intake?.learning?.resources || []).find((r) => r.vaultId === vaultId) || null;
}

/** Match existing free-text or structured names to vault entries — for parent confirmation. */
export function findVaultMatchesForName(name) {
  if (!isPresent(name)) return [];
  const n = String(name).trim();
  const matches = [];

  for (const alias of VAULT_NAME_ALIASES) {
    if (alias.patterns.some((p) => p.test(n))) {
      const resource = getVaultResource(alias.vaultId);
      if (resource) matches.push(resource);
    }
  }

  for (const resource of getActiveVaultCatalog()) {
    if (resource.title.toLowerCase().includes(n.toLowerCase()) ||
        n.toLowerCase().includes(resource.title.toLowerCase().slice(0, 12))) {
      if (!matches.find((m) => m.id === resource.id)) matches.push(resource);
    }
  }

  return matches.slice(0, 3);
}

export function findVaultMatchesFromCurriculum(intake) {
  const text = intake?.learning?.curriculum || '';
  const existing = (intake?.learning?.resources || []).map((r) => r.vaultId).filter(Boolean);
  const parts = dedupeList(text.split(/[,;\n]+/).map((s) => s.trim()).filter(isPresent));
  const suggestions = [];

  for (const part of parts) {
    const alreadyLinked = (intake?.learning?.resources || []).some((r) =>
      r.name?.toLowerCase() === part.toLowerCase() || r.vaultId
    );
    if (alreadyLinked) continue;

    const matches = findVaultMatchesForName(part);
    for (const match of matches) {
      if (existing.includes(match.id)) continue;
      suggestions.push({
        enteredName: part,
        vaultResource: match,
        alreadyInStack: isVaultResourceInStack(intake, match.id),
      });
    }
  }

  const seen = new Set();
  return suggestions.filter((s) => {
    const key = `${s.enteredName}|${s.vaultResource.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function vaultResourceToStackEntry(vaultResource, config = {}) {
  const primarySubject = vaultResource.subjects?.[0] || 'General';
  return {
    ...createEmptyResource(),
    vaultId: vaultResource.id,
    name: config.name || vaultResource.title,
    subject: config.subject || primarySubject,
    memberIds: config.memberIds || [],
    isShared: config.isShared ?? (config.memberIds?.length === 0),
    usageMode: config.usageMode || vaultResource.suggestedUsageModes?.[0] || 'teacher-led',
    mode: config.usageMode || vaultResource.suggestedUsageModes?.[0] || 'teacher-led',
    sequence: config.sequence ?? 0,
    duration: config.duration || '',
    durationMinutes: config.durationMinutes ?? null,
    days: config.days || [],
    frequency: config.frequency || '',
    teacherPrepRequired: config.teacherPrepRequired ?? vaultResource.preparationLevel !== 'Low',
    printPrepStatus: config.printPrepStatus || (
      vaultResource.preparationLevel === 'Print required' ? 'needs-print' : 'ready'
    ),
    notes: config.notes || '',
  };
}

export function addVaultResourceToStack(intake, vaultResource, config = {}) {
  if (isVaultResourceInStack(intake, vaultResource.id)) {
    return { intake, added: false, reason: 'already-in-stack' };
  }

  const duplicateByName = (intake.learning?.resources || []).some((r) =>
    r.name?.trim().toLowerCase() === (config.name || vaultResource.title).trim().toLowerCase()
  );
  if (duplicateByName) {
    return { intake, added: false, reason: 'duplicate-name' };
  }

  const entry = vaultResourceToStackEntry(vaultResource, config);
  const resources = [...(intake.learning?.resources || []), entry];

  return {
    intake: {
      ...intake,
      learning: { ...intake.learning, resources },
    },
    added: true,
    resource: entry,
  };
}

export function removeResourceFromStack(intake, resourceId) {
  const resources = (intake.learning?.resources || []).filter((r) => r.id !== resourceId);
  return {
    ...intake,
    learning: { ...intake.learning, resources },
  };
}

export function updateStackResource(intake, resourceId, updates) {
  const resources = (intake.learning?.resources || []).map((r) =>
    r.id === resourceId ? { ...r, ...updates, mode: updates.usageMode || r.usageMode || r.mode } : r
  );
  return {
    ...intake,
    learning: { ...intake.learning, resources },
  };
}

const MONEY_SEQUENCE = ['carnival-thrills', 'printable-play-money', 'money-adventure'];

function childLevelMatches(resource, child) {
  const level = (resource.level || '').toLowerCase();
  const grade = (child.gradeLevel || '').toLowerCase();
  const age = child.ageRange || '';

  if (/preschool|pre-k|0-2|3-5/.test(level) && ['3-5', '0-2'].includes(age)) return true;
  if (/kindergarten|^k\b/.test(level) && (/kindergarten|^k\b/.test(grade) || age === '6-8')) return true;
  if (/k–12|k-12|family|primary|elementary|k–5|k-5/.test(level)) return true;
  if (/ages 2|beginning readers/.test(level)) return ['3-5', '6-8'].includes(age);
  return level.includes('family') || resource.tags?.includes('family-learning');
}

function subjectMatchesGap(gapSubject, resource) {
  const g = gapSubject.toLowerCase();
  const subjects = (resource.subjects || []).join(' ').toLowerCase();
  const tags = (resource.tags || []).join(' ').toLowerCase();

  if (/money|financial/.test(g) && /money|financial|currency/.test(subjects + tags)) return true;
  if (/music/.test(g) && /music|piano|rhythm/.test(subjects + tags)) return true;
  if (/math/.test(g) && /math|number/.test(subjects + tags)) return true;
  if (/phonics|reading|ela/.test(g) && /phonics|reading|literacy|decoding|language/.test(subjects + tags)) return true;
  if (/art/.test(g) && /art|fine motor/.test(subjects + tags)) return true;
  if (/science/.test(g) && /science/.test(subjects + tags)) return true;
  if (/pe|physical/.test(g) && /physical|movement/.test(subjects + tags)) return true;
  return false;
}

/** Recommend vault resources only for genuine gaps. */
export function recommendVaultForGaps(intake, gaps) {
  if (!gaps?.length) return [];

  const stack = intake?.learning?.resources || [];
  const stackVaultIds = new Set(stack.map((r) => r.vaultId).filter(Boolean));
  const children = getChildren(intake.members);
  const screenPref = (intake.learning?.screenPreference || '').toLowerCase();
  const recommendations = [];

  for (const gap of gaps) {
    const subject = gap.subject || gap;
    const isMoney = /money|financial/i.test(subject);

    let candidates = getActiveVaultCatalog().filter((v) =>
      subjectMatchesGap(subject, v) &&
      !stackVaultIds.has(v.id) &&
      !stack.some((r) => r.name?.toLowerCase().includes(v.title.toLowerCase().slice(0, 10)))
    );

    if (screenPref.includes('minimal') || screenPref.includes('offline')) {
      candidates = candidates.filter((v) => v.screenMode !== 'online');
    }

    if (isMoney) {
      candidates = MONEY_SEQUENCE
        .map((id) => getVaultResource(id))
        .filter(Boolean)
        .filter((v) => !stackVaultIds.has(v.id));
    } else {
      candidates = candidates.slice(0, 2);
    }

    for (const vault of candidates) {
      const matchingChildren = children.filter((c) => childLevelMatches(vault, c));
      if (!matchingChildren.length && children.length) continue;

      recommendations.push({
        vaultId: vault.id,
        title: vault.title,
        provider: vault.provider,
        officialUrl: vault.officialUrl,
        why: `Supports ${subject} at ${vault.level} without duplicating what you already own.`,
        childNames: matchingChildren.map((c) => c.name).filter(isPresent),
        preparationLevel: vault.preparationLevel,
        suggestedUsageModes: vault.suggestedUsageModes,
        gapSubject: subject,
      });
    }
  }

  const seen = new Set();
  return recommendations.filter((r) => {
    if (seen.has(r.vaultId)) return false;
    seen.add(r.vaultId);
    return true;
  }).slice(0, 4);
}
