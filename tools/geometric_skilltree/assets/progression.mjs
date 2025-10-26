const DEFAULT_NODE_COST = 1;

function normalizeTierRequirements(requirements = {}) {
  if (requirements instanceof Map) {
    return new Map(requirements);
  }
  const map = new Map();
  Object.entries(requirements).forEach(([key, value]) => {
    const tier = Number(key);
    if (!Number.isNaN(tier)) {
      map.set(tier, value);
    }
  });
  return map;
}

export function deriveParentMap(nodes, arcs) {
  const nodeById = new Map(nodes.map(node => [node.id, node]));
  const parentMap = new Map();

  nodes.forEach(node => {
    parentMap.set(node.id, new Set());
  });

  arcs.forEach(arc => {
    const fromNode = nodeById.get(arc.from);
    const toNode = nodeById.get(arc.to);

    if (!fromNode || !toNode) {
      return;
    }

    if (fromNode.tier < toNode.tier) {
      parentMap.get(toNode.id).add(fromNode.id);
    } else if (toNode.tier < fromNode.tier) {
      parentMap.get(fromNode.id).add(toNode.id);
    }
  });

  return new Map(
    Array.from(parentMap.entries(), ([id, parentSet]) => [id, Array.from(parentSet)])
  );
}

export class SkillTreeProgression {
  constructor({
    nodes,
    arcs,
    rootNodeId = 'n0',
    tierGateRequirements = {},
    keystoneConfig = {},
    pointsPerLevel = 2,
    baseRespecCost = 2,
    respecCostGrowth = 1.5,
    nodeCost = DEFAULT_NODE_COST
  }) {
    if (!Array.isArray(nodes) || !nodes.length) {
      throw new Error('SkillTreeProgression requires a non-empty node list.');
    }
    this.nodes = new Map(nodes.map(node => {
      const copy = { ...node };
      if (typeof copy.cost !== 'number') {
        delete copy.cost;
      }
      return [node.id, copy];
    }));
    this.arcs = Array.isArray(arcs) ? arcs.slice() : [];
    this.rootNodeId = rootNodeId;
    if (!this.nodes.has(this.rootNodeId)) {
      throw new Error(`Root node "${this.rootNodeId}" does not exist in provided nodes.`);
    }

    this.parentMap = deriveParentMap(nodes, this.arcs);
    this.tierGateRequirements = normalizeTierRequirements(tierGateRequirements);
    this.keystoneConfig = new Map(Object.entries(keystoneConfig));
    this.pointsPerLevel = pointsPerLevel;
    this.baseRespecCost = baseRespecCost;
    this.respecCostGrowth = respecCostGrowth;
    this.nodeCost = nodeCost;

    this.level = 1;
    this.availablePoints = 0;
    this.respecCount = 0;

    this.allocatedNodes = new Set([this.rootNodeId]);
    const rootNode = this.nodes.get(this.rootNodeId);
    this.rootTier = rootNode.tier;
    this.tierAllocations = new Map();
    this.tierAllocations.set(rootNode.tier, 1);
  }

  getLevel() {
    return this.level;
  }

  getAvailablePoints() {
    return this.availablePoints;
  }

  getAllocatedNodes() {
    return Array.from(this.allocatedNodes);
  }

  getAllocatedCountByTier(tier) {
    return this.tierAllocations.get(tier) || 0;
  }

  getParentNodes(nodeId) {
    return this.parentMap.get(nodeId) || [];
  }

  isUnlocked(nodeId) {
    return this.allocatedNodes.has(nodeId);
  }

  grantLevel(levels = 1) {
    if (levels <= 0) {
      return this.availablePoints;
    }
    this.level += levels;
    this.availablePoints += this.pointsPerLevel * levels;
    return this.availablePoints;
  }

  evaluateUnlock(nodeId) {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`Node "${nodeId}" does not exist.`);
    }

    if (this.isUnlocked(nodeId)) {
      return {
        allowed: false,
        reasons: ['Node already unlocked.'],
        keystone: this.keystoneConfig.get(nodeId) || null
      };
    }

    const reasons = [];

    const cost = this.getNodeCost(nodeId);

    if (this.availablePoints < cost) {
      reasons.push(`Not enough skill points (requires ${cost}).`);
    }

    const parents = this.getParentNodes(nodeId);
    if (nodeId !== this.rootNodeId && parents.length > 0) {
      const missingParents = parents.filter(parentId => !this.isUnlocked(parentId));
      if (missingParents.length > 0) {
        reasons.push(`Requires parent nodes: ${missingParents.join(', ')}.`);
      }
    }

    if (node.tier > this.rootTier) {
      const requirement = this.tierGateRequirements.get(node.tier);
      if (typeof requirement === 'number' && requirement > 0) {
        const previousTier = node.tier - 1;
        const completed = this.getAllocatedCountByTier(previousTier);
        if (completed < requirement) {
          reasons.push(`Requires ${requirement} nodes unlocked in ring ${previousTier}.`);
        }
      }
    }

    const keystone = this.keystoneConfig.get(nodeId);
    if (keystone && keystone.prerequisites) {
      const { nodes: requiredNodes = [], minTierTotals = [] } = keystone.prerequisites;
      const missing = requiredNodes.filter(requiredId => !this.isUnlocked(requiredId));
      if (missing.length > 0) {
        reasons.push(`Keystone prerequisite: unlock ${missing.join(', ')}.`);
      }

      if (Array.isArray(minTierTotals)) {
        minTierTotals.forEach(({ tier, count }) => {
          if (typeof tier === 'number' && typeof count === 'number') {
            const allocated = this.getAllocatedCountByTier(tier);
            if (allocated < count) {
              reasons.push(`Keystone prerequisite: ${count} nodes in ring ${tier}.`);
            }
          }
        });
      }
    }

    return {
      allowed: reasons.length === 0,
      reasons,
      keystone: keystone || null,
      cost
    };
  }

  getNodeStatus(nodeId) {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`Node "${nodeId}" does not exist.`);
    }

    const unlocked = this.isUnlocked(nodeId);
    const cost = this.getNodeCost(nodeId);
    if (unlocked) {
      const keystone = this.keystoneConfig.get(nodeId) || null;
      return {
        unlocked: true,
        available: false,
        reasons: [],
        keystoneModifier: keystone ? keystone.modifier : null,
        cost
      };
    }

    const evaluation = this.evaluateUnlock(nodeId);
    return {
      unlocked: false,
      available: evaluation.allowed,
      reasons: evaluation.reasons,
      keystoneModifier: evaluation.keystone ? evaluation.keystone.modifier : null,
      cost
    };
  }

  unlockNode(nodeId) {
    const evaluation = this.evaluateUnlock(nodeId);
    if (!evaluation.allowed) {
      throw new Error(evaluation.reasons[0] || 'Unable to unlock node.');
    }

    const node = this.nodes.get(nodeId);
    const cost = this.getNodeCost(nodeId);
    this.allocatedNodes.add(nodeId);
    this.availablePoints -= cost;

    const currentCount = this.tierAllocations.get(node.tier) || 0;
    this.tierAllocations.set(node.tier, currentCount + 1);

    return {
      node,
      modifier: evaluation.keystone ? evaluation.keystone.modifier : null,
      cost
    };
  }

  getNodeCost(nodeId) {
    const node = this.nodes.get(nodeId);
    if (!node) {
      return this.nodeCost;
    }
    return typeof node.cost === 'number' ? node.cost : this.nodeCost;
  }

  getRespecCost() {
    return Math.ceil(this.baseRespecCost * Math.pow(this.respecCostGrowth, this.respecCount));
  }

  canRespec() {
    return this.allocatedNodes.size > 1;
  }

  respec() {
    if (!this.canRespec()) {
      throw new Error('No allocated nodes to respec.');
    }

    const refundableNodes = Array.from(this.allocatedNodes).filter(id => id !== this.rootNodeId);
    const refund = refundableNodes.reduce((total, id) => total + this.getNodeCost(id), 0);
    const cost = this.getRespecCost();
    const totalPoints = this.availablePoints + refund;

    if (totalPoints < cost) {
      throw new Error(`Respec requires ${cost} available points.`);
    }

    this.availablePoints = totalPoints - cost;
    this.allocatedNodes = new Set([this.rootNodeId]);
    this.tierAllocations = new Map();
    const rootNode = this.nodes.get(this.rootNodeId);
    this.tierAllocations.set(rootNode.tier, 1);
    this.respecCount += 1;

    return {
      cost,
      refunded: refund,
      remainingPoints: this.availablePoints
    };
  }
}

export function buildKeystoneConfigFromNodes(nodes, arcs, keystoneIds, {
  modifierPrefix = 'Keystone',
  additionalTierRequirement = 0,
  overrides = {}
} = {}) {
  const nodeById = new Map(nodes.map(node => [node.id, node]));
  const config = {};
  const overrideEntries = overrides || {};

  const mergeMinTierTotals = (base = [], extra = []) => {
    const totals = new Map();
    [...base, ...extra].forEach(entry => {
      if (!entry || typeof entry.tier !== 'number' || typeof entry.count !== 'number') {
        return;
      }
      const existing = totals.get(entry.tier) || 0;
      totals.set(entry.tier, Math.max(existing, entry.count));
    });
    return Array.from(totals.entries()).map(([tier, count]) => ({ tier, count }));
  };

  keystoneIds.forEach(nodeId => {
    const node = nodeById.get(nodeId);
    if (!node) {
      return;
    }

    const parentCandidates = [];
    arcs.forEach(arc => {
      if (arc.from === nodeId) {
        parentCandidates.push(arc.to);
      } else if (arc.to === nodeId) {
        parentCandidates.push(arc.from);
      }
    });

    const parentNodes = parentCandidates
      .map(parentId => nodeById.get(parentId))
      .filter(parentNode => parentNode && parentNode.tier < node.tier)
      .map(parentNode => parentNode.id);

    const uniqueParents = Array.from(new Set(parentNodes));
    const selectedParents = uniqueParents.slice(0, 2);

    const baseModifier = `${modifierPrefix}: ${node.primaryStat || 'Mastery'} Keystone`;
    const basePrerequisites = {
      nodes: selectedParents,
      minTierTotals: additionalTierRequirement > 0
        ? [{ tier: node.tier - 1, count: additionalTierRequirement }]
        : []
    };

    const override = overrideEntries[nodeId] || {};
    const overridePrereq = override.prerequisites || {};
    const overrideNodes = Array.isArray(overridePrereq.nodes) ? overridePrereq.nodes : [];
    const combinedNodes = Array.from(new Set([...basePrerequisites.nodes, ...overrideNodes]));
    const combinedTierTotals = mergeMinTierTotals(
      basePrerequisites.minTierTotals,
      Array.isArray(overridePrereq.minTierTotals) ? overridePrereq.minTierTotals : []
    );

    config[nodeId] = {
      modifier: override.modifier || baseModifier,
      prerequisites: {
        nodes: combinedNodes,
        minTierTotals: combinedTierTotals
      },
      bonus: override.bonus || null,
      penalty: override.penalty || null,
      name: override.name || undefined,
      cost: typeof override.cost === 'number' ? override.cost : undefined
    };
  });

  return config;
}

export function createDefaultTierRequirements(maxTier) {
  const requirements = new Map();
  for (let tier = 1; tier <= maxTier; tier++) {
    requirements.set(tier, tier * 2);
  }
  return requirements;
}
