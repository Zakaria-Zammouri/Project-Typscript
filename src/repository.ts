
import type {
  Wizard,
  Spell,
  House,
  NewWizard
} from "./types";

import {
  Log,
  MeasureTime,
  ValidateSpellPower
} from "./decorators";

export class Repository<T extends { id: number }> {
  protected items: T[] = [];

  @Log
  add(item: T): void {
    this.items.push(item);
  }

  @MeasureTime
  findById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  update(id: number, changes: Partial<T>): boolean {
    const item = this.findById(id);

    if (!item) {
      return false;
    }

    Object.assign(item, changes);
    return true;
  }
}

export class WizardRepository extends Repository<Wizard> {
  addWizard(newWizard: NewWizard): Wizard {
    const nextId =
      this.items.reduce(
        (maxId, wizard) => Math.max(maxId, wizard.id),
        0
      ) + 1;

    const wizard: Wizard = {
      ...newWizard,
      id: nextId
    };

    this.add(wizard);

    return wizard;
  }

  findByHouse(house: House): Wizard[] {
    return this.items.filter(
      (wizard) => wizard.house === house
    );
  }
}

export class SpellRepository extends Repository<Spell> {
  @ValidateSpellPower
  override add(spell: Spell): void {
    super.add(spell);
  }
}
