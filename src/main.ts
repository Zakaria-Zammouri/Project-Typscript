
import {
  type Wizard,
  type AcademyEvent,
  type House,
  type HousePoints,
  type SpellOutput,
  type ArrayElement,
  type WizardSummary,
  type WizardUpdate,
  type AttackSpell,
  type NonHealingCategory,
  type NewWizard,
  type SpellCastEvent,
  type SpellCategory,
  type Spell
} from "./types";

import {
  WizardRepository,
  SpellRepository
} from "./repository";

import { Cache, Log } from "./decorators";

function isHouse(value: unknown): value is House {
  return (
    value === "Gryffindor" ||
    value === "Slytherin" ||
    value === "Ravenclaw" ||
    value === "Hufflepuff"
  );
}

function isWizard(value: unknown): value is Wizard {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    isHouse(candidate.house) &&
    typeof candidate.level === "number" &&
    typeof candidate.active === "boolean"
  );
}

class AcademyService {
  constructor(
    private readonly wizards: WizardRepository,
    private readonly spells: SpellRepository
  ) {}

  @Log
  castSpell(wizardId: number, spellId: number): string {
    const wizard = this.wizards.findById(wizardId);
    const spell = this.spells.findById(spellId);

    if (!wizard || !spell) {
      throw new Error("Wizard or spell not found.");
    }

    return `${wizard.name} casts ${spell.name}!`;
  }

  @Cache
  findByHouse(house: House): WizardSummary[] {
    return this.wizards
      .findByHouse(house)
      .map(({ id, name, house }) => ({
        id,
        name,
        house
      }));
  }

  updateWizard(id: number, changes: WizardUpdate): boolean {
    return this.wizards.update(id, changes);
  }

  getSpellEvents(events: AcademyEvent[]): SpellCastEvent[] {
    return events.filter(
      (event): event is SpellCastEvent =>
        event.type === "spell-cast"
    );
  }
}

const wizards = new WizardRepository();
const spells = new SpellRepository();

console.log("\n--- Exercise 1: Add a wizard ---");

const newWizard: NewWizard = {
  name: "Harry Potter",
  house: "Gryffindor",
  level: 5,
  active: true,
  patronus: "Stag"
};

const harry = wizards.addWizard(newWizard);

console.log(harry);

wizards.addWizard({
  name: "Hermione Granger",
  house: "Gryffindor",
  level: 8,
  active: true
});

wizards.addWizard({
  name: "Draco Malfoy",
  house: "Slytherin",
  level: 6,
  active: true
});

spells.add({
  id: 101,
  name: "Expelliarmus",
  category: "attack",
  power: 80
});

spells.add({
  id: 102,
  name: "Protego",
  category: "defense",
  power: 60
});

const academy = new AcademyService(wizards, spells);

console.log("\n--- Exercise 2: Find wizards by house ---");
console.log(academy.findByHouse("Gryffindor"));

console.log("\n--- Exercise 3: Extract spell-cast events ---");

const events: AcademyEvent[] = [
  {
    type: "spell-cast",
    wizardId: harry.id,
    spellName: "Lumos"
  },
  {
    type: "level-up",
    wizardId: 2,
    newLevel: 9
  },
  {
    type: "wizard-expelled",
    wizardId: 3
  }
];

console.log(academy.getSpellEvents(events));

console.log("\n--- Exercise 4: Validate spell power ---");

try {
  spells.add({
    id: 103,
    name: "Invalid Spell",
    category: "attack",
    power: -10
  });
} catch (error: unknown) {
  console.log(
    error instanceof Error ? error.message : error
  );
}

spells.add({
  id: 104,
  name: "Lumos",
  category: "healing",
  power: 10
});

console.log("\n--- Exercise 5: Cache decorator ---");

console.log(academy.findByHouse("Gryffindor"));
console.log(academy.findByHouse("Gryffindor"));

console.log("\n--- Exercise 6: Type guard ---");

const unknownWizard: unknown = wizards.findById(harry.id);

if (isWizard(unknownWizard)) {
  console.log(
    `${unknownWizard.name} belongs to ${unknownWizard.house}`
  );
}

console.log("Valid house:", isHouse("Gryffindor"));
console.log("Invalid house:", isHouse("Durmstrang"));

console.log("\n--- Utility type examples ---");

const points: HousePoints = {
  Gryffindor: 100,
  Slytherin: 80,
  Ravenclaw: 90,
  Hufflepuff: 70
};

console.log(points);

type CastArguments =
  Parameters<AcademyService["castSpell"]>;

type CastResult =
  ReturnType<AcademyService["castSpell"]>;

type AttackOutput = SpellOutput<"attack">;
type HealingOutput = SpellOutput<"healing">;
type SpellItem = ArrayElement<Spell[]>;
type AttackSpellExample = AttackSpell;
type RemainingCategories = NonHealingCategory;
type CategoryExample = SpellCategory;

const typeExamples: [
  CastArguments,
  CastResult,
  AttackOutput,
  HealingOutput,
  SpellItem,
  AttackSpellExample["category"],
  RemainingCategories,
  CategoryExample
] | null = null;

void typeExamples;
